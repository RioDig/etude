using EtudeBackend.Features.Templates.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace EtudeBackend.Features.Templates.Configurations;

public class CourseTemplateConfiguration : IEntityTypeConfiguration<CourseTemplate>
{
    public void Configure(EntityTypeBuilder<CourseTemplate> builder)
    {
        builder.HasKey(ct => ct.Id);
        
        // Настройка GUID как первичного ключа
        builder.Property(ct => ct.Id)
            .HasDefaultValueSql("gen_random_uuid()");  // Для PostgreSQL
            
        builder.Property(ct => ct.Name)
            .IsRequired()
            .HasMaxLength(100);
            
        builder.Property(ct => ct.Description)
            .HasColumnType("text");
            
        // Конфигурация для перечислений
        builder.Property(ct => ct.Type)
            .IsRequired()
            .HasConversion<string>();  // Преобразование enum в строку для хранения в БД
            
        builder.Property(ct => ct.Track)
            .IsRequired()
            .HasConversion<string>();
            
        builder.Property(ct => ct.Format)
            .IsRequired()
            .HasConversion<string>();
            
        builder.Property(ct => ct.TrainingCenter)
            .HasMaxLength(100);
            
        // Настройки для timestamp полей
        builder.Property(ct => ct.CreatedAt)
            .IsRequired()
            .HasColumnType("timestamp with time zone")
            .HasDefaultValueSql("now()");
            
        builder.Property(ct => ct.UpdatedAt)
            .HasColumnType("timestamp with time zone");
            
        // Уникальный индекс для имени шаблона
        builder.HasIndex(ct => ct.Name)
            .IsUnique();
            
        // Индексы для оптимизации запросов
        builder.HasIndex(ct => ct.Type);
        builder.HasIndex(ct => ct.Track);
        builder.HasIndex(ct => ct.Format);
    }
}