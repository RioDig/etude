using EtudeBackend.Features.Auth.Services;
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
    private readonly EtudeAuthApiService _etudeAuthApiService;
    private readonly ILogger<AutocompleteController> _logger;

    public AutocompleteController(EtudeAuthApiService etudeAuthApiService, ILogger<AutocompleteController> logger)
    {
        _etudeAuthApiService = etudeAuthApiService;
        _logger = logger;
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
        [FromQuery] string? idsToRemove)
    {
        try
        {
            var structure = await _etudeAuthApiService.GetOrganizationStructureAsync();

            var allEmployees = new List<EmployeeDto>();

            foreach (var department in structure.Company.Departments)
            {
                var manager = new EmployeeDto
                {
                    Id = department.Manager.Id,
                    Name = ExtractFirstName(department.Manager.Name),
                    Surname = ExtractLastName(department.Manager.Name),
                    Patronymic = ExtractMiddleName(department.Manager.Name),
                    Position = department.Manager.Position,
                    Department = department.Name,
                    IsLeader = true
                };
                allEmployees.Add(manager);

                foreach (var employee in department.Employees)
                {
                    allEmployees.Add(new EmployeeDto
                    {
                        Id = employee.Id,
                        Name = ExtractFirstName(employee.Name),
                        Surname = ExtractLastName(employee.Name),
                        Patronymic = ExtractMiddleName(employee.Name),
                        Position = employee.Position,
                        Department = department.Name,
                        IsLeader = false
                    });
                }
            }

            var filteredEmployees = allEmployees;

            if (!string.IsNullOrEmpty(term))
            {
                string searchTerm = term.Trim().ToLower();
                filteredEmployees = allEmployees.Where(e =>
                        e.Name.ToLower().Contains(searchTerm) ||
                        e.Surname.ToLower().Contains(searchTerm) ||
                        (e.Patronymic != null && e.Patronymic.ToLower().Contains(searchTerm)) ||
                        e.Position.ToLower().Contains(searchTerm) ||
                        e.Department.ToLower().Contains(searchTerm)
                ).ToList();
            }

            if (idsToRemove != null && idsToRemove.Length > 0)
            {
                var ids = idsToRemove.Split(',');
                filteredEmployees = filteredEmployees.Where(e => !ids.Contains(e.Id)).ToList();
            }

            const int maxResults = 8;
            bool hasMoreItems = filteredEmployees.Count > maxResults;
            var result = filteredEmployees
                .OrderBy(e => e.Surname)
                .ThenBy(e => e.Name)
                .Take(maxResults)
                .ToList();

            return Ok(new EmployeeAutocompleteResponse
            {
                Employees = result,
                HasMoreItems = hasMoreItems
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка сотрудников для автокомплита");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Ошибка при получении списка сотрудников" });
        }
    }

    private string ExtractLastName(string fullName)
    {
        var parts = fullName.Split(' ');
        return parts.Length > 0 ? parts[0] : string.Empty;
    }

    private string ExtractFirstName(string fullName)
    {
        var parts = fullName.Split(' ');
        return parts.Length > 1 ? parts[1] : string.Empty;
    }

    private string? ExtractMiddleName(string fullName)
    {
        var parts = fullName.Split(' ');
        return parts.Length > 2 ? parts[2] : null;
    }
}