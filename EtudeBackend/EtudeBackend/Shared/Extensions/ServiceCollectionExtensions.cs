using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.Reports.Services;
using EtudeBackend.Features.Templates.Repositories;
using EtudeBackend.Features.Templates.Services;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Features.TrainingRequests.Services;
using EtudeBackend.Features.Users.Repositories;
using EtudeBackend.Features.Users.Services;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Shared.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Добавление DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Регистрация общих репозиториев
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        
        // Кэширование
        services.AddStackExchangeRedisCache(opts =>
        {
            opts.Configuration = configuration.GetConnectionString("Redis");
            opts.InstanceName = "etude";
        });

        // Добавление HttpClient для OAuth сервиса
        services.AddHttpClient<IOAuthService, OAuthService>();
        
        services.AddScoped<IEmailService, EmailService>();

        return services;
    }

    public static IServiceCollection AddFeatures(this IServiceCollection services)
    {
        // Регистрация репозиториев
        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<IApplicationRepository, ApplicationRepository>();
        services.AddScoped<IUserStatisticsRepository, UserStatisticsRepository>();
        services.AddScoped<IStatusRepository, StatusRepository>();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddScoped<ICourseTemplateRepository, CourseTemplateRepository>();
        services.AddScoped<IReportTemplateRepository, ReportTemplateRepository>();
        
        // Регистрация сервисов
        services.AddScoped<IApplicationService, ApplicationService>();
        services.AddScoped<IUserStatisticsService, UserStatisticsService>();
        services.AddScoped<ICustomStatusService, CustomStatusService>();
        services.AddScoped<IUserService, UserService>();
        services.AddScoped<ICourseTemplateService, CourseTemplateService>();
        services.AddScoped<IReportTemplateService, ReportTemplateService>();
        services.AddScoped<IReportService, ReportService>();
        services.AddScoped<IOAuthService, OAuthService>();

        return services;
    }
}