using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Identity;
namespace EtudeBackend.Features.TrainingRequests.Mappings;

public class ApplicationMappingProfile : Profile
{
    public ApplicationMappingProfile()
    {
        // Application -> ApplicationDto
        CreateMap<Application, ApplicationDto>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.Name))
            .ForMember(dest => dest.Course, opt => opt.MapFrom(src => src.Course));

        // Application -> ApplicationDetailDto
        CreateMap<Application, ApplicationDetailDto>()
            .ForMember(dest => dest.StatusName, opt => opt.MapFrom(src => src.Status.Name))
            .ForMember(dest => dest.StatusId, opt => opt.MapFrom(src => src.StatusId))
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author))
            .ForMember(dest => dest.Course, opt => opt.MapFrom<CourseResolver>())
            .ForMember(dest => dest.Approvers, opt => opt.MapFrom<ApproversValueResolver>());

        // Course -> CourseBasicDto
        CreateMap<Course, CourseBasicDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Track, opt => opt.MapFrom(src => src.Track.ToString()))
            .ForMember(dest => dest.Format, opt => opt.MapFrom(src => src.Format.ToString()));

        // Course -> CourseDetailDto
        CreateMap<Course, CourseDetailDto>()
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()))
            .ForMember(dest => dest.Track, opt => opt.MapFrom(src => src.Track.ToString()))
            .ForMember(dest => dest.Format, opt => opt.MapFrom(src => src.Format.ToString()))
            .ForMember(dest => dest.Learner, opt => opt.Ignore()); // Будет заполнено отдельно

        // ApplicationUser -> UserBasicDto
        CreateMap<ApplicationUser, UserBasicDto>()
            .ForMember(dest => dest.Department, opt => opt.Ignore())
            .ForMember(dest => dest.IsLeader, opt => opt.Ignore());

        // Status -> ApplicationStatusDto
        CreateMap<Status, ApplicationStatusDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => DetermineStatusType(src.Name)));

        // Course -> ApplicationCourseDto
        CreateMap<Course, ApplicationCourseDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id))
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.Name))
            .ForMember(dest => dest.Description, opt => opt.MapFrom(src => src.Description))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => MapCourseType(src.Type)))
            .ForMember(dest => dest.Track, opt => opt.MapFrom(src => MapCourseTrack(src.Track)))
            .ForMember(dest => dest.Format, opt => opt.MapFrom(src => MapCourseFormat(src.Format)))
            .ForMember(dest => dest.TrainingCenter, opt => opt.MapFrom(src => src.TrainingCenter))
            .ForMember(dest => dest.StartDate, opt => opt.MapFrom(src => src.StartDate))
            .ForMember(dest => dest.EndDate, opt => opt.MapFrom(src => src.EndDate))
            .ForMember(dest => dest.Link, opt => opt.MapFrom(src => src.Link))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src => src.Price))
            .ForMember(dest => dest.EducationGoal, opt => opt.MapFrom(src => src.EducationGoal))
            .ForMember(dest => dest.Learner, opt => opt.Ignore()); // Будет заполнено отдельно
    }

    private static string DetermineStatusType(string statusName)
    {
        return statusName.ToLower() switch
        {
            "подтверждено" => "Confirmation",
            "отклонено" => "Rejected",
            "согласовано" => "Approvement",
            "обработано" => "Processed",
            "зарегистрировано" => "Registered",
            _ => "Processed"
        };
    }

    private static string MapCourseType(CourseType type)
    {
        return type switch
        {
            CourseType.Course => "Course",
            CourseType.Conference => "Conference",
            CourseType.Certification => "Certification",
            CourseType.Workshop => "Workshop",
            _ => "Course"
        };
    }

    private static string MapCourseTrack(CourseTrack track)
    {
        return track switch
        {
            CourseTrack.SoftSkills => "SoftSkills",
            CourseTrack.HardSkills => "HardSkills",
            CourseTrack.ManagementSkills => "ManagementSkills",
            _ => "HardSkills Skills"
        };
    }

    private static string MapCourseFormat(CourseFormat format)
    {
        return format switch
        {
            CourseFormat.Online => "Online",
            CourseFormat.Offline => "Offline",
            _ => "Online"
        };
    }

    public class ApproversValueResolver : IValueResolver<Application, ApplicationDetailDto, List<UserBasicDto>>
    {
        private readonly UserManager<ApplicationUser> _userManager;

        public ApproversValueResolver(UserManager<ApplicationUser> userManager)
        {
            _userManager = userManager;
        }

        public List<UserBasicDto> Resolve(
            Application source,
            ApplicationDetailDto destination,
            List<UserBasicDto> destMember,
            ResolutionContext context)
        {
            if (string.IsNullOrEmpty(source.Approvers))
                return new List<UserBasicDto>();

            try
            {
                List<string> approverIds;

                try
                {
                    // Сначала пробуем как список int
                    var intIds = System.Text.Json.JsonSerializer.Deserialize<List<int>>(source.Approvers);
                    if (intIds != null)
                    {
                        approverIds = intIds.Select(id => id.ToString()).ToList();
                    }
                    else
                    {
                        approverIds = new List<string>();
                    }
                }
                catch
                {
                    approverIds = System.Text.Json.JsonSerializer.Deserialize<List<string>>(source.Approvers) ?? new List<string>();
                }

                if (approverIds.Count == 0)
                    return new List<UserBasicDto>();

                var result = new List<UserBasicDto>();

                foreach (var approverId in approverIds)
                {
                    var user = _userManager.FindByIdAsync(approverId).Result;
                    if (user != null)
                    {
                        result.Add(new UserBasicDto
                        {
                            Id = user.Id,
                            Name = user.Name,
                            Surname = user.Surname,
                            Patronymic = user.Patronymic,
                            Position = user.Position,
                            Department = string.Empty,
                            IsLeader = false
                        });
                    }
                }

                return result;
            }
            catch (Exception)
            {
                return new List<UserBasicDto>();
            }
        }
    }

    public class CourseResolver : IValueResolver<Application, ApplicationDetailDto, CourseDetailDto>
    {
        public CourseDetailDto Resolve(
            Application source,
            ApplicationDetailDto destination,
            CourseDetailDto destMember,
            ResolutionContext context)
        {
            var course = source.Course;

            return new CourseDetailDto
            {
                Id = course.Id,
                Name = course.Name,
                Description = course.Description,
                Type = course.Type.ToString(),
                Track = course.Track.ToString(),
                Format = course.Format.ToString(),
                TrainingCenter = course.TrainingCenter,
                StartDate = course.StartDate,
                EndDate = course.EndDate,
                Link = course.Link,
                Price = course.Price,
                EducationGoal = course.EducationGoal,
                Learner = new UserBasicDto()
            };
        }
    }
}