using Microsoft.AspNetCore.Identity;

namespace EtudeBackend.Shared.Data;

public class ApplicationUser : IdentityUser
{
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string? Patronymic { get; set; }
    public string OrgEmail { get; set; } = string.Empty;
    public string Position { get; set; } = string.Empty;
    public int RoleId { get; set; }
    public string? SoloUserId { get; set; }
    public bool IsActive { get; set; } = true;
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public virtual ICollection<Features.TrainingRequests.Entities.Application> Applications { get; set; } = new List<Features.TrainingRequests.Entities.Application>();
    public virtual ICollection<Features.TrainingRequests.Entities.UserStatistics> Statistics { get; set; } = new List<Features.TrainingRequests.Entities.UserStatistics>();
    public virtual ICollection<Features.Users.Entities.Token> Tokens { get; set; } = new List<Features.Users.Entities.Token>();
}