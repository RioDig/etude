using System.ComponentModel.DataAnnotations.Schema;
using EtudeBackend.Features.Users.Entities;

namespace EtudeBackend.Features.TrainingRequests.Entities;

public class Application
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public Guid SoloDocId { get; set; }
    
    public Guid CourseId { get; set; }
    
    public int AuthorId { get; set; }  // Изменено на int для соответствия типу в User
    
    public Guid StatusId { get; set; }
    
    // Изменено имя поля для соответствия схеме
    [Column(TypeName = "text")]
    public string ApprovalHistory { get; set; } = string.Empty;
    
    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    
    // Добавлено поле согласно схеме
    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset? UpdatedAt { get; set; }
    
    // Навигационные свойства для связей
    public virtual Course Course { get; set; }
    public virtual Status Status { get; set; }
    public virtual User Author { get; set; }  // Добавлено навигационное свойство для автора
}