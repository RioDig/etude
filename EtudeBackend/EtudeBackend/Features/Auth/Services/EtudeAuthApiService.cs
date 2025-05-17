using System.Net.Http.Json;
using EtudeBackend.Features.Users.DTOs;
using Microsoft.Extensions.Configuration;

namespace EtudeBackend.Features.Auth.Services;

public class EtudeAuthApiService
{
    private readonly HttpClient _httpClient;
    private readonly ILogger<EtudeAuthApiService> _logger;
    private readonly string _baseUrl;

    public EtudeAuthApiService(
        HttpClient httpClient,
        IConfiguration configuration,
        ILogger<EtudeAuthApiService> logger)
    {
        _httpClient = httpClient;
        _logger = logger;
        _baseUrl = configuration["EtudeAuth:BaseUrl"] ?? "http://etudeauth:8000";
    }

    public async Task<OrganizationStructureDto> GetOrganizationStructureAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/api/organization/structure");
            response.EnsureSuccessStatusCode();
            
            var structure = await response.Content.ReadFromJsonAsync<OrganizationStructureDto>();
            return structure ?? new OrganizationStructureDto();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении структуры организации из EtudeAuth");
            return new OrganizationStructureDto();
        }
    }
    
    public async Task<EmployeeDto?> GetEmployeeByIdAsync(int id)
    {
        try
        {
            var response = await _httpClient.GetAsync($"{_baseUrl}/api/employees/{id}");
            if (!response.IsSuccessStatusCode)
            {
                _logger.LogWarning("Сотрудник с ID {EmployeeId} не найден в EtudeAuth. Код ответа: {StatusCode}", 
                    id, response.StatusCode);
                return null;
}
            
            return await response.Content.ReadFromJsonAsync<EmployeeDto>();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении сотрудника с ID {EmployeeId} из EtudeAuth", id);
            return null;
        }
    }
    
    
    public async Task<List<EmployeeDto>> ValidateEmployeesAsync(List<string> employeeIds)
    {
        try
        {
            var validEmployees = new List<EmployeeDto>();
        
            foreach (var employeeId in employeeIds)
            {
                var employee = await GetEmployeeByIdAsync(employeeId);
                if (employee != null)
                {
                    validEmployees.Add(employee);
                }
            }
        
            return validEmployees;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при валидации сотрудников в EtudeAuth");
            throw;
        }
    }

    public async Task<EmployeeDto> GetEmployeeByIdAsync(string employeeId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/employees/{employeeId}");
            if (response.IsSuccessStatusCode)
            {
                return await response.Content.ReadFromJsonAsync<EmployeeDto>();
            }
        
            return null;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении сотрудника из EtudeAuth по ID: {Id}", employeeId);
            return null;
        }
    }
}
