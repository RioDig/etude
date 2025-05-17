using System.ComponentModel.DataAnnotations.Schema;

namespace EtudeBackend.Features.Reports.Entities;

public class Report
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string ReportType { get; set; } = string.Empty;

    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;

    public string FilePath { get; set; } = string.Empty;
}