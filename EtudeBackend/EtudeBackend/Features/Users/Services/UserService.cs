using AutoMapper;
using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.Users.Services;

public class UserService : IUserService
{
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly IOrganizationService _organizationService;
    private readonly ILogger<OrganizationService> _logger;
    private const int MaxAutocompleteResults = 8;

    public UserService(
        IMapper mapper,
        UserManager<ApplicationUser> userManager,
        IOrganizationService organizationService,
        ILogger<OrganizationService> logger)
    {
        _mapper = mapper;
        _userManager = userManager;
        _organizationService = organizationService;
        _logger = logger;
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        var userDtos = _mapper.Map<List<UserDto>>(users);

        // Обогащаем данные пользователей информацией из EtudeAuth
        foreach (var userDto in userDtos)
        {
            await EnrichUserDto(userDto);
        }

        return userDtos;
    }

    public async Task<UserDto?> GetUserByIdAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return null;

        var userDto = _mapper.Map<UserDto>(user);
        await EnrichUserDto(userDto);

        return userDto;
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return null;

        var userDto = _mapper.Map<UserDto>(user);
        await EnrichUserDto(userDto);

        return userDto;
    }

    private async Task EnrichUserDto(UserDto userDto)
    {
        try
        {
            var companyName = await GetCompanyNameAsync();

            var employee = await _organizationService.GetEmployeeByEmailAsync(userDto.OrgEmail);

            if (employee != null)
            {
                userDto.Department = $"{employee.Department}, {companyName}";
                userDto.IsLeader = employee.IsLeader;
                userDto.Position = employee.Position;
            }
            else
            {
                userDto.Department = companyName;
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обогащении данных пользователя {Email}", userDto.OrgEmail);
        }
    }

    private async Task<string> GetCompanyNameAsync()
    {
        try
        {
            var orgStructure = await _organizationService.GetOrganizationStructureAsync();
            return orgStructure.Company.Name;
        }
        catch (Exception)
        {
            return "Организация";
        }
    }

    public async Task<(List<EmployeeDto> employees, bool hasMoreItems)> GetAutocompleteEmployeesAsync(string? term, string[]? idsToRemove = null)
    {
        IQueryable<ApplicationUser> query = _userManager.Users.Where(u => u.IsActive);

        if (!string.IsNullOrEmpty(term))
        {
            string searchTerm = term.Trim().ToLower();
            query = query.Where(u =>
                u.Name.ToLower().Contains(searchTerm) ||
                u.Surname.ToLower().Contains(searchTerm) ||
                (u.Patronymic != null && u.Patronymic.ToLower().Contains(searchTerm))
            );
        }

        if (idsToRemove != null && idsToRemove.Length > 0)
        {
            query = query.Where(u => !idsToRemove.Contains(u.Id));
        }

        int totalCount = await query.CountAsync();

        bool hasMore = totalCount > MaxAutocompleteResults;

        var users = await query
            .OrderBy(u => u.Surname)
            .ThenBy(u => u.Name)
            .Take(MaxAutocompleteResults)
            .ToListAsync();

        var employees = users.Select(u => new EmployeeDto
        {
            Id = u.Id,
            Name = u.Name,
            Surname = u.Surname,
            Patronymic = u.Patronymic,
            Position = u.Position
        }).ToList();

        return (employees, hasMore);
    }
}