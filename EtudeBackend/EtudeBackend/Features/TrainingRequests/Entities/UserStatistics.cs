using System.ComponentModel.DataAnnotations.Schema;
using EtudeBackend.Features.Users.Entities;

namespace EtudeBackend.Features.TrainingRequests.Entities;

public class UserStatistics
{
    public Guid Id { get; set; } = Guid.NewGuid();  // Изменено с int на Guid
    
    public Guid CourseId { get; set; }  // Изменено с int на Guid
    
    public int UserId { get; set; }  // Оставляем int, так как в User используется int
    
    public DateOnly? EnrollmentDate { get; set; }
    
    public DateOnly? CompletionDate { get; set; }
    
    [Column(TypeName = "decimal(5,2)")]
    public decimal? AttendanceRate { get; set; }
    
    public bool CertificateIssued { get; set; } = false;
    
    // Навигационные свойства
    public virtual Course Course { get; set; }
    public virtual User User { get; set; }
}