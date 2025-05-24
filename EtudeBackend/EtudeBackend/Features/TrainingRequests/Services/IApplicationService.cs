using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Shared.Models;

namespace EtudeBackend.Features.TrainingRequests.Services;

public interface IApplicationService
{
    Task<PagedResult<ApplicationDto>> GetApplicationsAsync(
        int page = 1,
        int perPage = 10,
        string? sortBy = null,
        string? orderBy = null,
        Dictionary<string, string>? filters = null);

    Task<ApplicationDetailDto?> GetApplicationByIdAsync(Guid id);

    Task<ApplicationDetailDto> CreateApplicationAsync(CreateApplicationDto applicationDto, string authorId);

    Task<ApplicationDetailDto?> UpdateApplicationAsync(Guid id, UpdateApplicationDto applicationDto);

    Task<ApplicationDetailDto?> ChangeApplicationStatusAsync(Guid id, ChangeStatusDto statusDto);

    Task<bool> DeleteApplicationAsync(Guid id);

    Task<string> GetLatestCommentAsync(Guid applicationId);
    
    
    Task<bool> AddAttachmentAsync(Guid applicationId, string attachmentLink);

}