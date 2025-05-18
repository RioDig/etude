using System.Text.Json.Serialization;

namespace EtudeBackend.Features.Reports.DTOs;

public class ReportFilterDto
{
    public string Name { get; set; } = string.Empty;
    public string Value { get; set; } = string.Empty;
}

public class ReportInfoDto
{
    [JsonPropertyName("report_id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("report_type")]
    public string ReportType { get; set; } = string.Empty;
    
    [JsonPropertyName("report_createDate")]
    public DateTimeOffset ReportCreateDate { get; set; }
}

public class Report
{
    [JsonPropertyName("report_id")]
    public Guid Id { get; set; }
    
    [JsonPropertyName("report_type")]
    public string ReportType { get; set; } = string.Empty;
    
    [JsonPropertyName("report_createDate")]
    public DateTimeOffset CreatedAt { get; set; }
    
    public string FilePath { get; set; } = string.Empty;
}