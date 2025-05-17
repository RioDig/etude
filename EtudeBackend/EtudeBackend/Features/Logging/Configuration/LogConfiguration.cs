using EtudeBackend.Features.Logging.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.Logging.Configuration;

public class LogConfiguration : IEntityTypeConfiguration<Log>
{
    public void Configure(EntityTypeBuilder<Log> builder)
    {
        builder.HasKey(l => l.Id);

        builder.Property(l => l.UserId)
            .IsRequired();

        builder.Property(l => l.EventTimestamp)
            .IsRequired()
            .HasColumnType("timestamp with time zone");

        builder.Property(l => l.EventTypeId)
            .IsRequired();

        builder.Property(l => l.Message)
            .IsRequired()
            .HasColumnType("text");

        builder.Property(l => l.IPAddress)
            .IsRequired();

        builder.Property(l => l.ObjectType)
            .IsRequired();

        // Связи
        builder.HasOne(l => l.EventType)
            .WithMany(e => e.Logs)
            .HasForeignKey(l => l.EventTypeId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(l => l.User)
            .WithMany()
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}