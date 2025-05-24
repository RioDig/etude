namespace EtudeBackend.Features.TrainingRequests.Services;

public interface ICalendarService
{
    Task<string> GenerateIcsCalendarAsync(DateOnly startDate, DateOnly endDate);
}