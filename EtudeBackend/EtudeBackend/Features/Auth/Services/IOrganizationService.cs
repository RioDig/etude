using EtudeBackend.Features.Users.DTOs;

namespace EtudeBackend.Features.Auth.Services;

public interface IOrganizationService
{
    Task<OrganizationStructureDto> GetOrganizationStructureAsync(bool forceRefresh = false);
    Task<EmployeeDto?> GetEmployeeByEmailAsync(string email);
    Task<List<EmployeeDto>> SearchEmployeesAsync(string? searchTerm = null, int limit = 10);
    Task<List<EmployeeDto>> GetDepartmentEmployeesAsync(string departmentName);
    Task<string> GetCompanyNameAsync();
    Task<EmployeeDto?> GetEmployeeByUserIdAsync(string userId);
}