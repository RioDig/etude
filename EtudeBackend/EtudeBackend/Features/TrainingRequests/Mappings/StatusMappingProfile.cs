using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.Mappings;

public class StatusMappingProfile : Profile
{
    public StatusMappingProfile()
    {
        // Status -> StatusDto - явно указываем маппинг Type, чтобы гарантировать его копирование
        CreateMap<Status, StatusDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.IsProtected, opt => opt.MapFrom(src => src.IsProtected))
            .ForMember(dest => dest.IsTerminal, opt => opt.MapFrom(src => src.IsTerminal))
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.ApplicationCount, opt => opt.Ignore());
        
        // CreateStatusDto -> Status - явно указываем маппинг Type
        CreateMap<CreateStatusDto, Status>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description));
        
        // UpdateStatusDto -> Status - маппинг производится вручную в сервисе
    }
}