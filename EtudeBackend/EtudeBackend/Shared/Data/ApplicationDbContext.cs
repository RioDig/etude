using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.Users.Entities;
using EtudeBackend.Features.Logging.Entities;
using EtudeBackend.Features.Templates.Entities;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Shared.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        // Сущности TrainingRequests
        public DbSet<Course> Courses { get; set; } = null!;
        public DbSet<Application> Applications { get; set; } = null!;
        public DbSet<Status> Statuses { get; set; } = null!;
        public DbSet<UserStatistics> UserStatistics { get; set; } = null!;
        
        // Сущности Users
        public DbSet<User> Users { get; set; } = null!;
        public DbSet<Role> Roles { get; set; } = null!;
        public DbSet<Token> Tokens { get; set; } = null!;
        
        // Сущности Logging
        public DbSet<EventType> EventTypes { get; set; } = null!;
        public DbSet<Log> Logs { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            
            // Применяем конфигурации сущностей из всех feature слайсов
            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
        
        public DbSet<CourseTemplate> CourseTemplates { get; set; } = null!;
        public DbSet<ReportTemplate> ReportTemplates { get; set; } = null!;
    }
}