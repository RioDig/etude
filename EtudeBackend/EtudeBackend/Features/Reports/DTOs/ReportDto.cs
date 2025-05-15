namespace EtudeBackend.Features.Reports.DTOs;

public class ReportFilterDto
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

public class ReportInfoDto
{
    public Guid Id { get; set; }
    public string ReportType { get; set; } = string.Empty;
    public DateTimeOffset ReportCreateDate { get; set; }
}

public class Report
{
    public Guid Id { get; set; }
    public string ReportType { get; set; } = string.Empty;
    public DateTimeOffset CreatedAt { get; set; }
    public string FilePath { get; set; } = string.Empty;
}