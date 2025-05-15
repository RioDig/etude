using EtudeBackend.Features.TrainingRequests.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.TrainingRequests.Configurations;

public class UserStatisticsConfiguration : IEntityTypeConfiguration<UserStatistics>
{
    public void Configure(EntityTypeBuilder<UserStatistics> builder)
    {
        builder.HasKey(us => us.Id);
        
        builder.Property(us => us.Id)
            .HasDefaultValueSql("gen_random_uuid()");
        
        builder.Property(us => us.CourseId)
            .IsRequired();
        
        builder.Property(us => us.UserId)
            .IsRequired();
        
        builder.Property(us => us.EnrollmentDate);
        
        builder.Property(us => us.CompletionDate);
        
        builder.Property(us => us.AttendanceRate)
            .HasColumnType("decimal(5,2)");
        
        builder.Property(us => us.CertificateIssued)
            .HasDefaultValue(false);
        
        builder.HasOne(us => us.Course)
            .WithMany(c => c.Statistics)
            .HasForeignKey(us => us.CourseId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(us => us.User)
            .WithMany(u => u.Statistics)
            .HasForeignKey(us => us.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasIndex(us => new { us.UserId, us.CourseId })
            .IsUnique();
    }
}