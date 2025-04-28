using System.Net;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Extensions;
using EtudeBackend.Shared.Middleware;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Identity;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();

// Configure Infrastructure
builder.Services.AddInfrastructure(builder.Configuration);

// Add features
builder.Services.AddFeatures();

// Add AutoMapper
builder.Services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());

builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromSeconds(10);
    options.Cookie.HttpOnly = true;
    options.Cookie.IsEssential = true;
});

builder.Services.AddAuthentication().AddCookie(options =>
{
    options.LoginPath = "/api/Auth/login";
    
});

builder.Services.ConfigureApplicationCookie(options =>
{
    options.LoginPath = "/api/Auth/login";
});

builder.Services.AddIdentity<ApplicationUser, IdentityRole>(options =>
    {
        // Отключаем требование не буквенно-цифровых символов
        options.Password.RequireNonAlphanumeric = false;

        // Также можно смягчить другие требования
        options.Password.RequireDigit = false; // Не требовать цифр
        options.Password.RequireLowercase = false; // Не требовать строчных букв
        options.Password.RequireUppercase = false; // Не требовать заглавных букв
        options.Password.RequiredLength = 4; // Минимальная длина 6 символов

        // Уникальность email
        options.User.RequireUniqueEmail = false;
    })
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.PostConfigure<CookieAuthenticationOptions>(IdentityConstants.ApplicationScheme,
    options =>
    {
        options.LoginPath = new PathString("/api/Auth/login");
        //options.LogoutPath = "/Account/Logout";
        //options.AccessDeniedPath = "/Account/AccessDenied"; 
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromDays(30);

    });

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "https://localhost:5173", "*")
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});

var app = builder.Build();

// Глобальная обработка исключений
app.UseApiExceptionHandler();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
    
    // Apply migrations in development
    app.ApplyMigrations();
}

// Use CORS
app.UseCors("AllowAll");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();