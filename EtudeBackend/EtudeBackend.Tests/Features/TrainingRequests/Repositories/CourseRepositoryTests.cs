using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;
using EtudeBackend.Shared.Data;
using EtudeBackend.Tests.Helpers;
using FluentAssertions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace EtudeBackend.Tests.Features.TrainingRequests.Repositories
{
    public class CourseRepositoryTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly CourseRepository _repository;

        public CourseRepositoryTests()
        {
            _context = TestDbContextFactory.Create();
            _repository = new CourseRepository(_context);
        }

        public void Dispose()
        {
            TestDbContextFactory.Destroy(_context);
        }

        [Fact]
        public async Task GetByCourseNameAsync_ShouldReturnMatchingCourses()
        {
            // Arrange
            var course1 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Java Programming",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 1, 1),
                EndDate = new DateOnly(2025, 1, 10)
            };

            var course2 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Python Programming",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 2, 1),
                EndDate = new DateOnly(2025, 2, 10)
            };

            var course3 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "JavaScript Advanced",
                Type = CourseType.Conference,
                StartDate = new DateOnly(2025, 3, 1),
                EndDate = new DateOnly(2025, 3, 10)
            };

            await _context.Courses.AddRangeAsync(course1, course2, course3);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByCourseNameAsync("Programming");

            // Assert
            result.Should().HaveCount(2);
            result.Should().Contain(c => c.Id == course1.Id);
            result.Should().Contain(c => c.Id == course2.Id);
            result.Should().NotContain(c => c.Id == course3.Id);
        }

        [Fact]
        public async Task GetByTypeAsync_ShouldReturnCoursesOfSpecificType()
        {
            // Arrange
            var course1 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Java Training",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 1, 1),
                EndDate = new DateOnly(2025, 1, 10)
            };

            var course2 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Python Training",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 2, 1),
                EndDate = new DateOnly(2025, 2, 10)
            };

            var course3 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Developer Conference",
                Type = CourseType.Conference,
                StartDate = new DateOnly(2025, 3, 1),
                EndDate = new DateOnly(2025, 3, 10)
            };

            await _context.Courses.AddRangeAsync(course1, course2, course3);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByTypeAsync(CourseType.Training);

            // Assert
            result.Should().HaveCount(2);
            result.Should().Contain(c => c.Id == course1.Id);
            result.Should().Contain(c => c.Id == course2.Id);
            result.Should().NotContain(c => c.Id == course3.Id);
        }

        [Fact]
        public async Task GetByTrackAsync_ShouldReturnCoursesOfSpecificTrack()
        {
            // Arrange
            var course1 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Soft Skills Training",
                Type = CourseType.Training,
                Track = CourseTrack.Soft,
                StartDate = new DateOnly(2025, 1, 1),
                EndDate = new DateOnly(2025, 1, 10)
            };

            var course2 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Hard Skills Training",
                Type = CourseType.Training,
                Track = CourseTrack.Hard,
                StartDate = new DateOnly(2025, 2, 1),
                EndDate = new DateOnly(2025, 2, 10)
            };

            await _context.Courses.AddRangeAsync(course1, course2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByTrackAsync(CourseTrack.Soft);

            // Assert
            result.Should().HaveCount(1);
            result.Should().Contain(c => c.Id == course1.Id);
            result.Should().NotContain(c => c.Id == course2.Id);
        }

        [Fact]
        public async Task GetByFormatAsync_ShouldReturnCoursesOfSpecificFormat()
        {
            // Arrange
            var course1 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Online Course",
                Type = CourseType.Training,
                Format = CourseFormat.Online,
                StartDate = new DateOnly(2025, 1, 1),
                EndDate = new DateOnly(2025, 1, 10)
            };

            var course2 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Offline Course",
                Type = CourseType.Training,
                Format = CourseFormat.Offline,
                StartDate = new DateOnly(2025, 2, 1),
                EndDate = new DateOnly(2025, 2, 10)
            };

            await _context.Courses.AddRangeAsync(course1, course2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByFormatAsync(CourseFormat.Online);

            // Assert
            result.Should().HaveCount(1);
            result.Should().Contain(c => c.Id == course1.Id);
            result.Should().NotContain(c => c.Id == course2.Id);
        }

        [Fact]
        public async Task GetByDateRangeAsync_ShouldReturnCoursesInDateRange()
        {
            // Arrange
            var course1 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "January Course",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 1, 1),
                EndDate = new DateOnly(2025, 1, 10)
            };

            var course2 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "February Course",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 2, 1),
                EndDate = new DateOnly(2025, 2, 10)
            };

            var course3 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "March Course",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 3, 1),
                EndDate = new DateOnly(2025, 3, 10)
            };

            await _context.Courses.AddRangeAsync(course1, course2, course3);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByDateRangeAsync(
                new DateOnly(2025, 1, 1),
                new DateOnly(2025, 2, 15)
            );

            // Assert
            result.Should().HaveCount(2);
            result.Should().Contain(c => c.Id == course1.Id);
            result.Should().Contain(c => c.Id == course2.Id);
            result.Should().NotContain(c => c.Id == course3.Id);
        }

        [Fact]
        public async Task GetActiveCoursesAsync_ShouldReturnOnlyActiveCourses()
        {
            // Arrange
            var course1 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Active Course",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 1, 1),
                EndDate = new DateOnly(2025, 1, 10),
                IsActive = true
            };

            var course2 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Inactive Course",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 2, 1),
                EndDate = new DateOnly(2025, 2, 10),
                IsActive = false
            };

            await _context.Courses.AddRangeAsync(course1, course2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetActiveCoursesAsync();

            // Assert
            result.Should().HaveCount(1);
            result.Should().Contain(c => c.Id == course1.Id);
            result.Should().NotContain(c => c.Id == course2.Id);
        }
    }
}