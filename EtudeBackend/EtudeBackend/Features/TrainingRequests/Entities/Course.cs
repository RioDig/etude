using System.ComponentModel.DataAnnotations.Schema;
using System.Runtime.Serialization;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Shared.Data;

namespace EtudeBackend.Features.TrainingRequests.Entities;

public class Course
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string Description { get; set; } = string.Empty;

    public CourseType Type { get; set; } = CourseType.NotImplemented;

    public CourseTrack Track { get; set; } = CourseTrack.NotImplemented;

    public CourseFormat Format { get; set; } = CourseFormat.NotImplemented;

    public string TrainingCenter { get; set; } = string.Empty;

    public string Link { get; set; } = string.Empty;

    public Guid EmployeeId { get; set; }

    public DateOnly StartDate { get; set; }

    public DateOnly EndDate { get; set; }

    public string Price { get; set; }

    [Column(TypeName = "text")]
    public string EducationGoal { get; set; } = string.Empty;

    public bool IsActive { get; set; } = false;

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset? UpdatedAt { get; set; }

    public ApplicationUser Learner { get; set; }

    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    public virtual ICollection<UserStatistics> Statistics { get; set; } = new List<UserStatistics>();
}

public enum CourseType
{
    [EnumMember(Value = "Course")]
    Course, // Курс

    [EnumMember(Value = "Conference")]
    Conference, // Конференция

    [EnumMember(Value = "Certification")]
    Certification, // Сертификация

    [EnumMember(Value = "Workshop")]
    Workshop, // Мастер-класс

    NotImplemented
}

public enum CourseTrack
{
    [EnumMember(Value = "Soft Skills")]
    SoftSkills,

    [EnumMember(Value = "Hard Skills")]
    HardSkills,

    [EnumMember(Value = "Management Skills")]
    ManagementSkills,

    NotImplemented
}

public enum CourseFormat
{
    [EnumMember(Value = "Online")]
    Online,

    [EnumMember(Value = "Offline")]
    Offline,
    NotImplemented
}