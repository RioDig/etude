using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.Auth.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    /// <summary>
    /// Перенаправляет пользователя на страницу аутентификации
    /// </summary>
    [HttpGet("login")]
    [ProducesResponseType(StatusCodes.Status302Found)]
    public IActionResult Login([FromQuery] string? redirectAfterLogin)
    {
        // В реальном приложении здесь была бы логика перенаправления на внешний сервис аутентификации
        // Для демонстрации просто возвращаем заглушку
        
        // При успешной аутентификации перенаправить на указанный URL или на главную страницу
        var redirectUrl = !string.IsNullOrEmpty(redirectAfterLogin) 
            ? redirectAfterLogin 
            : "/";
            
        return Redirect(redirectUrl);
    }
}