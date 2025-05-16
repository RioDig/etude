namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class PastEventDto
{
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public StatusDto Status { get; set; } = new StatusDto();
    public CourseDetailDto Course { get; set; } = new CourseDetailDto();
}