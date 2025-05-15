using AutoMapper;
using EtudeBackend.Features.Templates.DTOs;
using EtudeBackend.Features.Templates.Entities;
using EtudeBackend.Features.Templates.Repositories;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.Templates.Services;

public class CourseTemplateService : ICourseTemplateService
{
    private readonly ICourseTemplateRepository _repository;
    private readonly IMapper _mapper;

    public CourseTemplateService(ICourseTemplateRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<CourseTemplateDto>> GetAllTemplatesAsync()
    {
        var templates = await _repository.GetAllAsync();
        return _mapper.Map<List<CourseTemplateDto>>(templates);
    }

    public async Task<CourseTemplateDto?> GetTemplateByIdAsync(Guid id)
    {
        var template = await _repository.GetByIdAsync(id);
        return template != null ? _mapper.Map<CourseTemplateDto>(template) : null;
    }

    public async Task<CourseTemplateDto?> GetTemplateByNameAsync(string name)
    {
        var template = await _repository.GetByNameAsync(name);
        return template != null ? _mapper.Map<CourseTemplateDto>(template) : null;
    }

    public async Task<List<CourseTemplateDto>> GetTemplatesByTypeAsync(CourseType type)
    {
        var templates = await _repository.GetByTypeAsync(type);
        return _mapper.Map<List<CourseTemplateDto>>(templates);
    }

    public async Task<List<CourseTemplateDto>> GetTemplatesByTrackAsync(CourseTrack track)
    {
        var templates = await _repository.GetByTrackAsync(track);
        return _mapper.Map<List<CourseTemplateDto>>(templates);
    }

    public async Task<List<CourseTemplateDto>> GetTemplatesByFormatAsync(CourseFormat format)
    {
        var templates = await _repository.GetByFormatAsync(format);
        return _mapper.Map<List<CourseTemplateDto>>(templates);
    }

    public async Task<CourseTemplateDto> CreateTemplateAsync(CreateCourseTemplateDto templateDto)
    {
        var template = _mapper.Map<CourseTemplate>(templateDto);
        template.Id = Guid.NewGuid();
        template.CreatedAt = DateTimeOffset.UtcNow;
        
        var createdTemplate = await _repository.AddAsync(template);
        return _mapper.Map<CourseTemplateDto>(createdTemplate);
    }

    public async Task<CourseTemplateDto?> UpdateTemplateAsync(Guid id, UpdateCourseTemplateDto templateDto)
    {
        var template = await _repository.GetByIdAsync(id);
        if (template == null)
            return null;
        
        if (templateDto.Name != null)
            template.Name = templateDto.Name;
            
        if (templateDto.Description != null)
            template.Description = templateDto.Description;
            
        if (templateDto.TrainingCenter != null)
            template.TrainingCenter = templateDto.TrainingCenter;
            
        if (templateDto.Type.HasValue)
            template.Type = templateDto.Type.Value;
            
        if (templateDto.Track.HasValue)
            template.Track = templateDto.Track.Value;
            
        if (templateDto.Format.HasValue)
            template.Format = templateDto.Format.Value;
            
        template.UpdatedAt = DateTimeOffset.UtcNow;
        
        await _repository.UpdateAsync(template);
        return _mapper.Map<CourseTemplateDto>(template);
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