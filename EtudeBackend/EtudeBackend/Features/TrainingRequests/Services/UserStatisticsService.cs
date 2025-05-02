using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Services;

public class UserStatisticsService : IUserStatisticsService
{
    private readonly IUserStatisticsRepository _repository;
    private readonly IMapper _mapper;

    public UserStatisticsService(IUserStatisticsRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<UserStatisticsDto>> GetAllStatisticsAsync()
    {
        var statistics = await _repository.GetAllAsync();
        return _mapper.Map<List<UserStatisticsDto>>(statistics);
    }

    public async Task<UserStatisticsDto?> GetStatisticsByIdAsync(Guid id)
    {
        var statistics = await _repository.GetByIdAsync(id);
        return statistics != null ? _mapper.Map<UserStatisticsDto>(statistics) : null;
    }

    public async Task<List<UserStatisticsDto>> GetStatisticsByCourseIdAsync(int courseId)
    {
        var statistics = await _repository.GetByCourseIdAsync(Guid.Parse(courseId.ToString()));
        return _mapper.Map<List<UserStatisticsDto>>(statistics);
    }

    public async Task<List<UserStatisticsDto>> GetStatisticsByUserIdAsync(int userId)
    {
        var statistics = await _repository.GetByUserIdAsync(userId.ToString());
        return _mapper.Map<List<UserStatisticsDto>>(statistics);
    }

    public async Task<UserStatisticsDto?> GetStatisticsByUserAndCourseAsync(int userId, int courseId)
    {
        var statistics = await _repository.GetByUserAndCourseIdAsync(
            userId.ToString(), 
            Guid.Parse(courseId.ToString()));
            
        return statistics != null ? _mapper.Map<UserStatisticsDto>(statistics) : null;
    }

    public async Task<UserStatisticsDto> CreateStatisticsAsync(CreateUserStatisticsDto statisticsDto)
    {
        var statistics = _mapper.Map<UserStatistics>(statisticsDto);
        
        var createdStatistics = await _repository.AddAsync(statistics);
        return _mapper.Map<UserStatisticsDto>(createdStatistics);
    }

    public async Task<UserStatisticsDto?> UpdateStatisticsAsync(Guid id, UpdateUserStatisticsDto statisticsDto)
    {
        var statistics = await _repository.GetByIdAsync(id);
        if (statistics == null)
            return null;

        // Обновляем только заданные поля
        if (statisticsDto.EnrollmentDate.HasValue)
            statistics.EnrollmentDate = statisticsDto.EnrollmentDate;
            
        if (statisticsDto.CompletionDate.HasValue)
            statistics.CompletionDate = statisticsDto.CompletionDate;
            
        if (statisticsDto.AttendanceRate.HasValue)
            statistics.AttendanceRate = statisticsDto.AttendanceRate;
            
        if (statisticsDto.CertificateIssued.HasValue)
            statistics.CertificateIssued = statisticsDto.CertificateIssued.Value;

        await _repository.UpdateAsync(statistics);
        return _mapper.Map<UserStatisticsDto>(statistics);
    }

    public async Task<bool> DeleteStatisticsAsync(Guid id)
    {
        var statistics = await _repository.GetByIdAsync(id);
        if (statistics == null)
            return false;

        await _repository.RemoveAsync(statistics);
        return true;
    }
}