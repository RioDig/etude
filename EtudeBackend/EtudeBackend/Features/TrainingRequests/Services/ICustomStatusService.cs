using EtudeBackend.Features.TrainingRequests.DTOs;

namespace EtudeBackend.Features.TrainingRequests.Services;

public interface ICustomStatusService
{
    Task<List<StatusDto>> GetAllStatusesAsync();
    Task<StatusDto?> GetStatusByIdAsync(Guid id);
    Task<StatusDto?> GetStatusByNameAsync(string name);
    Task<StatusDto> CreateStatusAsync(CreateStatusDto statusDto);
    Task<StatusDto?> UpdateStatusAsync(Guid id, UpdateStatusDto statusDto);
    Task<(bool success, string? errorMessage)> DeleteStatusAsync(Guid id);
}