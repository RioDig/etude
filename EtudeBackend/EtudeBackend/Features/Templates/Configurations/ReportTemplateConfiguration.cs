using EtudeBackend.Features.Templates.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.Templates.Configurations;

public class ReportTemplateConfiguration : IEntityTypeConfiguration<ReportTemplate>
{
    public void Configure(EntityTypeBuilder<ReportTemplate> builder)
    {
        builder.HasKey(rt => rt.Id);
        
        builder.Property(rt => rt.Id)
            .HasDefaultValueSql("gen_random_uuid()");
            
        builder.Property(rt => rt.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(rt => rt.Attributes)
            .HasColumnType("text");
            
        builder.Property(rt => rt.TemplateContent)
            .HasColumnType("text");
            
        builder.Property(rt => rt.TemplateType)
            .HasMaxLength(50);
        
        builder.Property(rt => rt.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("now()");
            
        builder.Property(rt => rt.UpdatedAt)
            .HasColumnType("timestamp with time zone");
        
        builder.HasIndex(rt => rt.Name)
            .IsUnique();
    }
}