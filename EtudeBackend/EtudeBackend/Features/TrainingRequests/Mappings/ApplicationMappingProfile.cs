using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.Mappings;

public class ApplicationMappingProfile : Profile
{
    public ApplicationMappingProfile()
    {
        // Application -> ApplicationDto
        CreateMap<Application, ApplicationDto>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.Name))
            .ForMember(dest => dest.Course, opt => opt.MapFrom(src => src.Course));
            
        // Application -> ApplicationDetailDto
        CreateMap<Application, ApplicationDetailDto>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.Name))
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author))
            .ForMember(dest => dest.Course, opt => opt.MapFrom(src => src.Course))
            .ForMember(dest => dest.Approvers, opt => opt.Ignore()); // Approvers будут заполняться отдельно
            
        // Course -> CourseBasicDto
        CreateMap<Course, CourseBasicDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Track, opt => opt.MapFrom(src => src.Track.ToString()))
            .ForMember(dest => dest.Format, opt => opt.MapFrom(src => src.Format.ToString()));
            
        // Course -> CourseDetailDto
        CreateMap<Course, CourseDetailDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Track, opt => opt.MapFrom(src => src.Track.ToString()))
            .ForMember(dest => dest.Format, opt => opt.MapFrom(src => src.Format.ToString()))
            .ForMember(dest => dest.Learner, opt => opt.MapFrom(src => src.Employees));
            
        // User -> UserBasicDto
        CreateMap<Features.Users.Entities.User, UserBasicDto>();
        
        // CreateApplicationDto -> Application и Course маппинг будет происходить вручную в сервисе
    }
}