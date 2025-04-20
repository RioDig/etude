using AutoMapper;
using EtudeBackend.Features.Templates.DTOs;
using EtudeBackend.Features.Templates.Entities;
using EtudeBackend.Features.Templates.Repositories;

namespace EtudeBackend.Features.Templates.Services;

public class ReportTemplateService : IReportTemplateService
{
    private readonly IReportTemplateRepository _repository;
    private readonly IMapper _mapper;

    public ReportTemplateService(IReportTemplateRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<ReportTemplateDto>> GetAllTemplatesAsync()
    {
        var templates = await _repository.GetAllAsync();
        return _mapper.Map<List<ReportTemplateDto>>(templates);
    }

    public async Task<ReportTemplateDto?> GetTemplateByIdAsync(Guid id)
    {
        var template = await _repository.GetByIdAsync(id);
        return template != null ? _mapper.Map<ReportTemplateDto>(template) : null;
    }

    public async Task<ReportTemplateDto?> GetTemplateByNameAsync(string name)
    {
        var template = await _repository.GetByNameAsync(name);
        return template != null ? _mapper.Map<ReportTemplateDto>(template) : null;
    }

    public async Task<List<ReportTemplateDto>> GetTemplatesByTypeAsync(string templateType)
    {
        var templates = await _repository.GetByTemplateTypeAsync(templateType);
        return _mapper.Map<List<ReportTemplateDto>>(templates);
    }

    public async Task<ReportTemplateDto> CreateTemplateAsync(CreateReportTemplateDto templateDto)
    {
        var template = _mapper.Map<ReportTemplate>(templateDto);
        template.Id = Guid.NewGuid();
        template.CreatedAt = DateTimeOffset.UtcNow;
        
        var createdTemplate = await _repository.AddAsync(template);
        return _mapper.Map<ReportTemplateDto>(createdTemplate);
    }

    public async Task<ReportTemplateDto?> UpdateTemplateAsync(Guid id, UpdateReportTemplateDto templateDto)
    {
        var template = await _repository.GetByIdAsync(id);
        if (template == null)
            return null;
            
        // Обновляем только те поля, которые предоставлены в DTO
        if (templateDto.Name != null)
            template.Name = templateDto.Name;
            
        if (templateDto.Attributes != null)
            template.Attributes = templateDto.Attributes;
            
        if (templateDto.TemplateContent != null)
            template.TemplateContent = templateDto.TemplateContent;
            
        if (templateDto.TemplateType != null)
            template.TemplateType = templateDto.TemplateType;
            
        template.UpdatedAt = DateTimeOffset.UtcNow;
        
        await _repository.UpdateAsync(template);
        return _mapper.Map<ReportTemplateDto>(template);
    }

    public async Task<bool> DeleteTemplateAsync(Guid id)
    {
        var template = await _repository.GetByIdAsync(id);
        if (template == null)
            return false;
            
        await _repository.RemoveAsync(template);
        return true;
    }
}