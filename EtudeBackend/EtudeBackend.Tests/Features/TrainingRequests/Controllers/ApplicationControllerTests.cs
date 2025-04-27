using EtudeBackend.Features.TrainingRequests.Controllers;
using EtudeBackend.Features.TrainingRequests.DTOs;
using EtudeBackend.Features.TrainingRequests.Services;
using EtudeBackend.Shared.Models;
using FluentAssertions;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Distributed;
using Microsoft.Extensions.Logging;
using Moq;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Xunit;

namespace EtudeBackend.Tests.Features.TrainingRequests.Controllers
{
    public class ApplicationControllerTests
    {
        private readonly Mock<IApplicationService> _applicationServiceMock;
        private readonly Mock<IDistributedCache> _cacheMock;
        private readonly Mock<ILogger<ApplicationController>> _loggerMock;
        private readonly ApplicationController _controller;
        private readonly DefaultHttpContext _httpContext;

        public ApplicationControllerTests()
        {
            _applicationServiceMock = new Mock<IApplicationService>();
            _cacheMock = new Mock<IDistributedCache>();
            _loggerMock = new Mock<ILogger<ApplicationController>>();
            _httpContext = new DefaultHttpContext();
            
            _controller = new ApplicationController(
                _applicationServiceMock.Object, 
                _cacheMock.Object, 
                _loggerMock.Object);
            
            _controller.ControllerContext = new ControllerContext
            {
                HttpContext = _httpContext
            };
            
            // Настройка мока кэша для базовых методов
            _cacheMock.Setup(c => c.SetAsync(
                    It.IsAny<string>(), 
                    It.IsAny<byte[]>(),
                    It.IsAny<DistributedCacheEntryOptions>(),
                    It.IsAny<CancellationToken>()))
                .Returns(Task.CompletedTask);
                
            _cacheMock.Setup(c => c.GetAsync(
                    It.IsAny<string>(), 
                    It.IsAny<CancellationToken>()))
                .ReturnsAsync((byte[])null);
        }

        [Fact]
        public async Task GetApplications_ShouldReturnOkWithApplications()
        {
            // Arrange
            var applications = new List<ApplicationDto>
            {
                new ApplicationDto
                {
                    Id = Guid.NewGuid(),
                    StatusId = Guid.NewGuid(),
                    StatusName = "New",
                    Course = new CourseBasicDto
                    {
                        Id = Guid.NewGuid(),
                        Name = "Test Course"
                    }
                }
            };

            var pagedResult = new PagedResult<ApplicationDto>(
                applications,
                totalCount: 1,
                currentPage: 1,
                pageSize: 10
            );

            _applicationServiceMock.Setup(s => s.GetApplicationsAsync(
                    It.IsAny<int>(),
                    It.IsAny<int>(),
                    It.IsAny<string>(),
                    It.IsAny<string>(),
                    It.IsAny<Dictionary<string, string>>()))
                .ReturnsAsync(pagedResult);

            // Act
            var result = await _controller.GetApplications();

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var returnValue = okResult.Value.Should().BeAssignableTo<PagedResult<ApplicationDto>>().Subject;
            returnValue.Items.Should().HaveCount(1);
            returnValue.TotalCount.Should().Be(1);
            returnValue.CurrentPage.Should().Be(1);
            returnValue.PageSize.Should().Be(10);
            
            // Проверка, что кэш использовался
            _cacheMock.Verify(c => c.SetAsync(
                It.IsAny<string>(),
                It.IsAny<byte[]>(),
                It.IsAny<DistributedCacheEntryOptions>(),
                It.IsAny<CancellationToken>()), 
                Times.AtLeastOnce);
                
            // Временно
            // _loggerMock.Verify(
            //     logger => logger.Log(
            //         LogLevel.Error,
            //         It.IsAny<EventId>(),
            //         It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("test2")),
            //         null,
            //         It.IsAny<Func<It.IsAnyType, Exception, string>>()),
            //     Times.Once);
        }

        [Fact]
        public async Task GetApplicationById_ShouldReturnOkWithApplication_WhenApplicationExists()
        {
            // Arrange
            var applicationId = Guid.NewGuid();
            var application = new ApplicationDetailDto
            {
                Id = applicationId,
                StatusId = Guid.NewGuid(),
                StatusName = "New",
                Author = new UserBasicDto { Id = 1, Name = "John", Surname = "Doe" },
                Course = new CourseDetailDto
                {
                    Id = Guid.NewGuid(),
                    Name = "Test Course"
                }
            };

            _applicationServiceMock.Setup(s => s.GetApplicationByIdAsync(applicationId))
                .ReturnsAsync(application);

            // Act
            var result = await _controller.GetApplicationById(applicationId);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var returnValue = okResult.Value.Should().BeAssignableTo<ApplicationDetailDto>().Subject;
            returnValue.Id.Should().Be(applicationId);
            returnValue.StatusName.Should().Be("New");
            returnValue.Course.Name.Should().Be("Test Course");
        }

        [Fact]
        public async Task GetApplicationById_ShouldReturnNotFound_WhenApplicationDoesNotExist()
        {
            // Arrange
            var applicationId = Guid.NewGuid();

            _applicationServiceMock.Setup(s => s.GetApplicationByIdAsync(applicationId))
                .ReturnsAsync((ApplicationDetailDto)null);

            // Act
            var result = await _controller.GetApplicationById(applicationId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task CreateApplication_ShouldReturnCreatedWithApplication_WhenModelStateIsValid()
        {
            // Arrange
            var createDto = new CreateApplicationDto
            {
                Name = "New Course",
                Description = "Course Description",
                Type = "Training",
                Track = "Hard",
                Format = "Online",
                TrainingCenter = "Test Center",
                AuthorId = 1,
                StartDate = new DateOnly(2025, 5, 1),
                EndDate = new DateOnly(2025, 5, 10),
                Price = 1000,
                EducationGoal = "Learn new skills",
                ApproverIds = new List<int> { 2, 3 }
            };

            var createdApplication = new ApplicationDetailDto
            {
                Id = Guid.NewGuid(),
                StatusId = Guid.NewGuid(),
                StatusName = "New",
                Author = new UserBasicDto { Id = 1, Name = "John", Surname = "Doe" },
                Course = new CourseDetailDto
                {
                    Id = Guid.NewGuid(),
                    Name = "New Course"
                }
            };

            _applicationServiceMock.Setup(s => s.CreateApplicationAsync(createDto))
                .ReturnsAsync(createdApplication);

            // Act
            var result = await _controller.CreateApplication(createDto);

            // Assert
            var createdResult = result.Should().BeOfType<CreatedAtActionResult>().Subject;
            createdResult.ActionName.Should().Be(nameof(ApplicationController.GetApplicationById));
            createdResult.RouteValues["id"].Should().Be(createdApplication.Id);
            
            var returnValue = createdResult.Value.Should().BeAssignableTo<ApplicationDetailDto>().Subject;
            returnValue.Id.Should().Be(createdApplication.Id);
            returnValue.StatusName.Should().Be("New");
            returnValue.Course.Name.Should().Be("New Course");
        }

        [Fact]
        public async Task UpdateApplication_ShouldReturnOkWithUpdatedApplication_WhenSuccessful()
        {
            // Arrange
            var applicationId = Guid.NewGuid();
            var updateDto = new UpdateApplicationDto
            {
                Name = "Updated Course",
                Description = "Updated Description"
            };

            var updatedApplication = new ApplicationDetailDto
            {
                Id = applicationId,
                StatusId = Guid.NewGuid(),
                StatusName = "Updated",
                Author = new UserBasicDto { Id = 1, Name = "John", Surname = "Doe" },
                Course = new CourseDetailDto
                {
                    Id = Guid.NewGuid(),
                    Name = "Updated Course"
                }
            };

            _applicationServiceMock.Setup(s => s.UpdateApplicationAsync(applicationId, updateDto))
                .ReturnsAsync(updatedApplication);

            // Act
            var result = await _controller.UpdateApplication(applicationId, updateDto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var returnValue = okResult.Value.Should().BeAssignableTo<ApplicationDetailDto>().Subject;
            returnValue.Id.Should().Be(applicationId);
            returnValue.Course.Name.Should().Be("Updated Course");
        }

        [Fact]
        public async Task ChangeApplicationStatus_ShouldReturnOkWithUpdatedApplication_WhenSuccessful()
        {
            // Arrange
            var applicationId = Guid.NewGuid();
            var statusDto = new ChangeStatusDto
            {
                StatusId = Guid.NewGuid(),
                Comment = "Status change comment"
            };

            var updatedApplication = new ApplicationDetailDto
            {
                Id = applicationId,
                StatusId = statusDto.StatusId,
                StatusName = "Approved",
                Author = new UserBasicDto { Id = 1, Name = "John", Surname = "Doe" },
                Course = new CourseDetailDto
                {
                    Id = Guid.NewGuid(),
                    Name = "Test Course"
                }
            };

            _applicationServiceMock.Setup(s => s.ChangeApplicationStatusAsync(applicationId, statusDto))
                .ReturnsAsync(updatedApplication);

            // Act
            var result = await _controller.ChangeApplicationStatus(applicationId, statusDto);

            // Assert
            var okResult = result.Should().BeOfType<OkObjectResult>().Subject;
            var returnValue = okResult.Value.Should().BeAssignableTo<ApplicationDetailDto>().Subject;
            returnValue.Id.Should().Be(applicationId);
            returnValue.StatusId.Should().Be(statusDto.StatusId);
            returnValue.StatusName.Should().Be("Approved");
        }

        [Fact]
        public async Task ChangeApplicationStatus_ShouldReturnNotFound_WhenApplicationDoesNotExist()
        {
            // Arrange
            var applicationId = Guid.NewGuid();
            var statusDto = new ChangeStatusDto
            {
                StatusId = Guid.NewGuid(),
                Comment = "Status change comment"
            };

            _applicationServiceMock.Setup(s => s.ChangeApplicationStatusAsync(applicationId, statusDto))
                .ReturnsAsync((ApplicationDetailDto)null);

            // Act
            var result = await _controller.ChangeApplicationStatus(applicationId, statusDto);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }

        [Fact]
        public async Task DeleteApplication_ShouldReturnNoContent_WhenSuccessful()
        {
            // Arrange
            var applicationId = Guid.NewGuid();

            _applicationServiceMock.Setup(s => s.DeleteApplicationAsync(applicationId))
                .ReturnsAsync(true);

            // Act
            var result = await _controller.DeleteApplication(applicationId);

            // Assert
            result.Should().BeOfType<NoContentResult>();
        }

        [Fact]
        public async Task DeleteApplication_ShouldReturnNotFound_WhenApplicationDoesNotExist()
        {
            // Arrange
            var applicationId = Guid.NewGuid();

            _applicationServiceMock.Setup(s => s.DeleteApplicationAsync(applicationId))
                .ReturnsAsync(false);

            // Act
            var result = await _controller.DeleteApplication(applicationId);

            // Assert
            result.Should().BeOfType<NotFoundResult>();
        }
    }
}