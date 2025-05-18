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

        return await _dbSet
            .Where(ct => ct.Type.ToString().ToLower().Contains(type.ToLower()))
            .OrderByDescending(ct => ct.CreatedAt)
            .ToListAsync();
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

        return await _dbSet
            .Where(ct => ct.Track.ToString().ToLower().Contains(track.ToLower()))
            .OrderByDescending(ct => ct.CreatedAt)
            .ToListAsync();
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

        return await _dbSet
            .Where(ct => ct.Format.ToString().ToLower().Contains(format.ToLower()))
            .OrderByDescending(ct => ct.CreatedAt)
            .ToListAsync();
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
                    query = query.Where(ct => ct.Name.ToLower().Contains(filter.Value.ToLower()));
                    break;
                case "type":
                    if (Enum.TryParse<CourseType>(filter.Value, true, out var courseType))
                    {
                        query = query.Where(ct => ct.Type == courseType);
                    }
                    else
                    {
                        query = query.Where(ct => ct.Type.ToString().ToLower().Contains(filter.Value.ToLower()));
                    }
                    break;
                case "track":
                    if (Enum.TryParse<CourseTrack>(filter.Value, true, out var courseTrack))
                    {
                        query = query.Where(ct => ct.Track == courseTrack);
                    }
                    else
                    {
                        query = query.Where(ct => ct.Track.ToString().ToLower().Contains(filter.Value.ToLower()));
                    }
                    break;
                case "format":
                    if (Enum.TryParse<CourseFormat>(filter.Value, true, out var courseFormat))
                    {
                        query = query.Where(ct => ct.Format == courseFormat);
                    }
                    else
                    {
                        query = query.Where(ct => ct.Format.ToString().ToLower().Contains(filter.Value.ToLower()));
                    }
                    break;
                case "trainingcenter":
                    query = query.Where(ct => ct.TrainingCenter.ToLower().Contains(filter.Value.ToLower()));
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
                case "id":
                    if (Guid.TryParse(filter.Value, out var templateId))
                    {
                        query = query.Where(ct => ct.Id == templateId);
                    }
                    break;
            }
        }

        return await query.OrderByDescending(ct => ct.CreatedAt).ToListAsync();
    }
}