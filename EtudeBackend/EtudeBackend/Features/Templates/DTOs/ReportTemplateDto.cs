namespace EtudeBackend.Features.Templates.DTOs;

public class ReportTemplateDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Attributes { get; set; } = string.Empty;
    public string TemplateContent { get; set; } = string.Empty;
    public string TemplateType { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public DateTimeOffset? UpdatedAt { get; set; }
}

public class CreateReportTemplateDto
{
    public string Name { get; set; } = string.Empty;
    public string Attributes { get; set; } = string.Empty;
    public string TemplateContent { get; set; } = string.Empty;
    public string TemplateType { get; set; } = string.Empty;
}

public class UpdateReportTemplateDto
{
    public string? Name { get; set; }
    public string? Attributes { get; set; }
    public string? TemplateContent { get; set; }
    public string? TemplateType { get; set; }
}