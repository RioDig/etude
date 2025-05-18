using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.Mappings;

public class StatusMappingProfile : Profile
{
    public StatusMappingProfile()
    {
        // Status -> StatusDto
        CreateMap<Status, StatusDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type)) // Явный маппинг для поля Type
            .ForMember(dest => dest.IsProtected, opt => opt.MapFrom(src => src.IsProtected))
            .ForMember(dest => dest.IsTerminal, opt => opt.MapFrom(src => src.IsTerminal))
            .ForMember(dest => dest.ApplicationCount, opt => opt.Ignore());

        // CreateStatusDto -> Status
        CreateMap<CreateStatusDto, Status>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Type, opt => opt.Ignore()) // Игнорируем тип при мапинге из CreateStatusDto
            .ForMember(dest => dest.IsProtected, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.IsTerminal, opt => opt.MapFrom(src => false));

        // UpdateStatusDto -> Status
    }
}