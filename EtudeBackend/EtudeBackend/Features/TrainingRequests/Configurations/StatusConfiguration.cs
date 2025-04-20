using EtudeBackend.Features.TrainingRequests.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.TrainingRequests.Configurations;

public class StatusConfiguration : IEntityTypeConfiguration<Status>
{
    public void Configure(EntityTypeBuilder<Status> builder)
    {
        builder.HasKey(s => s.Id);
        
        // Заменяем UseIdentityColumn на HasDefaultValueSql для Guid
        builder.Property(s => s.Id)
            .HasDefaultValueSql("gen_random_uuid()");  // Для PostgreSQL
        
        builder.Property(s => s.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(s => s.Description)
            .HasColumnType("text");
            
        builder.Property(s => s.IsProtected)
            .IsRequired()
            .HasDefaultValue(false);
            
        builder.Property(s => s.IsTerminal)
            .IsRequired()
            .HasDefaultValue(false);
            
        // Уникальный индекс для имени статуса
        builder.HasIndex(s => s.Name)
            .IsUnique();
    }
}