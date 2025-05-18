namespace EtudeBackend.Features.TrainingRequests.DTOs;

using EtudeBackend.Features.TrainingRequests.Entities;

public class CourseDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public CourseType Type { get; set; }
    public CourseTrack Track { get; set; }
    public CourseFormat Format { get; set; }
    public string TrainingCenter { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal Price { get; set; }
    public string EducationGoal { get; set; } = string.Empty;
    public bool IsActive { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
    public UserBasicDto Learner { get; set; } = new UserBasicDto();

    // Дополнительные поля для связей
    public int ApplicationCount { get; set; }
    public int EnrolledUsersCount { get; set; }
}