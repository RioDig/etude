using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;
using EtudeBackend.Tests.Helpers;
using FluentAssertions;
using System;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace EtudeBackend.Tests.Shared.Data.Repositories
{
    public class RepositoryTests : IDisposable
    {
        private readonly ApplicationDbContext _context;
        private readonly IRepository<Course> _repository;

        public RepositoryTests()
        {
            _context = TestDbContextFactory.Create();
            _repository = new Repository<Course>(_context);
        }

        public void Dispose()
        {
            TestDbContextFactory.Destroy(_context);
        }

        [Fact]
        public async Task GetAllAsync_ShouldReturnAllEntities()
        {
            // Arrange
            var course1 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Test Course 1",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 1, 1),
                EndDate = new DateOnly(2025, 1, 10)
            };

            var course2 = new Course
            {
                Id = Guid.NewGuid(),
                Name = "Test Course 2",
                Type = CourseType.Conference,
                StartDate = new DateOnly(2025, 2, 1),
                EndDate = new DateOnly(2025, 2, 10)
            };

            await _context.Courses.AddRangeAsync(course1, course2);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetAllAsync();

            // Assert
            result.Should().HaveCount(2);
            result.Should().Contain(c => c.Id == course1.Id);
            result.Should().Contain(c => c.Id == course2.Id);
        }

        [Fact]
        public async Task GetByIdAsync_ShouldReturnEntityWithMatchingId()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var course = new Course
            {
                Id = courseId,
                Name = "Test Course",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 1, 1),
                EndDate = new DateOnly(2025, 1, 10)
            };

            await _context.Courses.AddAsync(course);
            await _context.SaveChangesAsync();

            // Act
            var result = await _repository.GetByIdAsync(courseId);

            // Assert
            result.Should().NotBeNull();
            result!.Id.Should().Be(courseId);
            result.Name.Should().Be("Test Course");
        }

        [Fact]
        public async Task AddAsync_ShouldAddEntityToDatabase()
        {
            // Arrange
            var course = new Course
            {
                Id = Guid.NewGuid(),
                Name = "New Course",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 3, 1),
                EndDate = new DateOnly(2025, 3, 10)
            };

            // Act
            var result = await _repository.AddAsync(course);

            // Assert
            result.Should().NotBeNull();
            result.Id.Should().Be(course.Id);
            
            // Verify entity was added to database
            var dbCourse = await _context.Courses.FindAsync(course.Id);
            dbCourse.Should().NotBeNull();
            dbCourse!.Name.Should().Be("New Course");
        }

        [Fact]
        public async Task UpdateAsync_ShouldUpdateEntityInDatabase()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var course = new Course
            {
                Id = courseId,
                Name = "Original Course",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 4, 1),
                EndDate = new DateOnly(2025, 4, 10)
            };

            await _context.Courses.AddAsync(course);
            await _context.SaveChangesAsync();

            // Update the entity
            course.Name = "Updated Course";
            
            // Act
            await _repository.UpdateAsync(course);

            // Assert
            var updatedCourse = await _context.Courses.FindAsync(courseId);
            updatedCourse.Should().NotBeNull();
            updatedCourse!.Name.Should().Be("Updated Course");
        }

        [Fact]
        public async Task RemoveAsync_ShouldRemoveEntityFromDatabase()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var course = new Course
            {
                Id = courseId,
                Name = "Course to Delete",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 5, 1),
                EndDate = new DateOnly(2025, 5, 10)
            };

            await _context.Courses.AddAsync(course);
            await _context.SaveChangesAsync();

            // Act
            await _repository.RemoveAsync(course);

            // Assert
            var deletedCourse = await _context.Courses.FindAsync(courseId);
            deletedCourse.Should().BeNull();
        }

        [Fact]
        public async Task ExistsAsync_ShouldReturnTrueWhenEntityExists()
        {
            // Arrange
            var courseId = Guid.NewGuid();
            var course = new Course
            {
                Id = courseId,
                Name = "Existing Course",
                Type = CourseType.Training,
                StartDate = new DateOnly(2025, 6, 1),
                EndDate = new DateOnly(2025, 6, 10)
            };

            await _context.Courses.AddAsync(course);
            await _context.SaveChangesAsync();

            // Act
            var exists = await _repository.ExistsAsync(c => c.Id == courseId);

            // Assert
            exists.Should().BeTrue();
        }

        [Fact]
        public async Task ExistsAsync_ShouldReturnFalseWhenEntityDoesNotExist()
        {
            // Arrange
            var nonExistentId = Guid.NewGuid();

            // Act
            var exists = await _repository.ExistsAsync(c => c.Id == nonExistentId);

            // Assert
            exists.Should().BeFalse();
        }
    }
}