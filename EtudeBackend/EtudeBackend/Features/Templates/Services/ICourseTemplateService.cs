using EtudeBackend.Features.Templates.DTOs;

namespace EtudeBackend.Features.Templates.Services;

public interface ICourseTemplateService
{
    Task<List<CourseTemplateDto>> GetAllTemplatesAsync();
    Task<CourseTemplateDto?> GetTemplateByIdAsync(Guid id);
    Task<CourseTemplateDto?> GetTemplateByNameAsync(string name);
    Task<List<CourseTemplateDto>> GetTemplatesByTypeAsync(string type);
    Task<List<CourseTemplateDto>> GetTemplatesByTrackAsync(string track);
    Task<List<CourseTemplateDto>> GetTemplatesByFormatAsync(string format);
    Task<List<CourseTemplateDto>> GetTemplatesByFiltersAsync(List<CourseTemplateFilterDto> filters);
    Task<CourseTemplateDto> CreateTemplateAsync(CreateCourseTemplateDto templateDto);
    Task<CourseTemplateDto?> UpdateTemplateAsync(UpdateCourseTemplateDto templateDto);
    Task<bool> DeleteTemplateAsync(Guid id);
}