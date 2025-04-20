using EtudeBackend.Features.TrainingRequests.DTOs;

namespace EtudeBackend.Features.TrainingRequests.Services;

public interface IUserStatisticsService
{
    Task<List<UserStatisticsDto>> GetAllStatisticsAsync();
    Task<UserStatisticsDto?> GetStatisticsByIdAsync(Guid id);
    Task<List<UserStatisticsDto>> GetStatisticsByCourseIdAsync(int courseId);
    Task<List<UserStatisticsDto>> GetStatisticsByUserIdAsync(int userId);
    Task<UserStatisticsDto?> GetStatisticsByUserAndCourseAsync(int userId, int courseId);
    Task<UserStatisticsDto> CreateStatisticsAsync(CreateUserStatisticsDto statisticsDto);
    Task<UserStatisticsDto?> UpdateStatisticsAsync(Guid id, UpdateUserStatisticsDto statisticsDto);
    Task<bool> DeleteStatisticsAsync(Guid id);
}