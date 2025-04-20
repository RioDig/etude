using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.TrainingRequests.Repositories;

public class CourseRepository : Repository<Course>, ICourseRepository
{
    public CourseRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<List<Course>> GetByCourseNameAsync(string courseName)
    {
        return await _dbSet
            .Where(c => c.Name.Contains(courseName))
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Course>> GetByTypeAsync(CourseType type)
    {
        return await _dbSet
            .Where(c => c.Type == type)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Course>> GetByTrackAsync(CourseTrack track)
    {
        return await _dbSet
            .Where(c => c.Track == track)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Course>> GetByFormatAsync(CourseFormat format)
    {
        return await _dbSet
            .Where(c => c.Format == format)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }

    public async Task<List<Course>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate)
    {
        return await _dbSet
            .Where(c => c.StartDate >= startDate && c.EndDate <= endDate)
            .OrderBy(c => c.StartDate)
            .ToListAsync();
    }

    public async Task<List<Course>> GetActiveCoursesAsync()
    {
        return await _dbSet
            .Where(c => c.IsActive)
            .OrderByDescending(c => c.CreatedAt)
            .ToListAsync();
    }
}