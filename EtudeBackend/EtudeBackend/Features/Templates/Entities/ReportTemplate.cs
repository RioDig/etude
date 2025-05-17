using System.ComponentModel.DataAnnotations.Schema;

namespace EtudeBackend.Features.Templates.Entities;

public class ReportTemplate
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string Attributes { get; set; } = string.Empty;

    [Column(TypeName = "text")]
    public string TemplateContent { get; set; } = string.Empty;

    public string TemplateType { get; set; } = string.Empty;

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset? UpdatedAt { get; set; }
}