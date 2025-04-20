namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class StatusDto
{
    public Guid Id { get; set; } // Изменено с int на Guid
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsProtected { get; set; }
    public bool IsTerminal { get; set; }
    
    // Количество заявок с этим статусом
    public int ApplicationCount { get; set; }
}

public class CreateStatusDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public bool IsProtected { get; set; } = false;
    public bool IsTerminal { get; set; } = false;
}

public class UpdateStatusDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public bool? IsProtected { get; set; }
    public bool? IsTerminal { get; set; }
}