using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using System.Collections.Generic;

namespace api.Controllers
{
    [ApiController]
    [Route("api/ai")]
    public class AiController : ControllerBase
    {
        public class ChatRequest
        {
            public string Message { get; set; }
            public List<ChatMessage> History { get; set; }
        }
        public class ChatMessage
        {
            public string Role { get; set; }
            public string Content { get; set; }
        }
        public class ChatResponse
        {
            public string Reply { get; set; }
        }

        [HttpPost("chat")]
        public async Task<IActionResult> Chat([FromBody] ChatRequest request)
        {
            // TODO: Replace with real AI logic or API call
            var reply = $"Echo: {request.Message}";
            await Task.Delay(500); // Simulate processing
            return Ok(new ChatResponse { Reply = reply });
        }
    }
}
