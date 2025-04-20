using EtudeBackend.Features.Users.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.Users.Configurations;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.HasKey(u => u.Id);
        
        builder.Property(u => u.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(u => u.Surname)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(u => u.Patronymic)
            .HasMaxLength(100);
            
        builder.Property(u => u.OrgEmail)
            .IsRequired()
            .HasMaxLength(255);
            
        builder.Property(u => u.Position)
            .HasMaxLength(100);
            
        builder.Property(u => u.RoleId)
            .IsRequired();
            
        builder.Property(u => u.IsActive)
            .HasDefaultValue(true);
            
        builder.Property(u => u.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("now()");
            
        // Уникальный индекс для email
        builder.HasIndex(u => u.OrgEmail)
            .IsUnique();
            
        // Связь с ролью
        builder.HasOne(u => u.Role)
            .WithMany(r => r.Users)
            .HasForeignKey(u => u.RoleId);
    }
}