using EtudeBackend.Features.Users.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.Users.Configurations;

public class RoleConfiguration : IEntityTypeConfiguration<Role>
{
    public void Configure(EntityTypeBuilder<Role> builder)
    {
        builder.HasKey(r => r.Id);
        
        builder.Property(r => r.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(r => r.Permissions)
            .IsRequired()
            .HasColumnType("text");
            
        builder.Property(r => r.Description)
            .HasColumnType("text");
            
        // Уникальный индекс для имени роли
        builder.HasIndex(r => r.Name)
            .IsUnique();
    }
}