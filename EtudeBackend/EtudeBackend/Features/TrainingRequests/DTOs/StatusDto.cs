namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class StatusDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = "Processed";
    public string Description { get; set; } = string.Empty;
    
    public bool IsProtected { get; set; }
    public bool IsTerminal { get; set; }
    public int ApplicationCount { get; set; }
}

public class CreateStatusDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
}

public class UpdateStatusDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
}