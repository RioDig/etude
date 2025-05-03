using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.TrainingRequests.Controllers;

[ApiController]
[Route("api/user-statistics")]
[Authorize]
public class UserStatisticsController : ControllerBase
{
    private readonly IUserStatisticsService _userStatisticsService;

    public UserStatisticsController(IUserStatisticsService userStatisticsService)
    {
        _userStatisticsService = userStatisticsService;
    }
        
    /// <summary>
    /// Получает список компетенций пользователя
    /// </summary>
    [HttpGet("competencies")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetCompetencies()
    {
        try
        {
            var competencies = await _userStatisticsService.GetCompetenciesAsync();
            return Ok(competencies);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
        }
    }
        
    /// <summary>
    /// Получает список прошедших мероприятий пользователя
    /// </summary>
    [HttpGet("past-events")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetPastEvents()
    {
        try
        {
            var pastEvents = await _userStatisticsService.GetPastEventsAsync();
            return Ok(pastEvents);
        }
        catch (UnauthorizedAccessException)
        {
            return Unauthorized();
        }
        catch (Exception ex)
        {
            return StatusCode(StatusCodes.Status500InternalServerError, new { message = ex.Message });
        }
    }
}