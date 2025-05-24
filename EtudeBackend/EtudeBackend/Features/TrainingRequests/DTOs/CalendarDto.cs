namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class DownloadIcsRequestDto
{
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}