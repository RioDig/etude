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
    
    public string Employees { get; set; } = string.Empty;

    public Guid EmployeeId { get; set; }  // Изменено с int на Guid
    
    public DateOnly StartDate { get; set; }
    
    public DateOnly EndDate { get; set; }

    [Column(TypeName = "decimal(10,2)")]
    public decimal Price { get; set; } = 0; 
    
    [Column(TypeName = "text")]
    public string EducationGoal { get; set; } = string.Empty;
    
    public bool IsActive { get; set; } = false;
    
    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset? UpdatedAt { get; set; }
    
    // Навигационные свойства
    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();
    public virtual ICollection<UserStatistics> Statistics { get; set; } = new List<UserStatistics>();
}

public enum CourseType
{
    Training,
    Conference,
    Certification,
    NotImplemented
}

public enum CourseTrack
{
    Soft,
    Hard,
    Management,
    NotImplemented
}

public enum CourseFormat
{
    Online,
    Offline,
    NotImplemented
}
