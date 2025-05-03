using EtudeBackend.Features.TrainingRequests.DTOs;

namespace EtudeBackend.Features.TrainingRequests.Services;

public interface IUserStatisticsService
{
    Task<List<CompetencyDto>> GetCompetenciesAsync();
    Task<List<PastEventDto>> GetPastEventsAsync();
}