using EtudeBackend.Features.Templates.DTOs;

namespace EtudeBackend.Features.Templates.Services;

public interface IReportTemplateService
{
    Task<List<ReportTemplateDto>> GetAllTemplatesAsync();
    Task<ReportTemplateDto?> GetTemplateByIdAsync(Guid id);
    Task<ReportTemplateDto?> GetTemplateByNameAsync(string name);
    Task<List<ReportTemplateDto>> GetTemplatesByTypeAsync(string templateType);
    Task<ReportTemplateDto> CreateTemplateAsync(CreateReportTemplateDto templateDto);
    Task<ReportTemplateDto?> UpdateTemplateAsync(Guid id, UpdateReportTemplateDto templateDto);
    Task<bool> DeleteTemplateAsync(Guid id);
}