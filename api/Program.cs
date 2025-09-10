using api.Data;
using Microsoft.EntityFrameworkCore;
using api.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapPost("/codingsessions", async (CodingSession session, ApplicationDbContext db) =>
{
    db.CodingSessions.Add(session);
    await db.SaveChangesAsync();
    return Results.Created($"/codingsessions/{session.Id}", session);
});

app.Run();