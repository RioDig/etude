using EtudeBackend.Features.Templates.Entities;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.Templates.Repositories;

public interface ICourseTemplateRepository : IRepository<CourseTemplate>
{
    Task<CourseTemplate?> GetByNameAsync(string name);
    Task<List<CourseTemplate>> GetByTypeAsync(string type);
    Task<List<CourseTemplate>> GetByTrackAsync(string track);
    Task<List<CourseTemplate>> GetByFormatAsync(string format);
    Task<List<CourseTemplate>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate);
    Task<List<CourseTemplate>> FilterByAsync(Dictionary<string, string> filters);
}