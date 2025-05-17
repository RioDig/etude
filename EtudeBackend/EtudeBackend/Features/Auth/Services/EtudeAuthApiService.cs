using System.Net.Http.Json;
using EtudeBackend.Features.Auth.Models;
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
        _baseUrl = configuration["OAuth:AuthServerUrl"] ?? "http://etudeauth:8000";
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
            var response = await _httpClient.GetAsync($"{_baseUrl}/api/users/{id}");
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

    

    public async Task<EmployeeDto> GetEmployeeByIdAsync(string employeeId)
    {
        try
        {
            var response = await _httpClient.GetAsync($"/api/users/{employeeId}");
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
    
    public async Task<DocumentCreateResponse> CreateDocumentAsync(CreateDocumentModel model)
{
    try
    {
        var response = await _httpClient.PostAsJsonAsync($"{_baseUrl}/api/documents", model);
        
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Ошибка при создании документа. Код ответа: {StatusCode}", 
                response.StatusCode);
            return new DocumentCreateResponse 
            { 
                Success = false, 
                Message = $"Ошибка сервера: {response.StatusCode}" 
            };
        }
        
        var result = await response.Content.ReadFromJsonAsync<DocumentCreateResponse>();
        return result ?? new DocumentCreateResponse { Success = false, Message = "Ошибка десериализации ответа" };
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при создании документа в EtudeAuth");
        return new DocumentCreateResponse { Success = false, Message = $"Внутренняя ошибка: {ex.Message}" };
    }
}
    
public async Task<DocumentStatusResponse?> GetDocumentStatusAsync(string documentId)
{
    try
    {
        var response = await _httpClient.GetAsync($"{_baseUrl}/api/documents/{documentId}/status");
        
        if (!response.IsSuccessStatusCode)
        {
            _logger.LogWarning("Документ с ID {DocumentId} не найден в EtudeAuth. Код ответа: {StatusCode}", 
                documentId, response.StatusCode);
            return null;
        }
        
        return await response.Content.ReadFromJsonAsync<DocumentStatusResponse>();
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при получении статуса документа с ID {DocumentId} из EtudeAuth", documentId);
        return null;
    }
}

// Проверка наличия сотрудников в EtudeAuth
public async Task<List<EmployeeDto>> ValidateEmployeesAsync(List<string> employeeIds)
{
    try
    {
        var validEmployees = new List<EmployeeDto>();
        
        foreach (var employeeId in employeeIds)
        {
            // Для каждого ID пытаемся получить информацию о сотруднике
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

public async Task<bool> EmployeeExistsAsync(string employeeId)
{
    try
    {
        var response = await _httpClient.GetAsync($"{_baseUrl}/api/users/{employeeId}");
        
        // Если запрос успешный, сотрудник существует
        return response.IsSuccessStatusCode;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при проверке существования сотрудника с ID {EmployeeId} в EtudeAuth", employeeId);
        // В случае ошибки лучше считать, что сотрудник не существует
        return false;
    }
}

/// <summary>
/// Проверяет наличие сотрудников в системе EtudeAuth по их ID
/// </summary>
/// <param name="employeeIds">Список ID сотрудников для проверки</param>
/// <returns>Список ID сотрудников, которые не найдены в системе</returns>
public async Task<List<string>> ValidateEmployeeIdsAsync(List<string> employeeIds)
{
    try
    {
        var invalidEmployees = new List<string>();
        
        foreach (var employeeId in employeeIds)
        {
            try
            {
                // Пытаемся получить информацию о сотруднике по ID
                var response = await _httpClient.GetAsync($"{_baseUrl}/api/users/{employeeId}");
                
                // Если запрос неуспешный, значит сотрудник не существует
                if (!response.IsSuccessStatusCode)
                {
                    invalidEmployees.Add(employeeId);
                    _logger.LogWarning("Сотрудник с ID {EmployeeId} не найден в EtudeAuth", employeeId);
                }
            }
            catch (Exception ex)
            {
                // В случае ошибки считаем, что сотрудник не существует
                invalidEmployees.Add(employeeId);
                _logger.LogError(ex, "Ошибка при проверке сотрудника с ID {EmployeeId} в EtudeAuth", employeeId);
            }
        }
        
        return invalidEmployees;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Ошибка при валидации ID сотрудников в EtudeAuth");
        throw;
    }
}
}
