using System.ComponentModel.DataAnnotations.Schema;

namespace api.Models;

public class CodingSession
{
    public int Id { get; set; }
    public DateTime StartTime { get; set; }
    public DateTime? EndTime { get; set; }
    public TimeSpan? Duration { get; set; }
    public int FocusLevel { get; set; }
    public string? Notes { get; set; }

    
    public string AppUserId { get; set; }
    [ForeignKey("AppUserId")]
    public AppUser AppUser { get; set; }
}