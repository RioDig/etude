using AutoMapper;
using EtudeBackend.Features.Templates.Mappings;
using EtudeBackend.Features.TrainingRequests.Mappings;
using EtudeBackend.Features.Users.Mappings;
using System;

namespace EtudeBackend.Tests.Helpers
{
    public static class AutoMapperHelper
    {
        public static IMapper CreateMapper()
        {
            var configuration = new MapperConfiguration(cfg =>
            {
                // Регистрируем все профили маппинга
                cfg.AddProfile<ApplicationMappingProfile>();
                cfg.AddProfile<CourseTemplateMappingProfile>();
                cfg.AddProfile<ReportTemplateMappingProfile>();
                cfg.AddProfile<UserMappingProfile>();
                cfg.AddProfile<UserStatisticsMappingProfile>();
                cfg.AddProfile<StatusMappingProfile>();
                cfg.AddProfile<CourseMappingProfile>();
            });

            // Проверяем конфигурацию на корректность
            configuration.AssertConfigurationIsValid();

            return configuration.CreateMapper();
        }
    }
}