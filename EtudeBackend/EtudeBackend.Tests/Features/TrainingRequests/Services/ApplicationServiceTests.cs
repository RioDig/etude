using AutoMapper;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Features.TrainingRequests.Services;
using EtudeBackend.Features.Users.Entities;
using EtudeBackend.Features.Users.Repositories;
using EtudeBackend.Shared.Exceptions;
using EtudeBackend.Tests.Helpers;
using FluentAssertions;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.VisualStudio.TestPlatform.TestHost;
using Xunit;

namespace EtudeBackend.Tests.Features.TrainingRequests.Services
{
    public class ApplicationServiceTests
    {
        private readonly Mock<IApplicationRepository> _applicationRepositoryMock;
        private readonly Mock<ICourseRepository> _courseRepositoryMock;
        private readonly Mock<IStatusRepository> _statusRepositoryMock;
        private readonly Mock<IUserRepository> _userRepositoryMock;
        private readonly IMapper _mapper;
        private readonly ApplicationService _service;

        public ApplicationServiceTests()
        {
            _applicationRepositoryMock = new Mock<IApplicationRepository>();
            _courseRepositoryMock = new Mock<ICourseRepository>();
            _statusRepositoryMock = new Mock<IStatusRepository>();
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

            _service = new ApplicationService(
                _applicationRepositoryMock.Object,
                _courseRepositoryMock.Object,
                _statusRepositoryMock.Object,
                _userRepositoryMock.Object,
                _mapper
            );
        }

        [Fact]
        public async Task CreateApplicationAsync_ShouldCreateNewApplicationAndCourse()
        {
            // Arrange
            var createDto = new CreateApplicationDto
            {
                Name = "Test Course",
                Description = "Test Description",
                Type = "Training",
                Track = "Hard",
                Format = "Online",
                TrainingCenter = "Test Center",
                AuthorId = 1,
                StartDate = new DateOnly(2025, 4, 1),
                EndDate = new DateOnly(2025, 4, 10),
                Price = 1000,
                EducationGoal = "Learn new skills",
                ApproverIds = new List<int> { 2, 3 }
            };

            var status = new Status
            {
                Id = Guid.NewGuid(),
                Name = "Новая",
                Description = "Новая заявка"
            };

            var author = new User
            {
                Id = 1,
                Name = "John",
                Surname = "Doe",
                OrgEmail = "john.doe@example.com",
                Position = "Developer"
            };

            var course = new Course(); // Will be created by the service
            var application = new Application(); // Will be created by the service

            _statusRepositoryMock.Setup(r => r.GetByNameAsync("Новая"))
                .ReturnsAsync(status);

            _courseRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Course>()))
                .ReturnsAsync((Course c) =>
                {
                    course = c;
                    return c;
                });

            _applicationRepositoryMock.Setup(r => r.AddAsync(It.IsAny<Application>()))
                .ReturnsAsync((Application a) =>
                {
                    application = a;
                    return a;
                });

            _applicationRepositoryMock.Setup(r => r.GetApplicationWithDetailsAsync(It.IsAny<Guid>()))
                .ReturnsAsync((Guid id) =>
                {
                    application.Id = id;
                    application.Course = course;
                    application.Status = status;
                    application.Author = author;
                    return application;
                });

            // Act
            var result = await _service.CreateApplicationAsync(createDto);

            // Assert
            result.Should().NotBeNull();
            result.Course.Should().NotBeNull();
            result.Course.Name.Should().Be("Test Course");

            _courseRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Course>()), Times.Once);
            _applicationRepositoryMock.Verify(r => r.AddAsync(It.IsAny<Application>()), Times.Once);
            _statusRepositoryMock.Verify(r => r.GetByNameAsync("Новая"), Times.Once);
        }

        [Fact]
        public async Task ChangeApplicationStatusAsync_ShouldUpdateStatusAndAddToHistory()
        {
            // Arrange
            var applicationId = Guid.NewGuid();
            var statusId = Guid.NewGuid();
            var statusDto = new ChangeStatusDto
            {
                StatusId = statusId,
                Comment = "Status change comment"
            };

            var application = new Application
            {
                Id = applicationId,
                StatusId = Guid.NewGuid(), // Current status
                ApprovalHistory = "" // Empty history
            };

            var newStatus = new Status
            {
                Id = statusId,
                Name = "Approved",
                Description = "Application approved"
            };

            _applicationRepositoryMock.Setup(r => r.GetByIdAsync(applicationId))
                .ReturnsAsync(application);

            _statusRepositoryMock.Setup(r => r.GetByIdAsync(statusId))
                .ReturnsAsync(newStatus);

            _applicationRepositoryMock.Setup(r => r.UpdateAsync(It.IsAny<Application>()))
                .Returns(Task.CompletedTask)
                .Callback<Application>(a =>
                {
                    // Update the application object to simulate database update
                    application.StatusId = a.StatusId;
                    application.ApprovalHistory = a.ApprovalHistory;
                    application.UpdatedAt = a.UpdatedAt;
                });

            _applicationRepositoryMock.Setup(r => r.GetApplicationWithDetailsAsync(applicationId))
                .ReturnsAsync(() =>
                {
                    application.Status = newStatus;
                    return application;
                });

            // Act
            var result = await _service.ChangeApplicationStatusAsync(applicationId, statusDto);

            // Assert
            result.Should().NotBeNull();
            result!.StatusId.Should().Be(statusId);
            result.StatusName.Should().Be("Approved");

            // Verify that the application was updated
            application.StatusId.Should().Be(statusId);
            application.ApprovalHistory.Should().Contain("Status change comment");
            application.UpdatedAt.Should().NotBeNull();

            _applicationRepositoryMock.Verify(r => r.GetByIdAsync(applicationId), Times.Once);
            _statusRepositoryMock.Verify(r => r.GetByIdAsync(statusId), Times.Once);
            _applicationRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Application>()), Times.Once);
            _applicationRepositoryMock.Verify(r => r.GetApplicationWithDetailsAsync(applicationId), Times.Once);
        }

        [Fact]
        public async Task ChangeApplicationStatusAsync_ShouldReturnNullWhenApplicationNotFound()
        {
            // Arrange
            var applicationId = Guid.NewGuid();
            var statusDto = new ChangeStatusDto
            {
                StatusId = Guid.NewGuid(),
                Comment = "Status change comment"
            };

            _applicationRepositoryMock.Setup(r => r.GetByIdAsync(applicationId))
                .ReturnsAsync((Application)null!);

            // Act
            var result = await _service.ChangeApplicationStatusAsync(applicationId, statusDto);

            // Assert
            result.Should().BeNull();
            _applicationRepositoryMock.Verify(r => r.GetByIdAsync(applicationId), Times.Once);
            _statusRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<Guid>()), Times.Never);
            _applicationRepositoryMock.Verify(r => r.UpdateAsync(It.IsAny<Application>()), Times.Never);
        }

        [Fact]
        public async Task DeleteApplicationAsync_ShouldDeleteApplicationAndRelatedCourse()
        {
            // Arrange
            var applicationId = Guid.NewGuid();
            var courseId = Guid.NewGuid();

            var application = new Application
            {
                Id = applicationId,
                CourseId = courseId
            };

            var course = new Course
            {
                Id = courseId,
                Name = "Course to delete"
            };

            _applicationRepositoryMock.Setup(r => r.GetByIdAsync(applicationId))
                .ReturnsAsync(application);

            _courseRepositoryMock.Setup(r => r.GetByIdAsync(courseId))
                .ReturnsAsync(course);

            _applicationRepositoryMock.Setup(r => r.RemoveAsync(It.IsAny<Application>()))
                .Returns(Task.CompletedTask);

            _courseRepositoryMock.Setup(r => r.RemoveAsync(It.IsAny<Course>()))
                .Returns(Task.CompletedTask);

            // Act
            var result = await _service.DeleteApplicationAsync(applicationId);

            // Assert
            result.Should().BeTrue();
            _applicationRepositoryMock.Verify(r => r.GetByIdAsync(applicationId), Times.Once);
            _courseRepositoryMock.Verify(r => r.GetByIdAsync(courseId), Times.Once);
            _applicationRepositoryMock.Verify(r => r.RemoveAsync(It.IsAny<Application>()), Times.Once);
            _courseRepositoryMock.Verify(r => r.RemoveAsync(It.IsAny<Course>()), Times.Once);
        }

        [Fact]
        public async Task DeleteApplicationAsync_ShouldReturnFalseWhenApplicationNotFound()
        {
            // Arrange
            var applicationId = Guid.NewGuid();

            _applicationRepositoryMock.Setup(r => r.GetByIdAsync(applicationId))
                .ReturnsAsync((Application)null!);

            // Act
            var result = await _service.DeleteApplicationAsync(applicationId);

            // Assert
            result.Should().BeFalse();
            _applicationRepositoryMock.Verify(r => r.GetByIdAsync(applicationId), Times.Once);
            _courseRepositoryMock.Verify(r => r.GetByIdAsync(It.IsAny<Guid>()), Times.Never);
            _applicationRepositoryMock.Verify(r => r.RemoveAsync(It.IsAny<Application>()), Times.Never);
            _courseRepositoryMock.Verify(r => r.RemoveAsync(It.IsAny<Course>()), Times.Never);
        }
    }
}