using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Repositories
{
    public interface IUserStatisticsRepository : IRepository<UserStatistics>
    {
        Task<List<UserStatistics>> GetByCourseIdAsync(Guid courseId);  // Изменено с int на Guid
    Task<List<UserStatistics>> GetByUserIdAsync(int userId);
        Task<UserStatistics?> GetByUserAndCourseIdAsync(int userId, Guid courseId);  // Изменено с int на Guid
}
}
