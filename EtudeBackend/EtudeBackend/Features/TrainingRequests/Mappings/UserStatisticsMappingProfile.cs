using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data;

namespace EtudeBackend.Features.TrainingRequests.Mappings;

public class UserStatisticsMappingProfile : Profile
{
    public UserStatisticsMappingProfile()
    {
        // Маппинг из Course в PastEventDto
        CreateMap<Course, PastEventDto>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.Course, opt => opt.Ignore());
        
        // Маппинг из Course в CourseDetailDto
        CreateMap<Course, CourseDetailDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Track, opt => opt.MapFrom(src => src.Track.ToString()))
            .ForMember(dest => dest.Format, opt => opt.MapFrom(src => src.Format.ToString()))
            .ForMember(dest => dest.Link, opt => opt.MapFrom(src => src.Link))
            .ForMember(dest => dest.Learner, opt => opt.Ignore());
        
        // Маппинг из Status в StatusDto
        CreateMap<Status, StatusDto>()
            .ForMember(dest => dest.Type, opt => opt.Ignore());
        
        // Маппинг из ApplicationUser в UserBasicDto
        CreateMap<ApplicationUser, UserBasicDto>()
            .ForMember(dest => dest.Department, opt => opt.Ignore())
            .ForMember(dest => dest.IsLeader, opt => opt.Ignore());
    }
}