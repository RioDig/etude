using System;

namespace EtudeBackend.Features.TrainingRequests.DTOs
{
    public class UserStatisticsDto
    {
        public Guid Id { get; set; }
        public Guid CourseId { get; set; }
        public string UserId { get; set; } = string.Empty;
        public DateOnly? EnrollmentDate { get; set; }
        public DateOnly? CompletionDate { get; set; }
        public decimal? AttendanceRate { get; set; }
        public bool CertificateIssued { get; set; }

        public string? CourseName { get; set; }
        public string? UserFullName { get; set; }
    }

    public class CreateUserStatisticsDto
    {
        public Guid CourseId { get; set; }
        public string UserId { get; set; } = string.Empty;
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