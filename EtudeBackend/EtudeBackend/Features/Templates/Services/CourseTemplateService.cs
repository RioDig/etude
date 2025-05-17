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
    private readonly ILogger<CourseTemplateService> _logger;

    public CourseTemplateService(
        ICourseTemplateRepository repository,
        IMapper mapper,
        ILogger<CourseTemplateService> logger)
    {
        _repository = repository;
        _mapper = mapper;
        _logger = logger;
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

    public async Task<List<CourseTemplateDto>> GetTemplatesByTypeAsync(string type)
    {
        var templates = await _repository.GetByTypeAsync(type);
        return _mapper.Map<List<CourseTemplateDto>>(templates);
    }

    public async Task<List<CourseTemplateDto>> GetTemplatesByTrackAsync(string track)
    {
        var templates = await _repository.GetByTrackAsync(track);
        return _mapper.Map<List<CourseTemplateDto>>(templates);
    }

    public async Task<List<CourseTemplateDto>> GetTemplatesByFormatAsync(string format)
    {
        var templates = await _repository.GetByFormatAsync(format);
        return _mapper.Map<List<CourseTemplateDto>>(templates);
    }

    public async Task<List<CourseTemplateDto>> GetTemplatesByFiltersAsync(List<CourseTemplateFilterDto> filters)
    {
        try
        {
            var filterDictionary = filters.ToDictionary(
                f => f.Name.ToLower(),
                f => f.Value
            );

            var templates = await _repository.FilterByAsync(filterDictionary);
            return _mapper.Map<List<CourseTemplateDto>>(templates);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при применении фильтров к шаблонам курсов");
            return new List<CourseTemplateDto>();
        }
    }

    public async Task<CourseTemplateDto> CreateTemplateAsync(CreateCourseTemplateDto templateDto)
    {
        var template = _mapper.Map<CourseTemplate>(templateDto);
        template.Id = Guid.NewGuid();
        template.CreatedAt = DateTimeOffset.UtcNow;

        var createdTemplate = await _repository.AddAsync(template);
        return _mapper.Map<CourseTemplateDto>(createdTemplate);
    }

    public async Task<CourseTemplateDto?> UpdateTemplateAsync(UpdateCourseTemplateDto templateDto)
    {
        var template = await _repository.GetByIdAsync(templateDto.Id);
        if (template == null)
            return null;

        if (templateDto.Name != null)
            template.Name = templateDto.Name;

        if (templateDto.Description != null)
            template.Description = templateDto.Description;

        if (templateDto.TrainingCenter != null)
            template.TrainingCenter = templateDto.TrainingCenter;

        if (templateDto.Type != null && Enum.TryParse<CourseType>(templateDto.Type, true, out var courseType))
            template.Type = courseType;

        if (templateDto.Track != null && Enum.TryParse<CourseTrack>(templateDto.Track, true, out var courseTrack))
            template.Track = courseTrack;

        if (templateDto.Format != null && Enum.TryParse<CourseFormat>(templateDto.Format, true, out var courseFormat))
            template.Format = courseFormat;

        if (templateDto.StartDate.HasValue)
            template.StartDate = templateDto.StartDate.Value;

        if (templateDto.EndDate.HasValue)
            template.EndDate = templateDto.EndDate.Value;

        if (templateDto.Link != null)
            template.Link = templateDto.Link;

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