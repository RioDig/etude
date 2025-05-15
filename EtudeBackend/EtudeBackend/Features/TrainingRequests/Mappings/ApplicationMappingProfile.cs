using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Identity;

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
            .ForMember(dest => dest.Author, opt => opt.MapFrom(src => src.Author))
            .ForMember(dest => dest.Course, opt => opt.MapFrom(src => src.Course))
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
            .ForMember(dest => dest.Learner, opt => opt.MapFrom(src => src.EmployeeId.ToString()));
            
        // ApplicationUser -> UserBasicDto
        CreateMap<ApplicationUser, UserBasicDto>();
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
                var approverIds = System.Text.Json.JsonSerializer.Deserialize<List<int>>(source.Approvers);
                if (approverIds == null || approverIds.Count == 0)
                    return new List<UserBasicDto>();
                    
                var result = new List<UserBasicDto>();
                
                foreach (var approverId in approverIds)
                {
                    var user = _userManager.FindByIdAsync(approverId.ToString()).Result;
                    if (user != null)
                    {
                        result.Add(new UserBasicDto
                        {
                            Id = user.Id,
                            Name = user.Name,
                            Surname = user.Surname,
                            Patronymic = user.Patronymic,
                            Position = user.Position
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
}