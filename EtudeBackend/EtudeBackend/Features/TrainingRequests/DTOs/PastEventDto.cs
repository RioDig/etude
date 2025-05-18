using System.Text.Json.Serialization;

namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class PastEventDto
{
    [JsonPropertyName("application_id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("created_at")]
    public DateTimeOffset CreatedAt { get; set; }
    
    public StatusDto Status { get; set; } = new StatusDto();
    public CourseDetailDto Course { get; set; } = new CourseDetailDto();
}