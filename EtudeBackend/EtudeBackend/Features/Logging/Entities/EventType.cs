namespace EtudeBackend.Features.Logging.Entities;

public class EventType
{
    public int Id { get; set; }
    
    public string Type { get; set; } = string.Empty;
    
    public string Description { get; set; } = string.Empty;
    
    public virtual ICollection<Log> Logs { get; set; } = new List<Log>();
}