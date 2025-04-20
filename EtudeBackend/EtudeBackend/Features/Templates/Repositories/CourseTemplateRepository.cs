using EtudeBackend.Features.Templates.Entities;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.Templates.Repositories;

public class CourseTemplateRepository : Repository<CourseTemplate>, ICourseTemplateRepository
{
    public CourseTemplateRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<CourseTemplate?> GetByNameAsync(string name)
    {
        return await _dbSet
            .FirstOrDefaultAsync(ct => ct.Name == name);
    }

    public async Task<List<CourseTemplate>> GetByTypeAsync(CourseType type)
    {
        return await _dbSet
            .Where(ct => ct.Type == type)
            .OrderByDescending(ct => ct.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<CourseTemplate>> GetByTrackAsync(CourseTrack track)
    {
        return await _dbSet
            .Where(ct => ct.Track == track)
            .OrderByDescending(ct => ct.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<CourseTemplate>> GetByFormatAsync(CourseFormat format)
    {
        return await _dbSet
            .Where(ct => ct.Format == format)
            .OrderByDescending(ct => ct.CreatedAt)
            .ToListAsync();
    }
}