using EtudeBackend.Features.Reports.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.Reports.Configurations;

public class ReportConfiguration : IEntityTypeConfiguration<Report>
{
    public void Configure(EntityTypeBuilder<Report> builder)
    {
        builder.HasKey(r => r.Id);
        
        builder.Property(r => r.Id)
            .HasDefaultValueSql("gen_random_uuid()");
            
        builder.Property(r => r.ReportType)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(r => r.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("now()");
            
        builder.Property(r => r.FilePath)
            .IsRequired()
            .HasMaxLength(500);
        
        builder.HasIndex(r => r.ReportType);
        builder.HasIndex(r => r.CreatedAt);
    }
}