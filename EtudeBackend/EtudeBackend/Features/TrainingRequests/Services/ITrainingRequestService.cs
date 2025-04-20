using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.Services;

public interface ITrainingRequestService
{
    Task<List<CourseDto>> GetAllRequestsAsync();
    Task<CourseDto?> GetRequestByIdAsync(Guid id);
    Task<CourseDto> CreateRequestAsync(CreateCourseDto requestDto);
    Task<CourseDto?> UpdateRequestAsync(Guid id, UpdateCourseDto requestDto);
    Task<bool> DeleteRequestAsync(Guid id);
    Task<List<CourseDto>> GetRequestsByCourseNameAsync(string courseName);
}