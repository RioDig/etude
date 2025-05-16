using AutoMapper;
using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Shared.Data;

namespace EtudeBackend.Features.Users.Mappings;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        // ApplicationUser -> UserDto
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.Role, opt => 
                opt.MapFrom(src => src.RoleId > 1 ? "admin" : "user"))
            .ForMember(dest => dest.Department, opt => 
                opt.MapFrom(src => string.Empty))
            .ForMember(dest => dest.IsLeader, opt => 
                opt.MapFrom(src => false));
                
        // ApplicationUser -> EmployeeDto
        CreateMap<ApplicationUser, EmployeeDto>();
    }
}