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
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using StackExchange.Redis;

namespace EtudeBackend.Shared.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddInfrastructure(this IServiceCollection services, IConfiguration configuration)
    {
        // Добавление DbContext
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        // Добавление Identity
        services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        // Настройка параметров Identity
        services.Configure<IdentityOptions>(options =>
        {
            // Настройки пароля
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredLength = 6;
            options.Password.RequiredUniqueChars = 1;

            // Настройки блокировки
            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;

            // Настройки пользователя
            options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
            options.User.RequireUniqueEmail = true;
        });

        // Регистрация общих репозиториев
        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));
        
        // Настройка Redis
        services.AddStackExchangeRedisCache(opts =>
        {
            opts.Configuration = configuration.GetConnectionString("Redis");
            opts.InstanceName = "etude";
        });

        // Добавление HttpClient для OAuth сервиса
        services.AddHttpClient<IOAuthService, OAuthService>();
        
        // Регистрация сервисов для работы с токенами
        services.AddSingleton<ITokenStorageService, TokenStorageService>();
        
        // Email сервис
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
        services.AddScoped<ITokenRepository, TokenRepository>();
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
        services.AddScoped<IAuthService, AuthService>();
        services.AddHttpContextAccessor();

        return services;
    }
}