using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Repositories;

public class ApplicationRepository : Repository<Application>, IApplicationRepository
{
    public ApplicationRepository(ApplicationDbContext context) : base(context)
    {
    }

    public IQueryable<Application> GetAllQuery()
    {
        return _dbSet.AsQueryable();
    }

    public Task<List<Application>> GetByCourseIdAsync(Guid courseId)
    {
        return _dbSet
            .Where(a => a.CourseId == courseId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public Task<List<Application>> GetByAuthorIdAsync(string authorId) // Изменяем тип на string
    {
        return _dbSet
            .Where(a => a.AuthorId == authorId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public Task<List<Application>> GetByStatusIdAsync(Guid statusId)
    {
        return _dbSet
            .Where(a => a.StatusId == statusId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public Task<List<Application>> GetBySoloDocIdAsync(Guid soloDocId)
    {
        return _dbSet
            .Where(a => a.SoloDocId == soloDocId)
            .OrderByDescending(a => a.CreatedAt)
            .ToListAsync();
    }

    public Task<Application?> GetApplicationWithDetailsAsync(Guid id)
    {
        return _dbSet
            .Include(a => a.Course)
            .Include(a => a.Status)
            .Include(a => a.Author)
            .FirstOrDefaultAsync(a => a.Id == id);
    }
}