using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.Users.Entities;
using EtudeBackend.Features.Logging.Entities;
using EtudeBackend.Features.Reports.DTOs;
using EtudeBackend.Features.Templates.Entities;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Shared.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<Course> Courses { get; set; } = null!;
        public DbSet<Application> Applications { get; set; } = null!;
        public DbSet<Status> Statuses { get; set; } = null!;
        public DbSet<UserStatistics> UserStatistics { get; set; } = null!;


        public DbSet<Token> Tokens { get; set; } = null!;

        public DbSet<EventType> EventTypes { get; set; } = null!;
        public DbSet<Log> Logs { get; set; } = null!;
        public DbSet<Report> Reports { get; set; } = null!;
        public DbSet<CourseTemplate> CourseTemplates { get; set; } = null!;
        public DbSet<ReportTemplate> ReportTemplates { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        }
    }
}