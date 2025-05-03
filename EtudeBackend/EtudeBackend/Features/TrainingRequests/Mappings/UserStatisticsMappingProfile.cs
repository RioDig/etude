using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.Mappings;

public class UserStatisticsMappingProfile : Profile
{
    public UserStatisticsMappingProfile()
    {
        // Course -> PastEventDto
        CreateMap<Course, PastEventDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Format, opt => opt.MapFrom(src => src.Format.ToString()))
            .ForMember(dest => dest.Track, opt => opt.MapFrom(src => src.Track.ToString()));
    }
}