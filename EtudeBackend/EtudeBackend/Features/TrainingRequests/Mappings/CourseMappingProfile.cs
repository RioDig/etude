using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.Mappings;

public class CourseMappingProfile : Profile
{
    public CourseMappingProfile()
    {
        // Маппинг из Entity в DTO
        CreateMap<Course, CourseDto>();

        // Маппинг из CreateDTO в Entity
        CreateMap<CreateCourseDto, Course>();

        // Маппинг из UpdateDTO в Entity - делаем селективно в сервисе
    }
}