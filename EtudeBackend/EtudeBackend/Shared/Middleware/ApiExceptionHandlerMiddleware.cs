using System.Text.Json;
using EtudeBackend.Shared.Exceptions;

namespace EtudeBackend.Shared.Middleware;

public class ApiExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ApiExceptionHandlerMiddleware> _logger;
    private readonly IWebHostEnvironment _env;

    public ApiExceptionHandlerMiddleware(
        RequestDelegate next, 
        ILogger<ApiExceptionHandlerMiddleware> logger,
        IWebHostEnvironment env)
    {
        _next = next;
        _logger = logger;
        _env = env;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        _logger.LogError(exception, "Произошла ошибка: {Message}", exception.Message);
        
        context.Response.ContentType = "application/json";
        
        var statusCode = StatusCodes.Status500InternalServerError;
        var errors = new Dictionary<string, string[]>();
        
        switch (exception)
        {
            case ApiException apiException:
                statusCode = apiException.StatusCode;
                errors = apiException.Errors ?? new Dictionary<string, string[]>();
                break;
                
            default:
                if (_env.IsDevelopment())
                {
                    errors.Add("exception", new[] { exception.Message });
                    errors.Add("stackTrace", new[] { exception.StackTrace ?? "" });
                }
                else
                {
                    errors.Add("error", new[] { "Произошла внутренняя ошибка сервера." });
                }
                break;
        }
        
        context.Response.StatusCode = statusCode;
        
        var response = new
        {
            Status = statusCode,
            Title = GetDefaultMessageForStatusCode(statusCode),
            Errors = errors
        };
        
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    }
    
    private static string GetDefaultMessageForStatusCode(int statusCode)
    {
        return statusCode switch
        {
            400 => "Bad Request",
            401 => "Unauthorized",
            403 => "Forbidden",
            404 => "Resource Not Found",
            405 => "Method Not Allowed",
            500 => "Internal Server Error",
            _ => "An error has occurred"
        };
    }
}

// Extension method для добавления middleware
public static class ApiExceptionHandlerMiddlewareExtensions
{
    public static IApplicationBuilder UseApiExceptionHandler(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<ApiExceptionHandlerMiddleware>();
    }
}