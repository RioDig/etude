using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Shared.Models;

public class TrainingItem
{
    public DateTimeOffset CreatedAt { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public CourseType Type { get; set; }
    public CourseTrack Track { get; set; }
    public CourseFormat Format { get; set; }
    public string TrainingCenter { get; set; }
    public string Link { get; set; }
    public string Price { get; set; }
    public string EducationGoal { get; set; }
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public User[] Approvers { get; set; }
    public User Learner { get; set; }
}

public class User
{
    public string Name { get; set; }
    public string Surname { get; set; }
    public string? Patronymic { get; set; }
    public string Position { get; set; }
    public string Department { get; set; }
}

