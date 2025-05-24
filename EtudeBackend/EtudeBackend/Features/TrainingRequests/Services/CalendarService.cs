using System.Text;
using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Features.TrainingRequests.Repositories;

namespace EtudeBackend.Features.TrainingRequests.Services;

public class CalendarService : ICalendarService
{
    private readonly IApplicationRepository _applicationRepository;
    private readonly ICourseRepository _courseRepository;
    private readonly ILogger<CalendarService> _logger;

    public CalendarService(
        IApplicationRepository applicationRepository,
        ICourseRepository courseRepository,
        ILogger<CalendarService> logger)
    {
        _applicationRepository = applicationRepository;
        _courseRepository = courseRepository;
        _logger = logger;
    }

    public async Task<string> GenerateIcsCalendarAsync(DateOnly startDate, DateOnly endDate)
    {
        // Получаем все курсы, которые пересекаются с запрошенным диапазоном
        var allCourses = await _courseRepository.GetAllAsync();
        
        var relevantCourses = allCourses.Where(c => 
            c.StartDate <= endDate && c.EndDate >= startDate
        ).ToList();

        if (!relevantCourses.Any())
        {
            _logger.LogWarning("No courses found overlapping with date range {StartDate} to {EndDate}", 
                startDate, endDate);
            throw new KeyNotFoundException($"No courses found overlapping with date range {startDate} to {endDate}");
        }

        var icsBuilder = new StringBuilder();

        // Begin calendar
        icsBuilder.AppendLine("BEGIN:VCALENDAR");
        icsBuilder.AppendLine("VERSION:2.0");
        icsBuilder.AppendLine("PRODID:-//Etude//Training Calendar//EN");
        icsBuilder.AppendLine("CALSCALE:GREGORIAN");
        icsBuilder.AppendLine("METHOD:PUBLISH");

        foreach (var course in relevantCourses)
        {
            // Get related application
            var applications = await _applicationRepository.GetByCourseIdAsync(course.Id);
            var application = applications.FirstOrDefault();

            // Event
            icsBuilder.AppendLine("BEGIN:VEVENT");

            // UID and timestamp
            icsBuilder.AppendLine($"UID:{course.Id}@etude");
            icsBuilder.AppendLine($"DTSTAMP:{DateTime.UtcNow.ToString("yyyyMMddTHHmmssZ")}");

            // Используем оригинальные даты курса без изменений
            icsBuilder.AppendLine($"DTSTART;VALUE=DATE:{course.StartDate.ToString("yyyyMMdd")}");
            icsBuilder.AppendLine($"DTEND;VALUE=DATE:{course.EndDate.AddDays(1).ToString("yyyyMMdd")}");

            // Title and description
            string status = application?.Status?.Name ?? "Scheduled";
            string title = $"{course.Name} ({status})";
            
            string description = BuildEventDescription(course, application);

            icsBuilder.AppendLine($"SUMMARY:{EscapeIcsText(title)}");
            icsBuilder.AppendLine($"DESCRIPTION:{EscapeIcsText(description)}");
            icsBuilder.AppendLine($"LOCATION:{EscapeIcsText(course.TrainingCenter)}");

            // End event
            icsBuilder.AppendLine("END:VEVENT");
        }

        // End calendar
        icsBuilder.AppendLine("END:VCALENDAR");

        return icsBuilder.ToString();
    }

    private string BuildEventDescription(Course course, Application? application)
    {
        var description = new StringBuilder();
        
        description.AppendLine($"Название: {course.Name}");
        description.AppendLine($"Тип: {GetRussianCourseType(course.Type)}");
        description.AppendLine($"Формат: {GetRussianCourseFormat(course.Format)}");
        
        if (!string.IsNullOrEmpty(course.TrainingCenter))
            description.AppendLine($"Место проведения: {course.TrainingCenter}");
        
        description.AppendLine($"Даты проведения: {course.StartDate:dd.MM.yyyy} - {course.EndDate:dd.MM.yyyy}");
        
        if (!string.IsNullOrEmpty(course.EducationGoal))
            description.AppendLine($"Цель обучения: {course.EducationGoal}");

        return description.ToString();
    }

    private string GetRussianCourseType(CourseType type)
    {
        return type switch
        {
            CourseType.Course => "Курс",
            CourseType.Conference => "Конференция",
            CourseType.Certification => "Сертификация",
            CourseType.Workshop => "Мастер-класс",
            _ => "Другое"
        };
    }

    private string GetRussianCourseFormat(CourseFormat format)
    {
        return format switch
        {
            CourseFormat.Online => "Онлайн",
            CourseFormat.Offline => "Оффлайн",
            _ => "Не определен"
        };
    }
    

    private string EscapeIcsText(string text)
    {
        if (string.IsNullOrEmpty(text))
            return string.Empty;

        return text
            .Replace("\\", "\\\\")
            .Replace(",", "\\,")
            .Replace(";", "\\;")
            .Replace("\n", "\\n")
            .Replace("\r", "");
    }
}