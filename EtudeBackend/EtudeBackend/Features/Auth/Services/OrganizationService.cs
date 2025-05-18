using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Shared.Extensions;
using Microsoft.Extensions.Caching.Distributed;

namespace EtudeBackend.Features.Auth.Services;

public class OrganizationService : IOrganizationService
{
    private readonly EtudeAuthApiService _etudeAuthApiService;
    private readonly IDistributedCache _cache;
    private readonly ILogger<OrganizationService> _logger;
    private const string OrganizationCacheKey = "OrganizationStructure";
    private const int CacheTimeMinutes = 60; // Кешируем на час

    public OrganizationService(
        EtudeAuthApiService etudeAuthApiService,
        IDistributedCache cache,
        ILogger<OrganizationService> logger)
    {
        _etudeAuthApiService = etudeAuthApiService;
        _cache = cache;
        _logger = logger;
    }

    public async Task<OrganizationStructureDto> GetOrganizationStructureAsync(bool forceRefresh = false)
    {
        if (!forceRefresh)
        {
            var cachedData = await _cache.GetValue<OrganizationStructureDto>(
                OrganizationCacheKey,
                CancellationToken.None,
                _logger);

            if (cachedData != null)
            {
                _logger.LogDebug("Структура организации получена из кеша");
                return cachedData;
            }
        }

        var structure = await _etudeAuthApiService.GetOrganizationStructureAsync();

        await _cache.SetValue(
            OrganizationCacheKey,
            structure,
            (uint)CacheTimeMinutes,
            CancellationToken.None,
            _logger);

        _logger.LogInformation("Структура организации обновлена в кеше");
        return structure;
    }

    public async Task<EmployeeDto?> GetEmployeeByEmailAsync(string email)
    {
        var structure = await GetOrganizationStructureAsync();

        foreach (var department in structure.Company.Departments)
        {
            if (department.Manager.Email.Equals(email, StringComparison.OrdinalIgnoreCase))
            {
                return MapToEmployeeDto(department.Manager.Name, department.Manager.Email,
                    department.Manager.Position, department.Name, true);
            }

            var employee = department.Employees.FirstOrDefault(e =>
                e.Email.Equals(email, StringComparison.OrdinalIgnoreCase));

            if (employee != null)
            {
                return MapToEmployeeDto(employee.Name, employee.Email,
                    employee.Position, department.Name, false);
            }
        }

        return null;
    }

    public async Task<List<EmployeeDto>> SearchEmployeesAsync(string? searchTerm = null, int limit = 10)
    {
        var structure = await GetOrganizationStructureAsync();
        var allEmployees = new List<EmployeeDto>();

        foreach (var department in structure.Company.Departments)
        {
            // Добавляем руководителя
            allEmployees.Add(MapToEmployeeDto(
                department.Manager.Name,
                department.Manager.Email,
                department.Manager.Position,
                department.Name,
                true));

            // Добавляем сотрудников
            foreach (var employee in department.Employees)
            {
                allEmployees.Add(MapToEmployeeDto(
                    employee.Name,
                    employee.Email,
                    employee.Position,
                    department.Name,
                    false));
            }
        }

        if (string.IsNullOrWhiteSpace(searchTerm))
        {
            return allEmployees.Take(limit).ToList();
        }

        // Фильтруем сотрудников по поисковому запросу
        searchTerm = searchTerm.Trim().ToLower();
        var filteredEmployees = allEmployees.Where(e =>
            e.Name.ToLower().Contains(searchTerm) ||
            e.Surname.ToLower().Contains(searchTerm) ||
            (e.Patronymic != null && e.Patronymic.ToLower().Contains(searchTerm)) ||
            e.Position.ToLower().Contains(searchTerm) ||
            e.Department.ToLower().Contains(searchTerm) ||
            e.Id.ToLower().Contains(searchTerm)
        ).Take(limit).ToList();

        return filteredEmployees;
    }

    public async Task<List<EmployeeDto>> GetDepartmentEmployeesAsync(string departmentName)
    {
        var structure = await GetOrganizationStructureAsync();
        var employees = new List<EmployeeDto>();

        // Ищем отдел по имени
        var department = structure.Company.Departments.FirstOrDefault(d =>
            d.Name.Equals(departmentName, StringComparison.OrdinalIgnoreCase));

        if (department == null)
        {
            _logger.LogWarning("Отдел {DepartmentName} не найден", departmentName);
            return employees;
        }

        // Добавляем руководителя
        employees.Add(MapToEmployeeDto(
            department.Manager.Name,
            department.Manager.Email,
            department.Manager.Position,
            department.Name,
            true));

        // Добавляем сотрудников
        foreach (var employee in department.Employees)
        {
            employees.Add(MapToEmployeeDto(
                employee.Name,
                employee.Email,
                employee.Position,
                department.Name,
                false));
        }

        return employees;
    }

    public async Task<EmployeeDto?> GetEmployeeByUserIdAsync(string userId)
    {
        try
        {
            // Обращаемся напрямую к API EtudeAuth для получения информации о пользователе по ID
            var user = await _etudeAuthApiService.GetUserInfoByIdAsync(userId);
            if (user == null)
            {
                _logger.LogWarning("Пользователь с ID {UserId} не найден в EtudeAuth", userId);
                return null;
            }

            // Формируем объект EmployeeDto на основе полученной информации
            var employee = new EmployeeDto
            {
                Id = userId, // Используем переданный ID как идентификатор
                Name = user.Name,
                Surname = user.Surname,
                Patronymic = user.Patronymic,
                Position = user.Position,
                Department = user.Department ?? "Не указано",
                IsLeader = user.IsLeader ?? false
            };

            return employee;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении информации о пользователе с ID {UserId} из EtudeAuth", userId);
            return null;
        }
    }

    private EmployeeDto MapToEmployeeDto(string fullName, string email, string position, string departmentName, bool isLeader)
    {
        return new EmployeeDto
        {
            Id = email,
            Name = ExtractFirstName(fullName),
            Surname = ExtractLastName(fullName),
            Patronymic = ExtractMiddleName(fullName),
            Position = position,
            Department = departmentName,
            IsLeader = isLeader
        };
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

    public async Task<string> GetCompanyNameAsync()
    {
        var structure = await GetOrganizationStructureAsync();
        return structure.Company.Name;
    }

    private bool IsEmployeeMatch(EmployeeInfoDto employee, string employeeId)
    {
        // Проверяем, совпадает ли email с идентификатором
        if (employee.Email.Equals(employeeId, StringComparison.OrdinalIgnoreCase))
            return true;

        // Проверяем, совпадает ли имя с идентификатором (менее надежно)
        if (employee.Name.Equals(employeeId, StringComparison.OrdinalIgnoreCase))
            return true;

        return false;
    }

    // Вспомогательный метод для проверки соответствия ID сотрудника
    private bool IsMatchingEmployeeId(EmployeeInfoDto employee, string employeeId)
    {
        // Если ID в EtudeAuth это email - наиболее вероятный сценарий
        if (employee.Email.Equals(employeeId, StringComparison.OrdinalIgnoreCase))
            return true;

        // Дополнительная проверка: возможно ID - это часть имени или email без домена
        string emailWithoutDomain = employee.Email.Split('@')[0];
        if (emailWithoutDomain.Equals(employeeId, StringComparison.OrdinalIgnoreCase))
            return true;

        return false;
    }
}