namespace EtudeBackend.Features.Reports.DTOs;

public class ReportInfoDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
}

public class ReportResultDto
{
    public string FileName { get; set; } = string.Empty;
    public byte[] FileContent { get; set; } = Array.Empty<byte>();
}