using EtudeBackend.Features.Templates.Entities;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.Templates.Repositories;

public interface ICourseTemplateRepository : IRepository<CourseTemplate>
{
    Task<CourseTemplate?> GetByNameAsync(string name);
    Task<List<CourseTemplate>> GetByTypeAsync(CourseType type);
    Task<List<CourseTemplate>> GetByTrackAsync(CourseTrack track);
    Task<List<CourseTemplate>> GetByFormatAsync(CourseFormat format);
}