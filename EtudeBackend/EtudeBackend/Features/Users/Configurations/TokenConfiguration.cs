using EtudeBackend.Features.Users.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.Users.Configurations;

public class TokenConfiguration : IEntityTypeConfiguration<Token>
{
    public void Configure(EntityTypeBuilder<Token> builder)
    {
        builder.HasKey(t => t.Id);
        
        builder.Property(t => t.UserId)
            .IsRequired();
            
        builder.Property(t => t.Etude_Token)
            .IsRequired()
            .HasMaxLength(255);
            
        builder.Property(t => t.Solo_Token)
            .IsRequired()
            .HasMaxLength(255);
            
        builder.Property(t => t.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("now()");
            
        builder.Property(t => t.ExpiresAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone");
            
        builder.Property(t => t.IsActive)
            .HasDefaultValue(true);
            
        // Уникальные индексы для токенов
        builder.HasIndex(t => t.Etude_Token)
            .IsUnique();
            
        builder.HasIndex(t => t.Solo_Token)
            .IsUnique();
            
        // Связь с пользователем
        builder.HasOne(t => t.User)
            .WithMany(u => u.Tokens)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}