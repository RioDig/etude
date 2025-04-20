using EtudeBackend.Features.Templates.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.Templates.Services;

public interface ICourseTemplateService
{
    Task<List<CourseTemplateDto>> GetAllTemplatesAsync();
    Task<CourseTemplateDto?> GetTemplateByIdAsync(Guid id);
    Task<CourseTemplateDto?> GetTemplateByNameAsync(string name);
    Task<List<CourseTemplateDto>> GetTemplatesByTypeAsync(CourseType type);
    Task<List<CourseTemplateDto>> GetTemplatesByTrackAsync(CourseTrack track);
    Task<List<CourseTemplateDto>> GetTemplatesByFormatAsync(CourseFormat format);
    Task<CourseTemplateDto> CreateTemplateAsync(CreateCourseTemplateDto templateDto);
    Task<CourseTemplateDto?> UpdateTemplateAsync(Guid id, UpdateCourseTemplateDto templateDto);
    Task<bool> DeleteTemplateAsync(Guid id);
}