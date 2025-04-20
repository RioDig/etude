using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.Templates.DTOs;

public class CourseTemplateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public CourseType Type { get; set; }
    public CourseTrack Track { get; set; }
    public CourseFormat Format { get; set; }
    public string TrainingCenter { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class CreateCourseTemplateDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public CourseType Type { get; set; } = CourseType.NotImplemented;
    public CourseTrack Track { get; set; } = CourseTrack.NotImplemented;
    public CourseFormat Format { get; set; } = CourseFormat.NotImplemented;
    public string TrainingCenter { get; set; } = string.Empty;
}

public class UpdateCourseTemplateDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public CourseType? Type { get; set; }
    public CourseTrack? Track { get; set; }
    public CourseFormat? Format { get; set; }
    public string? TrainingCenter { get; set; }
}