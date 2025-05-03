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
            .ForMember(dest => dest.RoleName, opt => 
                opt.MapFrom(src => src.RoleId.ToString()));
                
        // ApplicationUser -> EmployeeDto
        CreateMap<ApplicationUser, EmployeeDto>();
    }
}