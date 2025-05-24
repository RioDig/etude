using System.Text.Json.Serialization;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class ApplicationDto
{
    public Guid Id { get; set; }
    public Guid StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public CourseBasicDto Course { get; set; } = new CourseBasicDto();
    public DateTimeOffset CreatedAt { get; set; }
}

public class ApplicationDetailDto
{
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Status Status { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public UserBasicDto Author { get; set; } = new UserBasicDto();
    public List<UserBasicDto> Approvers { get; set; } = new List<UserBasicDto>();
    public CourseDetailDto Course { get; set; } = new CourseDetailDto();
}

public class UserBasicDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    [JsonPropertyName("surname")]
    public string Surname { get; set; } = string.Empty;
    [JsonPropertyName("patronymic")]
    public string? Patronymic { get; set; }
    [JsonPropertyName("position")]
    public string Position { get; set; } = string.Empty;
    [JsonPropertyName("department")]
    public string Department { get; set; } = string.Empty;
    [JsonPropertyName("isLeader")]
    public bool IsLeader { get; set; } = false;
}

public class CourseBasicDto
{
    [JsonPropertyName("course_id")]
    public Guid Id { get; set; }

    [JsonPropertyName("course_name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("course_type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("course_track")]
    public string Track { get; set; } = string.Empty;

    [JsonPropertyName("course_format")]
    public string Format { get; set; } = string.Empty;

    [JsonPropertyName("course_trainingCenter")]
    public string TrainingCenter { get; set; } = string.Empty;

    [JsonPropertyName("course_startDate")]
    public DateOnly StartDate { get; set; }

    [JsonPropertyName("course_endDate")]
    public DateOnly EndDate { get; set; }
    public UserBasicDto Learner { get; set; } = new UserBasicDto();
}

public class CourseDetailDto : CourseBasicDto
{
    [JsonPropertyName("course_description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("course_price")]
    public string Price { get; set; }

    [JsonPropertyName("course_educationGoal")]
    public string EducationGoal { get; set; } = string.Empty;

    [JsonPropertyName("course_link")]
    public string Link { get; set; } = string.Empty;

    [JsonPropertyName("course_learner")]
    public UserBasicDto Learner { get; set; } = new UserBasicDto();
}

public class CreateApplicationDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public string LearnerId { get; set; } = string.Empty; // ID обучающегося как строка
    public string TrainingCenter { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public string Link { get; set; } = string.Empty;
    public string Price { get; set; } = string.Empty;
    public string EducationGoal { get; set; } = string.Empty;
    public string AuthorId { get; set; } = string.Empty;

    // ID согласующих
    public List<string> ApproverIds { get; set; } = new List<string>();

    public Guid StatusId { get; set; }
}

public class UpdateApplicationDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public string? Track { get; set; }
    public string? Format { get; set; }
    public string? TrainingCenter { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public string? Price { get; set; }
    public string? Link { get; set; }
    public string? EducationGoal { get; set; } = string.Empty;
    public List<string>? Approvers { get; set; }
}

public class ChangeStatusDto
{
    public Guid Id { get; set; }

    [JsonPropertyName("status")]
    public Guid StatusId { get; set; }
    public string? Comment { get; set; }
}

public class ApplicationStatusDto
{
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty; // [Confirmation, Rejected, Approvement, Processed, Registered]
}

public class ApplicationCourseDto
{
    [JsonPropertyName("course_id")]
    public Guid Id { get; set; }

    [JsonPropertyName("course_name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("course_description")]
    public string Description { get; set; } = string.Empty;

    [JsonPropertyName("course_type")]
    public string Type { get; set; } = string.Empty;

    [JsonPropertyName("course_track")]
    public string Track { get; set; } = string.Empty;

    [JsonPropertyName("course_format")]
    public string Format { get; set; } = string.Empty;

    [JsonPropertyName("course_trainingCenter")]
    public string TrainingCenter { get; set; } = string.Empty;

    [JsonPropertyName("course_startDate")]
    public DateOnly StartDate { get; set; }

    [JsonPropertyName("course_endDate")]
    public DateOnly EndDate { get; set; }

    [JsonPropertyName("course_link")]
    public string Link { get; set; } = string.Empty;

    [JsonPropertyName("course_price")]
    public string Price { get; set; }

    [JsonPropertyName("course_educationGoal")]
    public string EducationGoal { get; set; } = string.Empty;

    [JsonPropertyName("course_learner")]
    public UserBasicDto? Learner { get; set; }
}

public class ApplicationResponseDto
{
    [JsonPropertyName("application_id")]
    public Guid ApplicationId { get; set; }

    [JsonPropertyName("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    public ApplicationStatusDto Status { get; set; } = new();
    public ApplicationCourseDto Course { get; set; } = new();
}

public class ApplicationFilterDto
{
    public string Name { get; set; } = string.Empty; // status, type, format, track, learner
    public string Value { get; set; } = string.Empty;
}

public class ApplicationDetailResponseDto
{
    [JsonPropertyName("application_id")]
    public Guid ApplicationId { get; set; }

    [JsonPropertyName("created_at")]
    public DateTimeOffset CreatedAt { get; set; }

    [JsonPropertyName("comment")]
    public string Comment { get; set; } = string.Empty;

    [JsonPropertyName("status")]
    public ApplicationStatusDto Status { get; set; } = new();

    [JsonPropertyName("author")]
    public UserBasicDto Author { get; set; } = new();

    [JsonPropertyName("approvers")]
    public List<UserBasicDto> Approvers { get; set; } = new List<UserBasicDto>();

    [JsonPropertyName("course")]
    public ApplicationCourseDto Course { get; set; } = new();
    
    [JsonPropertyName("attachmentLink")]
    public string AttachmentLink { get; set; } = string.Empty;
}

public class ApprovalHistoryEntry
{
    public DateTimeOffset Date { get; set; }
    public Guid StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public string Comment { get; set; } = string.Empty;
}

public class CreateApplicationRequestDto
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("description")]
    public string? Description { get; set; }

    [JsonPropertyName("type")]
    public string? Type { get; set; }

    [JsonPropertyName("track")]
    public string? Track { get; set; }

    [JsonPropertyName("format")]
    public string? Format { get; set; }

    [JsonPropertyName("trainingCenter")]
    public string? TrainingCenter { get; set; }

    [JsonPropertyName("startDate")]
    public DateOnly StartDate { get; set; }

    [JsonPropertyName("endDate")]
    public DateOnly EndDate { get; set; }

    [JsonPropertyName("link")]
    public string? Link { get; set; }

    [JsonPropertyName("price")]
    public string? Price { get; set; }

    [JsonPropertyName("educationGoal")]
    public string? EducationGoal { get; set; }

    [JsonPropertyName("learner_id")]
    public string LearnerId { get; set; } = string.Empty;

    [JsonPropertyName("approvers")]
    public List<string> Approvers { get; set; } = new List<string>();
}

public class AddAttachmentRequestDto
{
    public Guid Id { get; set; }
    public string Link { get; set; } = string.Empty;
}