using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.Mappings;

public class StatusMappingProfile : Profile
{
    public StatusMappingProfile()
    {
        // Status -> StatusDto
        CreateMap<Status, StatusDto>();
        
        // CreateStatusDto -> Status маппинг производится вручную в сервисе
    }
}