using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.TrainingRequests.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserStatisticsController : ControllerBase
{
    private readonly IUserStatisticsService _userStatisticsService;
    private readonly ILogger<UserStatisticsController> _logger;

    public UserStatisticsController(IUserStatisticsService userStatisticsService, ILogger<UserStatisticsController> logger)
    {
        _userStatisticsService = userStatisticsService;
        _logger = logger;
    }
        
    /// <summary>
    /// Получает список компетенций пользователя
    /// </summary>
    [HttpGet("competencies")]
    [ProducesResponseType(typeof(List<CompetencyDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetCompetencies()
    {
        try
        {
            var competencies = await _userStatisticsService.GetCompetenciesAsync();
            return Ok(competencies);
        }
        catch (UnauthorizedAccessException)
        {
            _logger.LogWarning("Неавторизованный доступ при получении компетенций");
            return Unauthorized(new { message = "Требуется авторизация" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка компетенций");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Внутренняя ошибка сервера при получении списка компетенций" });
        }
    }
        
    /// <summary>
    /// Получает список прошедших мероприятий пользователя
    /// </summary>
    [HttpGet("pastEvents")]
    [ProducesResponseType(typeof(List<PastEventDto>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetPastEvents()
    {
        try
        {
            var pastEvents = await _userStatisticsService.GetPastEventsAsync();
            return Ok(pastEvents);
        }
        catch (UnauthorizedAccessException)
        {
            _logger.LogWarning("Неавторизованный доступ при получении прошедших мероприятий");
            return Unauthorized(new { message = "Требуется авторизация" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка прошедших мероприятий");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Внутренняя ошибка сервера при получении списка прошедших мероприятий" });
        }
    }
}