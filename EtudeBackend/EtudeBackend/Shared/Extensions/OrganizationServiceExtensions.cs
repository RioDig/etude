using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.Users.DTOs;

namespace EtudeBackend.Shared.Extensions;

public static class OrganizationServiceExtensions
{
    /// <summary>
    /// Расширение для IOrganizationService для получения сотрудника по ID
    /// </summary>
    public static async Task<EmployeeDto?> GetEmployeeByIdAsync(this IOrganizationService organizationService, string employeeId)
    {
        try
        {
            // Получаем структуру организации
            var structure = await organizationService.GetOrganizationStructureAsync();
            
            // Проверяем руководителей и сотрудников всех отделов
            foreach (var department in structure.Company.Departments)
            {
                // Проверяем руководителя отдела
                if (IsEmployeeMatch(department.Manager, employeeId))
                {
                    return MapToEmployeeDto(department.Manager.Name, department.Manager.Email, 
                        department.Manager.Position, department.Name, true);
                }
            
                // Проверяем сотрудников отдела
                foreach (var employee in department.Employees)
                {
                    if (IsEmployeeMatch(employee, employeeId))
                    {
                        return MapToEmployeeDto(employee.Name, employee.Email, 
                            employee.Position, department.Name, false);
                    }
                }
            }
        
            return null;
        }
        catch (Exception ex)
        {
            // Логирование исключения можно добавить при необходимости
            return null;
        }
    }
    
    private static bool IsEmployeeMatch(EmployeeInfoDto employee, string employeeId)
    {
        // Проверяем, совпадает ли email с идентификатором
        if (employee.Email.Equals(employeeId, StringComparison.OrdinalIgnoreCase))
            return true;
    
        // Проверяем, совпадает ли имя с идентификатором (менее надежно)
        if (employee.Name.Equals(employeeId, StringComparison.OrdinalIgnoreCase))
            return true;
        
        // Дополнительная проверка: возможно ID - это часть email без домена
        string emailWithoutDomain = employee.Email.Split('@')[0];
        if (emailWithoutDomain.Equals(employeeId, StringComparison.OrdinalIgnoreCase))
            return true;
            
        return false;
    }
    
    private static EmployeeDto MapToEmployeeDto(string fullName, string email, string position, string departmentName, bool isLeader)
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
    
    
    private static string ExtractLastName(string fullName)
    {
        var parts = fullName.Split(' ');
        return parts.Length > 0 ? parts[0] : string.Empty;
    }

    private static string ExtractFirstName(string fullName)
    {
        var parts = fullName.Split(' ');
        return parts.Length > 1 ? parts[1] : string.Empty;
    }

    private static string? ExtractMiddleName(string fullName)
    {
        var parts = fullName.Split(' ');
        return parts.Length > 2 ? parts[2] : null;
    }
}