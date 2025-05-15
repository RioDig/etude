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

    public CustomStatusService(
        IStatusRepository statusRepository,
        IApplicationRepository applicationRepository,
        IMapper mapper)
    {
        _statusRepository = statusRepository;
        _applicationRepository = applicationRepository;
        _mapper = mapper;
    }

    public async Task<List<StatusDto>> GetAllStatusesAsync()
    {
        var statuses = await _statusRepository.GetAllAsync();
        var statusDtos = _mapper.Map<List<StatusDto>>(statuses);
        
        foreach (var statusDto in statusDtos)
        {
            var statusGuid = new Guid(statusDto.Id.ToString());
            var applicationCount = await _applicationRepository.GetAllQuery()
                .CountAsync(a => a.StatusId == statusGuid);
                
            statusDto.ApplicationCount = applicationCount;
        }
        
        return statusDtos;
    }

    public async Task<StatusDto?> GetStatusByIdAsync(Guid id)
    {
        var status = await _statusRepository.GetByIdAsync(id);
        if (status == null)
            return null;
            
        var statusDto = _mapper.Map<StatusDto>(status);
        
        var statusGuid = new Guid(statusDto.Id.ToString());
        statusDto.ApplicationCount = await _applicationRepository.GetAllQuery()
            .CountAsync(a => a.StatusId == statusGuid);
            
        return statusDto;
    }

    public async Task<StatusDto?> GetStatusByNameAsync(string name)
    {
        var status = await _statusRepository.GetByNameAsync(name);
        if (status == null)
            return null;
            
        var statusDto = _mapper.Map<StatusDto>(status);
        
        var statusGuid = new Guid(statusDto.Id.ToString());
        statusDto.ApplicationCount = await _applicationRepository.GetAllQuery()
            .CountAsync(a => a.StatusId == statusGuid);
            
        return statusDto;
    }

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
            IsProtected = statusDto.IsProtected,
            IsTerminal = statusDto.IsTerminal
        };
        
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
            
        if (statusDto.IsProtected.HasValue)
            status.IsProtected = statusDto.IsProtected.Value;
            
        if (statusDto.IsTerminal.HasValue)
            status.IsTerminal = statusDto.IsTerminal.Value;
            
        await _statusRepository.UpdateAsync(status);
        
        var result = _mapper.Map<StatusDto>(status);
        
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
}