using AutoMapper;
using EtudeBackend.Features.Users.DTOs;
using EtudeBackend.Features.Users.Entities;
using EtudeBackend.Features.Users.Repositories;
using EtudeBackend.Features.Users.Services;
using EtudeBackend.Tests.Helpers;
using FluentAssertions;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace EtudeBackend.Tests.Features.Users.Services
{
    public class UserServiceTests
    {
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly IMapper _mapper;
        private readonly UserService _service;

        public UserServiceTests()
        {
            _userRepositoryMock = new Mock<IUserRepository>();
            
            
            // Настройка AutoMapper с автоматическим сканированием сборки для поиска профилей
            var cfg = new MapperConfiguration(cfg => 
            {
                // Сканируем сборку основного проекта для поиска всех профилей маппинга
                cfg.AddMaps("EtudeBackend");
                
                // Альтернативный вариант - явно указать сборку с профилями
                // cfg.AddMaps("EtudeBackend");
            });
            
            _mapper = new Mapper(cfg);
            
            _service = new UserService(_userRepositoryMock.Object, _mapper);
        }

        [Fact]
        public async Task GetAllUsersAsync_ShouldReturnAllUsers()
        {
            // Arrange
            var users = new List<User>
            {
                new User
                {
                    Id = 1,
                    Name = "John",
                    Surname = "Doe",
                    OrgEmail = "john.doe@example.com",
                    Position = "Developer",
                    RoleId = 1,
                    Role = new Role { Id = 1, Name = "Employee" }
                },
                new User
                {
                    Id = 2,
                    Name = "Jane",
                    Surname = "Smith",
                    OrgEmail = "jane.smith@example.com",
                    Position = "Manager",
                    RoleId = 2,
                    Role = new Role { Id = 2, Name = "Manager" }
                }
            };

            _userRepositoryMock.Setup(r => r.GetAllAsync())
                .ReturnsAsync(users);

            // Act
            var result = await _service.GetAllUsersAsync();

            // Assert
            result.Should().NotBeNull();
            result.Should().HaveCount(2);
            
            result[0].Id.Should().Be(1);
            result[0].Name.Should().Be("John");
            result[0].Surname.Should().Be("Doe");
            result[0].RoleName.Should().Be("Employee");
            
            result[1].Id.Should().Be(2);
            result[1].Name.Should().Be("Jane");
            result[1].Surname.Should().Be("Smith");
            result[1].RoleName.Should().Be("Manager");
            
            _userRepositoryMock.Verify(r => r.GetAllAsync(), Times.Once);
        }

        [Fact]
        public async Task GetUserByIdAsync_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            var userId = 1;
            var user = new User
            {
                Id = userId,
                Name = "John",
                Surname = "Doe",
                OrgEmail = "john.doe@example.com",
                Position = "Developer",
                RoleId = 1,
                Role = new Role { Id = 1, Name = "Employee" }
            };

            _userRepositoryMock.Setup(r => r.GetByUserIdAsync(userId))
                .ReturnsAsync(user);

            // Act
            var result = await _service.GetUserByIdAsync(userId);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(userId);
            result.Name.Should().Be("John");
            result.Surname.Should().Be("Doe");
            result.RoleName.Should().Be("Employee");
            
            _userRepositoryMock.Verify(r => r.GetByUserIdAsync(userId), Times.Once);
        }

        [Fact]
        public async Task GetUserByIdAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            var userId = 999;

            _userRepositoryMock.Setup(r => r.GetByUserIdAsync(userId))
                .ReturnsAsync((User)null);

            // Act
            var result = await _service.GetUserByIdAsync(userId);

            // Assert
            result.Should().BeNull();
            _userRepositoryMock.Verify(r => r.GetByUserIdAsync(userId), Times.Once);
        }

        [Fact]
        public async Task GetUserByEmailAsync_ShouldReturnUser_WhenUserExists()
        {
            // Arrange
            var email = "john.doe@example.com";
            var user = new User
            {
                Id = 1,
                Name = "John",
                Surname = "Doe",
                OrgEmail = email,
                Position = "Developer",
                RoleId = 1,
                Role = new Role { Id = 1, Name = "Employee" }
            };

            _userRepositoryMock.Setup(r => r.GetByEmailAsync(email))
                .ReturnsAsync(user);

            // Act
            var result = await _service.GetUserByEmailAsync(email);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(1);
            result.Name.Should().Be("John");
            result.Surname.Should().Be("Doe");
            result.OrgEmail.Should().Be(email);
            result.RoleName.Should().Be("Employee");
            
            _userRepositoryMock.Verify(r => r.GetByEmailAsync(email), Times.Once);
        }

        [Fact]
        public async Task GetUserByEmailAsync_ShouldReturnNull_WhenUserDoesNotExist()
        {
            // Arrange
            var email = "nonexistent@example.com";

            _userRepositoryMock.Setup(r => r.GetByEmailAsync(email))
                .ReturnsAsync((User)null);

            // Act
            var result = await _service.GetUserByEmailAsync(email);

            // Assert
            result.Should().BeNull();
            _userRepositoryMock.Verify(r => r.GetByEmailAsync(email), Times.Once);
        }
    }
}