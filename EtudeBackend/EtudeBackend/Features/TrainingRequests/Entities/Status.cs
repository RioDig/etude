﻿namespace EtudeBackend.Features.TrainingRequests.Entities;

public class Status
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public string Type { get; set; } = string.Empty;

    public bool IsProtected { get; set; } = false;

    public bool IsTerminal { get; set; } = false;

}