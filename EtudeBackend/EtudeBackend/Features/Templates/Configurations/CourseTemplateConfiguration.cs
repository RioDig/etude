using EtudeBackend.Features.Templates.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.Templates.Configurations;

public class CourseTemplateConfiguration : IEntityTypeConfiguration<CourseTemplate>
{
    public void Configure(EntityTypeBuilder<CourseTemplate> builder)
    {
        builder.HasKey(ct => ct.Id);
        
        builder.Property(ct => ct.Id)
            .HasDefaultValueSql("gen_random_uuid()");
            
        builder.Property(ct => ct.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(ct => ct.Description)
            .HasColumnType("text");
        
        builder.Property(ct => ct.Type)
            .IsRequired()
            .HasConversion<string>();
            
        builder.Property(ct => ct.Track)
            .IsRequired()
            .HasConversion<string>();
            
        builder.Property(ct => ct.Format)
            .IsRequired()
            .HasConversion<string>();
            
        builder.Property(ct => ct.TrainingCenter)
            .HasMaxLength(100);
        
        builder.Property(ct => ct.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("now()");
            
        builder.Property(ct => ct.UpdatedAt)
            .HasColumnType("timestamp with time zone");
        
        builder.HasIndex(ct => ct.Name)
            .IsUnique();
        
        builder.HasIndex(ct => ct.Type);
        builder.HasIndex(ct => ct.Track);
        builder.HasIndex(ct => ct.Format);
    }
}