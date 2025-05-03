using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Features.Users.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Shared.Extensions;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AutocompleteController : ControllerBase
{
    private readonly IUserService _userService;

    public AutocompleteController(IUserService userService)
    {
        _userService = userService;
    }
    
    /// <summary>
    /// Получает список сотрудников для автокомплита
    /// </summary>
    /// <param name="term">Поисковый запрос для фильтрации сотрудников</param>
    /// <param name="idsToRemove">Массив идентификаторов сотрудников, которых нужно исключить из результатов</param>
    /// <returns>Список сотрудников и флаг наличия дополнительных элементов</returns>
    [HttpGet("employee")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    public async Task<IActionResult> GetEmployeeAutocomplete(
        [FromQuery] string? term, 
        [FromQuery] string[]? idsToRemove)
    {
        var (employees, hasMoreItems) = await _userService.GetAutocompleteEmployeesAsync(term, idsToRemove);
        
        return Ok(new EmployeeAutocompleteResponse
        {
            Employees = employees,
            HasMoreItems = hasMoreItems
        });
    }
}