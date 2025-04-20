using AutoMapper;
using EtudeBackend.Features.Templates.DTOs;
using EtudeBackend.Features.Templates.Entities;

namespace EtudeBackend.Features.Templates.Mappings;

public class ReportTemplateMappingProfile : Profile
{
    public ReportTemplateMappingProfile()
    {
        // Entity -> DTO
        CreateMap<ReportTemplate, ReportTemplateDto>();
        
        // CreateDTO -> Entity
        CreateMap<CreateReportTemplateDto, ReportTemplate>();
        
        // UpdateDTO -> Entity селективно реализуется в сервисе
    }
}