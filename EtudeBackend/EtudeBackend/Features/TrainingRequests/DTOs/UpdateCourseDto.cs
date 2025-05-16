using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class UpdateCourseDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public CourseType? Type { get; set; }
    public CourseTrack? Track { get; set; }
    public CourseFormat? Format { get; set; }
    public string? TrainingCenter { get; set; }
    public string? Link { get; set; }
    public string? Employees { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? Price { get; set; }
    public string? EducationGoal { get; set; }
    public bool? IsActive { get; set; }
}