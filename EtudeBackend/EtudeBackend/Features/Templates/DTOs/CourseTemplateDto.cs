using System.Text.Json.Serialization;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.Templates.DTOs;

public class CourseTemplateDto
{
    [JsonPropertyName("course_template_id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("course_template_name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_description")]
    public string Description { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_type")]
    public string Type { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_track")]
    public string Track { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_format")]
    public string Format { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_trainingCenter")]
    public string TrainingCenter { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_startDate")]
    public DateOnly? StartDate { get; set; }
    
    [JsonPropertyName("course_template_endDate")]
    public DateOnly? EndDate { get; set; }
    
    [JsonPropertyName("course_template_link")]
    public string Link { get; set; } = string.Empty;
    
    [JsonPropertyName("course_created_at")]
    public DateTimeOffset CreatedAt { get; set; }
    
    [JsonPropertyName("course_updated_at")]
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class CreateCourseTemplateDto
{
    [JsonPropertyName("course_template_name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_description")]
    public string Description { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_type")]
    public string Type { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_track")]
    public string Track { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_format")]
    public string Format { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_trainingCenter")]
    public string TrainingCenter { get; set; } = string.Empty;
    
    [JsonPropertyName("course_template_startDate")]
    public DateOnly? StartDate { get; set; }
    
    [JsonPropertyName("course_template_endDate")]
    public DateOnly? EndDate { get; set; }
    
    [JsonPropertyName("course_template_link")]
    public string Link { get; set; } = string.Empty;
}

public class UpdateCourseTemplateDto
{
    [JsonPropertyName("course_template_id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("course_template_name")]
    public string? Name { get; set; }
    
    [JsonPropertyName("course_template_description")]
    public string? Description { get; set; }
    
    [JsonPropertyName("course_template_type")]
    public string? Type { get; set; }
    
    [JsonPropertyName("course_template_track")]
    public string? Track { get; set; }
    
    [JsonPropertyName("course_template_format")]
    public string? Format { get; set; }
    
    [JsonPropertyName("course_template_trainingCenter")]
    public string? TrainingCenter { get; set; }
    
    [JsonPropertyName("course_template_startDate")]
    public DateOnly? StartDate { get; set; }
    
    [JsonPropertyName("course_template_endDate")]
    public DateOnly? EndDate { get; set; }
    
    [JsonPropertyName("course_template_link")]
    public string? Link { get; set; }
}

public class CourseTemplateFilterDto
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}