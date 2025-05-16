using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.Templates.DTOs;

public class CourseTemplateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public string TrainingCenter { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Link { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class CreateCourseTemplateDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public string TrainingCenter { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Link { get; set; } = string.Empty;
}

public class UpdateCourseTemplateDto
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public string? Track { get; set; }
    public string? Format { get; set; }
    public string? TrainingCenter { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Link { get; set; }
}

public class CourseTemplateFilterDto
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}