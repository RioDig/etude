using AutoMapper;
using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Shared.Data;
using Microsoft.AspNetCore.Identity;

namespace EtudeBackend.Features.Users.Mappings;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        // ApplicationUser -> UserDto
        CreateMap<ApplicationUser, UserDto>()
            .ForMember(dest => dest.RoleName, opt => 
                opt.MapFrom(src => src.RoleId.ToString()));
    }
}