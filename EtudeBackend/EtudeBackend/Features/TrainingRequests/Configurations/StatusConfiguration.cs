using EtudeBackend.Features.TrainingRequests.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.TrainingRequests.Configurations;

public class StatusConfiguration : IEntityTypeConfiguration<Status>
{
    public void Configure(EntityTypeBuilder<Status> builder)
    {
        builder.HasKey(s => s.Id);
        
        builder.Property(s => s.Id)
            .HasDefaultValueSql("gen_random_uuid()");
        
        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(s => s.Description)
            .HasColumnType("text");
        
        builder.Property(s => s.Type)
            .IsRequired()
            .HasMaxLength(50)
            .HasDefaultValue("Processed");
            
        builder.Property(s => s.IsProtected)
            .IsRequired()
            .HasDefaultValue(false);
            
        builder.Property(s => s.IsTerminal)
            .IsRequired()
            .HasDefaultValue(false);
        
        builder.HasIndex(s => s.Name)
            .IsUnique();
        
        // Добавляем индекс для улучшения запросов по типу статуса
        builder.HasIndex(s => s.Type);
    }
}