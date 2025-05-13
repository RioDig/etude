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
        [FromQuery] string[]? idsToRemove)
    {
        try
        {
            // Получаем структуру организации из EtudeAuth
            var structure = await _etudeAuthApiService.GetOrganizationStructureAsync();

            // Создаем список всех сотрудников из всех департаментов
            var allEmployees = new List<EmployeeDto>();

            foreach (var department in structure.Company.Departments)
            {
                // Добавляем менеджера
                var manager = new EmployeeDto
                {
                    // Используем Email как Id, так как это уникальный идентификатор
                    Id = department.Manager.Email,
                    Name = ExtractFirstName(department.Manager.Name),
                    Surname = ExtractLastName(department.Manager.Name),
                    Patronymic = ExtractMiddleName(department.Manager.Name),
                    Position = department.Manager.Position,
                    Department = department.Name, // Добавляем название отдела
                    IsLeader = true // Устанавливаем флаг руководителя
                };
                allEmployees.Add(manager);

                // Добавляем обычных сотрудников
                foreach (var employee in department.Employees)
                {
                    allEmployees.Add(new EmployeeDto
                    {
                        Id = employee.Email,
                        Name = ExtractFirstName(employee.Name),
                        Surname = ExtractLastName(employee.Name),
                        Patronymic = ExtractMiddleName(employee.Name),
                        Position = employee.Position,
                        Department = department.Name, // Добавляем название отдела
                        IsLeader = false // Обычные сотрудники не являются руководителями
                    });
                }
            }

            // Фильтруем сотрудников
            var filteredEmployees = allEmployees;

            // Применяем поисковый запрос, если он указан
            if (!string.IsNullOrEmpty(term))
            {
                string searchTerm = term.Trim().ToLower();
                filteredEmployees = allEmployees.Where(e =>
                        e.Name.ToLower().Contains(searchTerm) ||
                        e.Surname.ToLower().Contains(searchTerm) ||
                        (e.Patronymic != null && e.Patronymic.ToLower().Contains(searchTerm)) ||
                        e.Position.ToLower().Contains(searchTerm) ||
                        e.Department.ToLower().Contains(searchTerm) // Добавляем поиск по отделу
                ).ToList();
            }

            // Исключаем сотрудников из списка idsToRemove
            if (idsToRemove != null && idsToRemove.Length > 0)
            {
                filteredEmployees = filteredEmployees.Where(e => !idsToRemove.Contains(e.Id)).ToList();
            }

            // Ограничиваем количество результатов
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

// Вспомогательные методы для разделения полного имени на части
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