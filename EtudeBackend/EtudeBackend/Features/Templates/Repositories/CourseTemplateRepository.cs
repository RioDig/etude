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

    public async Task<List<CourseTemplate>> GetByTypeAsync(string type)
    {
        if (Enum.TryParse<CourseType>(type, true, out var courseType))
        {
            return await _dbSet
                .Where(ct => ct.Type == courseType)
                .OrderByDescending(ct => ct.CreatedAt)
                .ToListAsync();
        }

        return new List<CourseTemplate>();
    }

    public async Task<List<CourseTemplate>> GetByTrackAsync(string track)
    {
        if (Enum.TryParse<CourseTrack>(track, true, out var courseTrack))
        {
            return await _dbSet
                .Where(ct => ct.Track == courseTrack)
                .OrderByDescending(ct => ct.CreatedAt)
                .ToListAsync();
        }

        return new List<CourseTemplate>();
    }

    public async Task<List<CourseTemplate>> GetByFormatAsync(string format)
    {
        if (Enum.TryParse<CourseFormat>(format, true, out var courseFormat))
        {
            return await _dbSet
                .Where(ct => ct.Format == courseFormat)
                .OrderByDescending(ct => ct.CreatedAt)
                .ToListAsync();
        }

        return new List<CourseTemplate>();
    }

    public async Task<List<CourseTemplate>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate)
    {
        return await _dbSet
            .Where(ct => ct.StartDate >= startDate && ct.EndDate <= endDate)
            .OrderBy(ct => ct.StartDate)
            .ToListAsync();
    }

    public async Task<List<CourseTemplate>> FilterByAsync(Dictionary<string, string> filters)
    {
        var query = _dbSet.AsQueryable();

        foreach (var filter in filters)
        {
            switch (filter.Key.ToLower())
            {
                case "name":
                    query = query.Where(ct => ct.Name.Contains(filter.Value));
                    break;
                case "type":
                    if (Enum.TryParse<CourseType>(filter.Value, true, out var courseType))
                    {
                        query = query.Where(ct => ct.Type == courseType);
                    }
                    break;
                case "track":
                    if (Enum.TryParse<CourseTrack>(filter.Value, true, out var courseTrack))
                    {
                        query = query.Where(ct => ct.Track == courseTrack);
                    }
                    break;
                case "format":
                    if (Enum.TryParse<CourseFormat>(filter.Value, true, out var courseFormat))
                    {
                        query = query.Where(ct => ct.Format == courseFormat);
                    }
                    break;
                case "trainingcenter":
                    query = query.Where(ct => ct.TrainingCenter.Contains(filter.Value));
                    break;
                case "startdate":
                    if (DateOnly.TryParse(filter.Value, out var startDate))
                    {
                        query = query.Where(ct => ct.StartDate >= startDate);
                    }
                    break;
                case "enddate":
                    if (DateOnly.TryParse(filter.Value, out var endDate))
                    {
                        query = query.Where(ct => ct.EndDate <= endDate);
                    }
                    break;
            }
        }

        return await query.OrderByDescending(ct => ct.CreatedAt).ToListAsync();
    }
}