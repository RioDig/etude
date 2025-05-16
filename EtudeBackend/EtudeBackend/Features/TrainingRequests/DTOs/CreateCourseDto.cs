using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class CreateCourseDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public CourseType Type { get; set; } = CourseType.NotImplemented;
    public CourseTrack Track { get; set; } = CourseTrack.NotImplemented;
    public CourseFormat Format { get; set; } = CourseFormat.NotImplemented;
    public string TrainingCenter { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public string Employees { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal Price { get; set; }
    public string EducationGoal { get; set; } = string.Empty;
    public bool IsActive { get; set; } = false;
}