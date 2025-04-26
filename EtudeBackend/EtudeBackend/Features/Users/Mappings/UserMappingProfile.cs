using AutoMapper;
using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Features.Users.Entities;
using EtudeBackend.Shared.Data;

namespace EtudeBackend.Features.Users.Mappings;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        // User -> UserDto
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.RoleName, opt => 
                opt.MapFrom(src => src.RoleId));
    }
}