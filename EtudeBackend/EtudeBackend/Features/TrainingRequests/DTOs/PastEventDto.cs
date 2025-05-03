namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class PastEventDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}