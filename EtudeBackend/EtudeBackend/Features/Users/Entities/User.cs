using System.ComponentModel.DataAnnotations.Schema;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.Users.Entities;

public class User
{
    public int Id { get; set; }
    
    public string Name { get; set; } = string.Empty;
    
    public string Surname { get; set; } = string.Empty;
    
    public string? Patronymic { get; set; }
    
    public string OrgEmail { get; set; } = string.Empty;
    
    public string Position { get; set; } = string.Empty;
    
    public int RoleId { get; set; }
    
    public int? SoloUserId { get; set; }
    
    public bool IsActive { get; set; } = true;
    
    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    
    // Навигационное свойство для роли
    public virtual Role Role { get; set; }
    
    // Навигационные свойства для других связанных сущностей
    public virtual ICollection<Token> Tokens { get; set; } = new List<Token>();
    public virtual ICollection<UserStatistics> Statistics { get; set; } = new List<UserStatistics>();
    public virtual ICollection<Application> Applications { get; set; } = new List<Application>();  // Добавлено навигационное свойство для заявок
}