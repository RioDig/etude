using System.Text.Json.Serialization;

namespace EtudeBackend.Features.Users.DTOs;

public class UserDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string? Patronymic { get; set; }
    public string OrgEmail { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string Role { get; set; } = "user"; // "user" | "admin"
    public string Position { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty; // Подразделение + организация
    public bool IsLeader { get; set; } = false;
}

public class EmployeeDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Surname { get; set; } = string.Empty;
    public string? Patronymic { get; set; }
    public string Position { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public bool IsLeader { get; set; }
}

public class EmployeeAutocompleteResponse
{
    public List<EmployeeDto> Employees { get; set; } = new List<EmployeeDto>();
    public bool HasMoreItems { get; set; } = false;
}

public class OrganizationStructureDto
{
    public CompanyStructureDto Company { get; set; }
}

public class CompanyStructureDto
{
    public string Name { get; set; }
    public List<DepartmentStructureDto> Departments { get; set; } = new List<DepartmentStructureDto>();
}

public class DepartmentStructureDto
{
    public string Name { get; set; }
    public EmployeeInfoDto Manager { get; set; }
    public List<EmployeeInfoDto> Employees { get; set; } = new List<EmployeeInfoDto>();
}

public class EmployeeInfoDto
{
    public string Id { get; set; }
    public string Name { get; set; }
    public string Position { get; set; }
    public string Email { get; set; }
}

public class UserDetailDto
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;
    
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("surname")]
    public string Surname { get; set; } = string.Empty;
    
    [JsonPropertyName("patronymic")]
    public string? Patronymic { get; set; }
    
    [JsonPropertyName("org_email")]
    public string OrgEmail { get; set; } = string.Empty;
    
    [JsonPropertyName("position")]
    public string Position { get; set; } = string.Empty;
    
    [JsonPropertyName("department")]
    public string? Department { get; set; }
    
    [JsonPropertyName("is_leader")]
    public bool? IsLeader { get; set; }
}