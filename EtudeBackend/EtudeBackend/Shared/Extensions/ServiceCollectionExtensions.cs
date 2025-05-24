using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.Reports.Service;
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
        services.AddDbContext<ApplicationDbContext>(options =>
            options.UseNpgsql(configuration.GetConnectionString("DefaultConnection")));

        services.AddIdentity<ApplicationUser, IdentityRole>()
            .AddEntityFrameworkStores<ApplicationDbContext>()
            .AddDefaultTokenProviders();

        services.Configure<IdentityOptions>(options =>
        {
            options.Password.RequireDigit = false;
            options.Password.RequireLowercase = false;
            options.Password.RequireNonAlphanumeric = false;
            options.Password.RequireUppercase = false;
            options.Password.RequiredLength = 1;
            options.Password.RequiredUniqueChars = 0;

            options.Lockout.DefaultLockoutTimeSpan = TimeSpan.FromMinutes(5);
            options.Lockout.MaxFailedAccessAttempts = 5;
            options.Lockout.AllowedForNewUsers = true;

            options.User.AllowedUserNameCharacters = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789-._@+";
            options.User.RequireUniqueEmail = true;
        });

        services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

        services.AddStackExchangeRedisCache(opts =>
        {
            opts.Configuration = configuration.GetConnectionString("Redis");
            opts.InstanceName = "etude";
        });

        services.AddHttpClient<IOAuthService, OAuthService>();

        services.AddSingleton<ITokenStorageService, TokenStorageService>();

        services.AddScoped<IEmailService, EmailService>();

        return services;
    }

    public static IServiceCollection AddFeatures(this IServiceCollection services)
    {
        services.AddScoped<ICourseRepository, CourseRepository>();
        services.AddScoped<IApplicationRepository, ApplicationRepository>();
        services.AddScoped<IUserStatisticsRepository, UserStatisticsRepository>();
        services.AddScoped<IStatusRepository, StatusRepository>();
        services.AddScoped<ITokenRepository, TokenRepository>();
        services.AddScoped<ICourseTemplateRepository, CourseTemplateRepository>();
        services.AddScoped<IReportTemplateRepository, ReportTemplateRepository>();

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
        services.AddScoped<EtudeAuthApiService>();
        services.AddScoped<IOrganizationService, OrganizationService>();
        services.AddScoped<ICalendarService, CalendarService>();

        return services;
    }
}