using AutoMapper;
using EtudeBackend.Features.Templates.DTOs;
using EtudeBackend.Features.Templates.Entities;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.Templates.Mappings;

public class CourseTemplateMappingProfile : Profile
{
    public CourseTemplateMappingProfile()
    {
        // Entity -> DTO
        CreateMap<CourseTemplate, CourseTemplateDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Track, opt => opt.MapFrom(src => src.Track.ToString()))
            .ForMember(dest => dest.Format, opt => opt.MapFrom(src => src.Format.ToString()));
        
        // CreateDTO -> Entity
        CreateMap<CreateCourseTemplateDto, CourseTemplate>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => ParseEnum<CourseType>(src.Type)))
            .ForMember(dest => dest.Track, opt => opt.MapFrom(src => ParseEnum<CourseTrack>(src.Track)))
            .ForMember(dest => dest.Format, opt => opt.MapFrom(src => ParseEnum<CourseFormat>(src.Format)));
        
        // UpdateDTO -> Entity преобразуется селективно в сервисе
    }

    private static T ParseEnum<T>(string value) where T : struct, Enum
    {
        if (Enum.TryParse<T>(value, true, out var result))
            return result;
            
        return default;
    }
}