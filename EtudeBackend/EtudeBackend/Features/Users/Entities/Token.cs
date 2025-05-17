using System.ComponentModel.DataAnnotations.Schema;
using EtudeBackend.Shared.Data;

namespace EtudeBackend.Features.Users.Entities;

public class Token
{
    public int Id { get; set; }

    public string UserId { get; set; } = string.Empty;

    public string Etude_Token { get; set; } = string.Empty;

    public string Solo_Token { get; set; } = string.Empty;

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset ExpiresAt { get; set; }

    public bool IsActive { get; set; } = true;

    // Навигационное свойство
    public virtual ApplicationUser User { get; set; } = null!;
}