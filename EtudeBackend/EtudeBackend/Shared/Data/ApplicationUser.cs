using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace EtudeBackend.Shared.Data;

public class ApplicationUser:IdentityUser
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Name { get; set; }
    public string Surname { get; set; }
    public string Patronymic { get; set; }
    public string OrgEmail { get; set; }
    public string Position { get; set; }
    public int RoleId { get; set; }
    public int SoloUserId { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedOn { get; set; } = DateTime.UtcNow;
}