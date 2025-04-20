using System;

namespace EtudeBackend.Features.TrainingRequests.DTOs
{
    public class UserStatisticsDto
    {
        public Guid Id { get; set; }  // Изменено с int на Guid
        public Guid CourseId { get; set; }  // Изменено с int на Guid
        public int UserId { get; set; }
        public DateOnly? EnrollmentDate { get; set; }
        public DateOnly? CompletionDate { get; set; }
        public decimal? AttendanceRate { get; set; }
        public bool CertificateIssued { get; set; }
        
        // Дополнительные поля для отображения связанных данных
        public string? CourseName { get; set; }
        public string? UserFullName { get; set; }  // Изменено с UserName на UserFullName
    }

    public class CreateUserStatisticsDto
    {
        public Guid CourseId { get; set; }  // Изменено с int на Guid
        public int UserId { get; set; }
        public DateOnly? EnrollmentDate { get; set; }
        public DateOnly? CompletionDate { get; set; }
        public decimal? AttendanceRate { get; set; }
        public bool CertificateIssued { get; set; }
    }

    public class UpdateUserStatisticsDto
    {
        public DateOnly? EnrollmentDate { get; set; }
        public DateOnly? CompletionDate { get; set; }
        public decimal? AttendanceRate { get; set; }
        public bool? CertificateIssued { get; set; }
    }
}