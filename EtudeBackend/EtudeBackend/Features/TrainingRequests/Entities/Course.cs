using System.ComponentModel.DataAnnotations.Schema;

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

    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    public virtual ICollection<UserStatistics> Statistics { get; set; } = new List<UserStatistics>();
}

public enum CourseType
{
    Course, // Курс
    Conference, // Конференция
    Certification, // Сертификация
    Workshop, // Мастер-класс
    NotImplemented
}

public enum CourseTrack
{
    SoftSkills,
    HardSkills,
    ManagementSkills,
    NotImplemented
}

public enum CourseFormat
{
    Online,
    Offline,
    NotImplemented
}