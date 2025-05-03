using EtudeBackend.Features.TrainingRequests.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.TrainingRequests.Configurations;

public class ApplicationConfiguration : IEntityTypeConfiguration<Application>
{
    public void Configure(EntityTypeBuilder<Application> builder)
    {
        builder.HasKey(a => a.Id);
    
        builder.Property(a => a.Id)
            .HasDefaultValueSql("gen_random_uuid()");
    
        builder.Property(a => a.SoloDocId)
            .IsRequired();
    
        builder.Property(a => a.CourseId)
            .IsRequired();
    
        builder.Property(a => a.AuthorId)
            .IsRequired();
    
        builder.Property(a => a.StatusId)
            .IsRequired();
    
        builder.Property(a => a.ApprovalHistory)
            .HasColumnType("text");
        
        builder.Property(a => a.Approvers)
            .HasColumnType("text");

        builder.Property(a => a.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("now()");
        
        builder.Property(a => a.UpdatedAt)
            .HasColumnType("timestamp with time zone");
        
        // Связи
        builder.HasOne(a => a.Course)
            .WithMany(c => c.Applications)
            .HasForeignKey(a => a.CourseId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(a => a.Status)
            .WithMany(s => s.Applications)
            .HasForeignKey(a => a.StatusId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.HasOne(a => a.Author)
            .WithMany(u => u.Applications)
            .HasForeignKey(a => a.AuthorId)
            .OnDelete(DeleteBehavior.Restrict);
        
        // Индексы
        builder.HasIndex(a => a.CourseId);
        builder.HasIndex(a => a.AuthorId);
        builder.HasIndex(a => a.StatusId);
        builder.HasIndex(a => a.SoloDocId);
        builder.HasIndex(a => a.CreatedAt);
    }
}