﻿using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Features.TrainingRequests.Services;
using EtudeBackend.Shared.Exceptions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.TrainingRequests.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CustomStatusController : ControllerBase
{
    private readonly ICustomStatusService _statusService;
    private readonly ILogger<CustomStatusController> _logger;
    private readonly IStatusRepository _statusRepository;

    public CustomStatusController(
        ICustomStatusService statusService,
        ILogger<CustomStatusController> logger, IStatusRepository statusRepository)
    {
        _statusService = statusService;
        _logger = logger;
        _statusRepository = statusRepository;
    }

    /// <summary>
    /// Получает список всех кастомных статусов
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllStatuses()
    {
        try
        {
            var statuses = await _statusService.GetAllStatusesAsync();
            return Ok(statuses);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка статусов");
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Внутренняя ошибка сервера при получении списка статусов" });
        }
    }

    /// <summary>
    /// Получает кастомный статус по идентификатору
    /// </summary>
    [HttpGet("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetStatusById(Guid id)
    {
        try
        {
            var status = await _statusService.GetStatusByIdAsync(id);

            if (status == null)
                return NotFound(new { message = "Статус не найден" });

            return Ok(status);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении статуса по ID: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Внутренняя ошибка сервера при получении статуса" });
        }
    }


    /// <summary>
    /// Создает новый кастомный статус
    /// </summary>
    [HttpPost]
    [ProducesResponseType(StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<StatusDto> CreateStatusAsync(CreateStatusDto statusDto)
    {
        var existingStatus = await _statusRepository.GetByNameAsync(statusDto.Name);
        if (existingStatus != null)
            throw new ApiException($"Статус с именем '{statusDto.Name}' уже существует", 400);

        var status = new Status
        {
            Id = Guid.NewGuid(),
            Name = statusDto.Name,
            Description = statusDto.Description,
            Type = "Processed", // Устанавливаем тип по умолчанию
            IsProtected = false,
            IsTerminal = false
        };

        var createdStatus = await _statusRepository.AddAsync(status);

        // Создаем DTO вручную
        var resultDto = new StatusDto
        {
            Id = createdStatus.Id,
            Name = createdStatus.Name,
            Description = createdStatus.Description,
            Type = createdStatus.Type, // Явно копируем тип
            IsProtected = createdStatus.IsProtected,
            IsTerminal = createdStatus.IsTerminal,
            ApplicationCount = 0
        };

        return resultDto;
    }

    /// <summary>
    /// Обновляет существующий кастомный статус
    /// </summary>
    [HttpPatch("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> UpdateStatus(Guid id, [FromBody] UpdateStatusDto statusDto)
    {
        try
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var updatedStatus = await _statusService.UpdateStatusAsync(id, statusDto);

            if (updatedStatus == null)
                return NotFound(new { message = "Статус не найден" });

            return Ok(updatedStatus);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обновлении статуса с ID: {Id}", id);

            if (ex.Message.Contains("защищенный") || ex.Message.Contains("уже существует"))
                return BadRequest(new { message = ex.Message });

            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Внутренняя ошибка сервера при обновлении статуса" });
        }
    }

    /// <summary>
    /// Удаляет кастомный статус
    /// </summary>
    [HttpDelete("{id:guid}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> DeleteStatus(Guid id)
    {
        try
        {
            var (success, errorMessage) = await _statusService.DeleteStatusAsync(id);

            if (!success)
            {
                if (errorMessage == null)
                    return NotFound(new { message = "Статус не найден" });

                return BadRequest(new { message = errorMessage });
            }

            return NoContent();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при удалении статуса с ID: {Id}", id);
            return StatusCode(StatusCodes.Status500InternalServerError,
                new { message = "Внутренняя ошибка сервера при удалении статуса" });
        }
    }
}