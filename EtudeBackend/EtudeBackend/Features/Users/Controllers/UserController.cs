using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Features.Users.Services;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.Users.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    
    /// <summary>
    /// Получает список всех пользователей
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllUsers()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }
    
    /// <summary>
    /// Получает информацию о пользователе по идентификатору
    /// </summary>
    [HttpGet("{id:int}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetUserById(int id)
    {
        var user = await _userService.GetUserByIdAsync(id);
            
        if (user == null)
            return NotFound();
            
        return Ok(user);
    }
    
    /// <summary>
    /// Получает информацию о текущем пользователе
    /// </summary>
    [HttpGet("me")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCurrentUser()
    {
        // Здесь должна быть логика получения текущего пользователя из токена
        // Но пока просто используем временную реализацию для демонстрации
        int currentUserId = 1; // Заглушка
        
        var user = await _userService.GetUserByIdAsync(currentUserId);
            
        if (user == null)
            return Unauthorized();
            
        return Ok(user);
    }
}