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

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme).AddCookie(options =>
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

// Add Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

// Add CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll", policy =>
    {
        policy.AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader();
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