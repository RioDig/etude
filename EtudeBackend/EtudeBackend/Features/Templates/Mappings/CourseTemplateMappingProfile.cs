using AutoMapper;
using EtudeBackend.Features.Templates.DTOs;
using EtudeBackend.Features.Templates.Entities;

namespace EtudeBackend.Features.Templates.Mappings;

public class CourseTemplateMappingProfile : Profile
{
    public CourseTemplateMappingProfile()
    {
        // Entity -> DTO
        CreateMap<CourseTemplate, CourseTemplateDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateCourseTemplateDto, CourseTemplate>();
        
        // UpdateDTO -> Entity селективно реализуется в сервисе
    }
}