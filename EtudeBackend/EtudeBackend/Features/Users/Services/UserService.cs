using AutoMapper;
using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.Users.Services;

public class UserService : IUserService
{
    private readonly IMapper _mapper;
    private readonly UserManager<ApplicationUser> _userManager;
    private const int MaxAutocompleteResults = 8;

    public UserService(IMapper mapper, UserManager<ApplicationUser> userManager) 
    {
        _mapper = mapper;
        _userManager = userManager;
    }

    public async Task<List<UserDto>> GetAllUsersAsync()
    {
        var users = await _userManager.Users.ToListAsync();
        return _mapper.Map<List<UserDto>>(users);
    }

    public async Task<UserDto?> GetUserByIdAsync(string id)
    {
        var user = await _userManager.FindByIdAsync(id);
        if (user == null)
            return null;
            
        return _mapper.Map<UserDto>(user);
    }

    public async Task<UserDto?> GetUserByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null)
            return null;
            
        return _mapper.Map<UserDto>(user);
    }
    
    public async Task<(List<EmployeeDto> employees, bool hasMoreItems)> GetAutocompleteEmployeesAsync(string? term, string[]? idsToRemove = null)
    {
        // Начинаем с запроса всех активных пользователей
        IQueryable<ApplicationUser> query = _userManager.Users.Where(u => u.IsActive);
        
        // Фильтруем по поисковому запросу, если он предоставлен
        if (!string.IsNullOrEmpty(term))
        {
            string searchTerm = term.Trim().ToLower();
            query = query.Where(u =>
                u.Name.ToLower().Contains(searchTerm) ||
                u.Surname.ToLower().Contains(searchTerm) ||
                (u.Patronymic != null && u.Patronymic.ToLower().Contains(searchTerm))
            );
        }
        
        // Исключаем пользователей из списка idsToRemove
        if (idsToRemove != null && idsToRemove.Length > 0)
        {
            query = query.Where(u => !idsToRemove.Contains(u.Id));
        }
        
        // Получаем общее количество результатов для определения hasMoreItems
        int totalCount = await query.CountAsync();
        
        // Проверяем, есть ли больше элементов, чем мы собираемся вернуть
        bool hasMore = totalCount > MaxAutocompleteResults;
        
        // Ограничиваем результаты до MaxAutocompleteResults
        var users = await query
            .OrderBy(u => u.Surname)
            .ThenBy(u => u.Name)
            .Take(MaxAutocompleteResults)
            .ToListAsync();
        
        // Преобразуем в DTO
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