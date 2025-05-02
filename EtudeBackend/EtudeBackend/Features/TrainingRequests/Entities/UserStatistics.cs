using System.ComponentModel.DataAnnotations.Schema;
using EtudeBackend.Shared.Data;

namespace EtudeBackend.Features.TrainingRequests.Entities;

public class UserStatistics
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid CourseId { get; set; }
    
    public string UserId { get; set; } = string.Empty;
    
    public DateOnly? EnrollmentDate { get; set; }
    
    public DateOnly? CompletionDate { get; set; }
    
    [Column(TypeName = "decimal(5,2)")]
    public decimal? AttendanceRate { get; set; }
    
    public bool CertificateIssued { get; set; } = false;
    
    // Навигационные свойства
    public virtual Course Course { get; set; } = null!;
    public virtual ApplicationUser User { get; set; } = null!;
}