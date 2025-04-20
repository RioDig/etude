using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Repositories;

public interface ICourseRepository : IRepository<Course>
{
    Task<List<Course>> GetByCourseNameAsync(string courseName);
    Task<List<Course>> GetByTypeAsync(CourseType type);
    Task<List<Course>> GetByTrackAsync(CourseTrack track);
    Task<List<Course>> GetByFormatAsync(CourseFormat format);
    Task<List<Course>> GetByDateRangeAsync(DateOnly startDate, DateOnly endDate);
    Task<List<Course>> GetActiveCoursesAsync();
}