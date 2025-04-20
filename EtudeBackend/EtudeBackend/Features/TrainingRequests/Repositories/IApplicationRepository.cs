using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Repositories;

public interface IApplicationRepository : IRepository<Application>
{
    IQueryable<Application> GetAllQuery();
    Task<List<Application>> GetByCourseIdAsync(Guid courseId);
    Task<List<Application>> GetByAuthorIdAsync(int authorId);
    Task<List<Application>> GetByStatusIdAsync(Guid statusId);
    Task<List<Application>> GetBySoloDocIdAsync(Guid soloDocId);
    Task<Application?> GetApplicationWithDetailsAsync(Guid id);
}