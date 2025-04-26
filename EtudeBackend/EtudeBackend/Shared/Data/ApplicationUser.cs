using Microsoft.AspNetCore.Identity;

namespace EtudeBackend.Shared.Data;

public class ApplicationUser : IdentityUser
{
    // Убираем Id, так как он уже определен в базовом классе IdentityUser
    // public Guid Id { get; set; } = Guid.NewGuid(); 
    
    public string Name { get; set; }
    public string Surname { get; set; }
    public string? Patronymic { get; set; } // Nullable для необязательного поля
    public string OrgEmail { get; set; }
    public string Position { get; set; }
    public int RoleId { get; set; }
    public int? SoloUserId { get; set; } // Nullable для возможного отсутствия значения
    public bool IsActive { get; set; } = true;
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}