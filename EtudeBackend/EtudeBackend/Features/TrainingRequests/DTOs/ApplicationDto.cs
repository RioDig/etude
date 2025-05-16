namespace EtudeBackend.Features.TrainingRequests.DTOs;

public class ApplicationDto
{
    public Guid Id { get; set; }
    public Guid StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public CourseBasicDto Course { get; set; } = new CourseBasicDto();
    public DateTimeOffset CreatedAt { get; set; }
}

public class ApplicationDetailDto
{
    public Guid Id { get; set; }
    public DateTimeOffset CreatedAt { get; set; }
    public Guid StatusId { get; set; }
    public string StatusName { get; set; } = string.Empty;
    public UserBasicDto Author { get; set; } = new UserBasicDto();
    public List<UserBasicDto> Approvers { get; set; } = new List<UserBasicDto>();
    public CourseDetailDto Course { get; set; } = new CourseDetailDto();
}

public class UserBasicDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string? Patronymic { get; set; }
    public string Position { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public bool IsLeader { get; set; } = false;
}

public class CourseBasicDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public string TrainingCenter { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
}

public class CourseDetailDto : CourseBasicDto
{
    public string Description { get; set; } = string.Empty;
    public decimal Price { get; set; }
    public string EducationGoal { get; set; } = string.Empty;
    public string Link { get; set; } = string.Empty;
    public UserBasicDto Learner { get; set; } = new UserBasicDto();
}

public class CreateApplicationDto
{
    public string Name { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string Type { get; set; } = string.Empty;
    public string Track { get; set; } = string.Empty;
    public string Format { get; set; } = string.Empty;
    public Guid EmployeeId { get; set; }
    public string TrainingCenter { get; set; } = string.Empty;
    public DateOnly StartDate { get; set; }
    public DateOnly EndDate { get; set; }
    public decimal Price { get; set; }
    public string EducationGoal { get; set; } = string.Empty;
    public List<int> ApproverIds { get; set; } = new List<int>();
}

public class UpdateApplicationDto
{
    public string? Name { get; set; }
    public string? Description { get; set; }
    public string? Type { get; set; }
    public string? Track { get; set; }
    public string? Format { get; set; }
    public string? TrainingCenter { get; set; }
    public DateOnly? StartDate { get; set; }
    public DateOnly? EndDate { get; set; }
    public decimal? Price { get; set; }
    public List<int>? ApproverIds { get; set; }
}

public class ChangeStatusDto
{
    public Guid StatusId { get; set; }
    public string? Comment { get; set; }
}
