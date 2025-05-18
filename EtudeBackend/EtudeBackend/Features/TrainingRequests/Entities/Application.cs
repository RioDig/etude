using System.ComponentModel.DataAnnotations.Schema;
using EtudeBackend.Shared.Data;

namespace EtudeBackend.Features.TrainingRequests.Entities;

public class Application
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid SoloDocId { get; set; }

    public Guid CourseId { get; set; }

    public string AuthorId { get; set; } = string.Empty;

    public Guid StatusId { get; set; }

    [Column(TypeName = "text")]
    public string ApprovalHistory { get; set; } = string.Empty;

    public List<string> Approvers { get; set; }

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset? UpdatedAt { get; set; }

    public virtual Course Course { get; set; } = null!;
    public virtual Status Status { get; set; } = null!;
    public virtual ApplicationUser Author { get; set; } = null!;
}