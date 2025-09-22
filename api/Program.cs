
using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Models;
using System.Text.Json;
using api.Hubs;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
// using api.Services;
using System.Security.Claims; // We need this for reading the ticket


var builder = WebApplication.CreateBuilder(args);
// ... (rest of the services setup is the same)
var MyAllowSpecificOrigins = "_myAllowSpecificOrigins";

builder.Services.AddCors(options =>
{
    options.AddPolicy(name: MyAllowSpecificOrigins,
        policy =>
        {
            policy.WithOrigins("http://localhost:5173")
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

builder.Services.AddHttpClient();
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
builder.Services.AddScoped<TokenService>();


builder.Services.AddIdentity<AppUser, IdentityRole>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = true;
    options.Password.RequireUppercase = true;
    options.Password.RequiredLength = 6;
}).AddEntityFrameworkStores<ApplicationDbContext>();

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme =
    options.DefaultChallengeScheme =
    options.DefaultForbidScheme =
    options.DefaultScheme =
    options.DefaultSignInScheme =
    options.DefaultSignOutScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidIssuer = builder.Configuration["JWT:Issuer"],
        ValidateAudience = true,
        ValidAudience = builder.Configuration["JWT:Audience"],
        ValidateIssuerSigningKey = true,
        IssuerSigningKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(builder.Configuration["JWT:SigningKey"])
        )
    };
});

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors(MyAllowSpecificOrigins);
app.UseAuthentication();
app.UseAuthorization();

var authGroup = app.MapGroup("/api/auth");
authGroup.MapPost("/register", async (RegisterDto registerDto, UserManager<AppUser> userManager) =>
{
    var user = new AppUser {
        UserName = registerDto.Username,
        Email = registerDto.Email
    };
    var result = await userManager.CreateAsync(user, registerDto.Password);
    if (!result.Succeeded) return Results.BadRequest(result.Errors);
    return Results.Ok(new { message = "User registered successfully! You can now log in." });
});
authGroup.MapPost("/login", async (LoginDto loginDto, UserManager<AppUser> userManager, TokenService tokenService) =>
{
    var user = await userManager.FindByEmailAsync(loginDto.Email);
    if (user is null || !await userManager.CheckPasswordAsync(user, loginDto.Password))
    {
        return Results.Unauthorized();
    }
    var token = tokenService.CreateToken(user);
    var authResponse = new AuthResponseDto(user.Email, user.UserName, token);
    return Results.Ok(authResponse);
});



// --- UPDATED AND SECURED ENDPOINT ---
app.MapPost("/codingsessions", async (CodingSession session, ApplicationDbContext db, IHubContext<SessionHub> hubContext, ClaimsPrincipal user) =>
{
    // Find the logged-in user's ID from their ticket
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    if (userId == null) return Results.Unauthorized();

    // Attach the user's ID to the new session
    session.AppUserId = userId;

    db.CodingSessions.Add(session);
    await db.SaveChangesAsync();
    await hubContext.Clients.All.SendAsync("ReceiveNewSession");
    return Results.Created($"/codingsessions/{session.Id}", session);
}).RequireAuthorization(); // This locks the door so only logged-in users can use it

// The other endpoints are still here...
app.MapGet("/codingsessions", async (ApplicationDbContext db, ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var sessions = await db.CodingSessions.Where(s => s.AppUserId == userId).OrderByDescending(s => s.StartTime).ToListAsync();
    return Results.Ok(sessions);
}).RequireAuthorization();

app.MapDelete("/codingsessions/{id}", async (int id, ApplicationDbContext db, IHubContext<SessionHub> hubContext, ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var session = await db.CodingSessions.FindAsync(id);
    if (session is null || session.AppUserId != userId) return Results.NotFound();

    db.CodingSessions.Remove(session);
    await db.SaveChangesAsync();
    await hubContext.Clients.All.SendAsync("ReceiveNewSession");
    return Results.NoContent();
}).RequireAuthorization();

app.MapPut("/codingsessions/{id}", async (int id, CodingSession updatedSession, ApplicationDbContext db, IHubContext<SessionHub> hubContext, ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var session = await db.CodingSessions.FindAsync(id);
    if (session is null || session.AppUserId != userId) return Results.NotFound();

    session.Notes = updatedSession.Notes;
    session.FocusLevel = updatedSession.FocusLevel;

    await db.SaveChangesAsync();
    await hubContext.Clients.All.SendAsync("ReceiveNewSession");
    return Results.Ok(session);
}).RequireAuthorization();

app.MapPost("/codingsessions/{id}/analyze", async (int id, ApplicationDbContext db, IConfiguration config, IHttpClientFactory httpClientFactory, ClaimsPrincipal user) =>
{
    var userId = user.FindFirstValue(ClaimTypes.NameIdentifier);
    var session = await db.CodingSessions.FindAsync(id);
    if (session is null || session.AppUserId != userId) return Results.NotFound("Session or notes not found.");

    // ... rest of AI logic is the same ...
    var apiKey = config["GeminiApiKey"];
    if (string.IsNullOrEmpty(apiKey)) { return Results.Problem("AI API Key is not configured."); }
    var client = httpClientFactory.CreateClient();
    var apiUrl = $"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";
    var prompt = $"You are a senior software developer... User's notes: '{session.Notes}'.";
    var requestBody = new { contents = new[] { new { parts = new[] { new { text = prompt } } } } };
    var response = await client.PostAsJsonAsync(apiUrl, requestBody);
    if (!response.IsSuccessStatusCode) { return Results.Problem("Failed to get a response from the AI."); }
    using var jsonDoc = await System.Text.Json.JsonDocument.ParseAsync(await response.Content.ReadAsStreamAsync());
    var advice = jsonDoc.RootElement.GetProperty("candidates")[0].GetProperty("content").GetProperty("parts")[0].GetProperty("text").GetString();
    return Results.Ok(new { advice });
}).RequireAuthorization();

app.MapHub<SessionHub>("/sessionHub");
app.Run();