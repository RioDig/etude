// EtudeBackend/EtudeBackend/Features/TrainingRequests/Repositories/IUserStatisticsRepository.cs
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Repositories
{
    public interface IUserStatisticsRepository : IRepository<UserStatistics>
    {
        Task<List<UserStatistics>> GetByCourseIdAsync(Guid courseId);
        Task<List<UserStatistics>> GetByUserIdAsync(string userId);
        Task<UserStatistics?> GetByUserAndCourseIdAsync(string userId, Guid courseId); // Изменяем тип на string
    }
}