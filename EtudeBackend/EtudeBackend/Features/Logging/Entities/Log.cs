// EtudeBackend/EtudeBackend/Features/Logging/Entities/Log.cs
using System.ComponentModel.DataAnnotations.Schema;
using EtudeBackend.Shared.Data;

namespace EtudeBackend.Features.Logging.Entities;

public class Log
{
    public int Id { get; set; }
    
    public string UserId { get; set; } = string.Empty;
    
    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset EventTimestamp { get; set; } = DateTimeOffset.UtcNow;
    
    public int EventTypeId { get; set; }
    
    public string Message { get; set; } = string.Empty;
    
    public string IPAddress { get; set; } = string.Empty;
    
    public int? ObjectId { get; set; }
    
    public string ObjectType { get; set; } = string.Empty;
    
    // Навигационные свойства
    public virtual EventType EventType { get; set; } = null!;
    public virtual ApplicationUser User { get; set; } = null!;
}