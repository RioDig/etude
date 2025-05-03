using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.TrainingRequests.Configurations;

public class CourseConfiguration : IEntityTypeConfiguration<Course>
{
    public void Configure(EntityTypeBuilder<Course> builder)
    {
        builder.HasKey(c => c.Id);
        
        // Настройка GUID как первичного ключа
        builder.Property(c => c.Id)
            .HasDefaultValueSql("gen_random_uuid()");  // Для PostgreSQL
        builder.Property(c => c.Name)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(c => c.Description)
            .HasColumnType("text");

        builder.Property(c => c.TrainingCenter)
            .HasMaxLength(100);
        

        builder.Property(c => c.EducationGoal)
            .HasColumnType("text");

        builder.Property(c => c.Price)
            .HasColumnType("decimal(10,2)");

        // Конфигурация для перечислений
        builder.Property(c => c.Type)
            .IsRequired()
            .HasConversion<string>();  
        builder.Property(c => c.Track)
            .IsRequired()
            .HasConversion<string>();
        builder.Property(c => c.Format)
            .IsRequired()
            .HasConversion<string>();
        // Настройки для timestamp полей
        builder.Property(c => c.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("now()");
            
        builder.Property(c => c.UpdatedAt)
            .HasColumnType("timestamp with time zone");
            
        // Индексы для оптимизации запросов
        builder.HasIndex(c => c.Type);
        builder.HasIndex(c => c.Track);
        builder.HasIndex(c => c.Format);
        builder.HasIndex(c => c.StartDate);
        builder.HasIndex(c => c.IsActive);
    }
}