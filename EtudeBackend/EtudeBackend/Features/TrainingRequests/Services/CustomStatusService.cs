using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Shared.Exceptions;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.TrainingRequests.Services;

public class CustomStatusService : ICustomStatusService
{
    private readonly IStatusRepository _statusRepository;
    private readonly IApplicationRepository _applicationRepository;
    private readonly IMapper _mapper;
    private readonly ILogger<CustomStatusService> _logger;

    public CustomStatusService(
        IStatusRepository statusRepository,
        IApplicationRepository applicationRepository,
        IMapper mapper,
        ILogger<CustomStatusService> logger)
    {
        _statusRepository = statusRepository;
        _applicationRepository = applicationRepository;
        _mapper = mapper;
        _logger = logger;
    }

    public async Task<List<StatusDto>> GetAllStatusesAsync()
    {
        var statuses = await _statusRepository.GetAllAsync();

        var statusDtos = new List<StatusDto>();

        foreach (var status in statuses)
        {
            var statusDto = new StatusDto
            {
                Id = status.Id,
                Name = status.Name,
                Description = status.Description,
                Type = status.Type,
                IsProtected = status.IsProtected,
                IsTerminal = status.IsTerminal
            };

            var applicationCount = await _applicationRepository.GetAllQuery()
                .CountAsync(a => a.StatusId == status.Id);

            statusDto.ApplicationCount = applicationCount;
            statusDtos.Add(statusDto);
        }

        return statusDtos;
    }

    public async Task<StatusDto?> GetStatusByIdAsync(Guid id)
    {
        var status = await _statusRepository.GetByIdAsync(id);
        if (status == null)
            return null;

        // Создаем DTO вручную, чтобы гарантировать копирование всех свойств
        var statusDto = new StatusDto
        {
            Id = status.Id,
            Name = status.Name,
            Description = status.Description,
            Type = status.Type, // Явно копируем тип
            IsProtected = status.IsProtected,
            IsTerminal = status.IsTerminal
        };

        var applicationCount = await _applicationRepository.GetAllQuery()
            .CountAsync(a => a.StatusId == id);

        statusDto.ApplicationCount = applicationCount;

        return statusDto;
    }

    public async Task<StatusDto?> GetStatusByNameAsync(string name)
    {
        var status = await _statusRepository.GetByNameAsync(name);
        if (status == null)
            return null;

        // Логируем тип из БД
        _logger.LogInformation("Статус из БД: Id={Id}, Name={Name}, Type={Type}",
            status.Id, status.Name, status.Type);

        var statusDto = _mapper.Map<StatusDto>(status);

        // Проверяем, что тип корректно замаппился
        _logger.LogInformation("После маппинга: DTO Type={Type}", statusDto.Type);

        var applicationCount = await _applicationRepository.GetAllQuery()
            .CountAsync(a => a.StatusId == statusDto.Id);

        statusDto.ApplicationCount = applicationCount;

        // Выводим тип в консоль для проверки
        Console.WriteLine($"Статус {statusDto.Name}, Тип: {statusDto.Type}");

        return statusDto;
    }

    public async Task<StatusDto> CreateStatusAsync(CreateStatusDto statusDto)
    {
        var existingStatus = await _statusRepository.GetByNameAsync(statusDto.Name);
        if (existingStatus != null)
            throw new ApiException($"Статус с именем '{statusDto.Name}' уже существует", 400);

        var status = _mapper.Map<Status>(statusDto);
        status.Id = Guid.NewGuid();

        // Если тип не указан, используем "Processed" по умолчанию
        if (string.IsNullOrEmpty(status.Type))
            status.Type = "Processed";

        // Проверяем валидность типа
        if (!IsValidStatusType(status.Type))
        {
            _logger.LogWarning("Указан невалидный тип статуса: {Type}. Используется тип по умолчанию (Processed)", status.Type);
            status.Type = "Processed";
        }

        status.IsProtected = false;  // По умолчанию не защищенный
        status.IsTerminal = false;   // По умолчанию не терминальный

        var createdStatus = await _statusRepository.AddAsync(status);
        var resultDto = _mapper.Map<StatusDto>(createdStatus);

        resultDto.ApplicationCount = 0;

        return resultDto;
    }

    public async Task<StatusDto?> UpdateStatusAsync(Guid id, UpdateStatusDto statusDto)
    {
        var status = await _statusRepository.GetByIdAsync(id);
        if (status == null)
            return null;

        if (status.IsProtected)
            throw new ApiException("Защищенный статус нельзя изменить", 400);

        if (statusDto.Name != null && statusDto.Name != status.Name)
        {
            var existingStatus = await _statusRepository.GetByNameAsync(statusDto.Name);
            if (existingStatus != null)
                throw new ApiException($"Статус с именем '{statusDto.Name}' уже существует", 400);

            status.Name = statusDto.Name;
        }

        if (statusDto.Description != null)
            status.Description = statusDto.Description;

        // Не обновляем поле Type

        await _statusRepository.UpdateAsync(status);

        // Создаем DTO вручную
        var result = new StatusDto
        {
            Id = status.Id,
            Name = status.Name,
            Description = status.Description,
            Type = status.Type, // Явно копируем тип из БД
            IsProtected = status.IsProtected,
            IsTerminal = status.IsTerminal
        };

        result.ApplicationCount = await _applicationRepository.GetAllQuery()
            .CountAsync(a => a.StatusId == result.Id);

        return result;
    }

    public async Task<(bool success, string? errorMessage)> DeleteStatusAsync(Guid id)
    {
        var status = await _statusRepository.GetByIdAsync(id);
        if (status == null)
            return (false, null);

        if (status.IsProtected)
            return (false, "Защищенный статус нельзя удалить");

        var hasApplications = await _applicationRepository.GetAllQuery()
            .AnyAsync(a => a.StatusId == id);

        if (hasApplications)
            return (false, "Нельзя удалить статус, который используется в заявках");

        await _statusRepository.RemoveAsync(status);
        return (true, null);
    }

    // Метод для проверки валидности типа статуса
    private bool IsValidStatusType(string type)
    {
        var validTypes = new[] { "Confirmation", "Rejected", "Approvement", "Processed", "Registered" };
        return validTypes.Contains(type);
    }
}