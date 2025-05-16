using EtudeBackend.Features.TrainingRequests.DTOs;

namespace EtudeBackend.Features.TrainingRequests.Services;

public interface IUserStatisticsService
{
    /// <summary>
    /// Получает список компетенций текущего пользователя
    /// </summary>
    /// <returns>Список компетенций</returns>
    Task<List<CompetencyDto>> GetCompetenciesAsync();
    
    /// <summary>
    /// Получает список прошедших мероприятий текущего пользователя
    /// </summary>
    /// <returns>Список прошедших мероприятий, отсортированный по дате окончания (сначала новые)</returns>
    Task<List<PastEventDto>> GetPastEventsAsync();
}