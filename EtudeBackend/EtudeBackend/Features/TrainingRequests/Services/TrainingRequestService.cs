﻿using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Services;

public class TrainingRequestService : ITrainingRequestService
{
    private readonly ICourseRepository _repository;
    private readonly IMapper _mapper;

    public TrainingRequestService(ICourseRepository repository, IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<List<CourseDto>> GetAllRequestsAsync()
    {
        var requests = await _repository.GetAllAsync();
        return _mapper.Map<List<CourseDto>>(requests);
    }

    public async Task<CourseDto?> GetRequestByIdAsync(Guid id)
    {
        var request = await _repository.GetByIdAsync(id);
        return request != null ? _mapper.Map<CourseDto>(request) : null;
    }

    public async Task<CourseDto> CreateRequestAsync(CreateCourseDto requestDto)
    {
        var request = _mapper.Map<Course>(requestDto);
        request.Id = Guid.NewGuid(); // Генерируем новый Id
        request.CreatedAt = DateTimeOffset.UtcNow;

        var createdRequest = await _repository.AddAsync(request);
        return _mapper.Map<CourseDto>(createdRequest);
    }

    public async Task<CourseDto?> UpdateRequestAsync(Guid id, UpdateCourseDto requestDto)
    {
        var request = await _repository.GetByIdAsync(id);
        if (request == null)
            return null;

        // Обновляем только заданные поля
        if (requestDto.Name != null)
            request.Name = requestDto.Name;
            
        if (requestDto.Description != null)
            request.Description = requestDto.Description;
            
        if (requestDto.TrainingCenter != null)
            request.TrainingCenter = requestDto.TrainingCenter;
            
        if (requestDto.EducationGoal != null)
            request.EducationGoal = requestDto.EducationGoal;
            
        if (requestDto.Type.HasValue)
            request.Type = requestDto.Type.Value;
            
        if (requestDto.Track.HasValue)
            request.Track = requestDto.Track.Value;
            
        if (requestDto.Format.HasValue)
            request.Format = requestDto.Format.Value;
            
        if (requestDto.StartDate.HasValue)
            request.StartDate = requestDto.StartDate.Value;
            
        if (requestDto.EndDate.HasValue)
            request.EndDate = requestDto.EndDate.Value;
            
        if (requestDto.Price.HasValue)
            request.Price = requestDto.Price.Value;
            
        if (requestDto.IsActive.HasValue)
            request.IsActive = requestDto.IsActive.Value;

        await _repository.UpdateAsync(request);
        return _mapper.Map<CourseDto>(request);
    }

    public async Task<bool> DeleteRequestAsync(Guid id)
    {
        var request = await _repository.GetByIdAsync(id);
        if (request == null)
            return false;

        await _repository.RemoveAsync(request);
        return true;
    }

    public async Task<List<CourseDto>> GetRequestsByCourseNameAsync(string courseName)
    {
        var requests = await _repository.GetByCourseNameAsync(courseName);
        return _mapper.Map<List<CourseDto>>(requests);
    }
}