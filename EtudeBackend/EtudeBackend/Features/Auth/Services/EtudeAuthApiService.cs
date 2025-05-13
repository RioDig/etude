using System.Net.Http.Json;
using EtudeBackend.Features.Users.DTOs;

namespace EtudeBackend.Features.Auth.Services;

public class EtudeAuthApiService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;
    private readonly ILogger<EtudeAuthApiService> _logger;

    public EtudeAuthApiService(HttpClient httpClient, IConfiguration configuration, ILogger<EtudeAuthApiService> logger)
    {
        _httpClient = httpClient;
        _configuration = configuration;
        _logger = logger;
        
        // Настраиваем базовый URL для EtudeAuth API
        _httpClient.BaseAddress = new Uri(_configuration["OAuth:AuthServerUrl"]);
    }

    public async Task<OrganizationStructureDto> GetOrganizationStructureAsync()
    {
        try
        {
            var response = await _httpClient.GetAsync("/api/organization/structure");
            response.EnsureSuccessStatusCode();
            
            var structure = await response.Content.ReadFromJsonAsync<OrganizationStructureDto>();
            return structure;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении структуры организации из EtudeAuth");
            throw;
        }
    }
}