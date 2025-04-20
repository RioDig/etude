using AutoMapper;
using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Features.Users.Entities;

namespace EtudeBackend.Features.Users.Mappings;

public class UserMappingProfile : Profile
{
    public UserMappingProfile()
    {
        // User -> UserDto
        CreateMap<User, UserDto>()
            .ForMember(dest => dest.RoleName, opt => opt.MapFrom(src => src.Role.Name));
    }
}