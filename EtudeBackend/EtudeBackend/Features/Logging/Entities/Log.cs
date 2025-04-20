using System.ComponentModel.DataAnnotations.Schema;

namespace EtudeBackend.Features.Logging.Entities;

public class Log
{
    public int Id { get; set; }
    
    public int UserId { get; set; }
    
    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset EventTimestamp { get; set; } = DateTimeOffset.UtcNow;
    
    public int EventTypeId { get; set; }
    
    public string Message { get; set; } = string.Empty;
    
    public string IPAddress { get; set; } = string.Empty;
    
    public int? ObjectId { get; set; }
    
    public string ObjectType { get; set; } = string.Empty;
    
    // Навигационные свойства
    public virtual EventType EventType { get; set; }
    public virtual EtudeBackend.Features.Users.Entities.User User { get; set; }
}