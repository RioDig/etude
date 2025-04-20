using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.Mappings;

public class UserStatisticsMappingProfile : Profile
{
    public UserStatisticsMappingProfile()
    {
        // Entity -> DTO
        CreateMap<UserStatistics, UserStatisticsDto>()
            .ForMember(dest => dest.CourseName, opt => opt.MapFrom(src => src.Course.Name))
            .ForMember(dest => dest.UserFullName, opt => opt.MapFrom(src => $"{src.User.Surname} {src.User.Name} {src.User.Patronymic}".Trim()));
            
        // CreateDTO -> Entity
        CreateMap<CreateUserStatisticsDto, UserStatistics>();
            
        // Обновление Entity селективно реализуется в сервисе
    }
}