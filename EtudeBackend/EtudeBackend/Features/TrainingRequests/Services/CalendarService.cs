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
            // Курс начинается до конца запрошенного диапазона И заканчивается после начала запрошенного диапазона
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

            // Calculate actual start/end dates for this event within requested range
            var eventStart = course.StartDate < startDate ? startDate : course.StartDate;
            var eventEnd = course.EndDate > endDate ? endDate : course.EndDate;

            // Event
            icsBuilder.AppendLine("BEGIN:VEVENT");

            // UID and timestamp
            icsBuilder.AppendLine($"UID:{course.Id}@etude");
            icsBuilder.AppendLine($"DTSTAMP:{DateTime.UtcNow.ToString("yyyyMMddTHHmmssZ")}");

            // Start and end dates (using the clipped dates)
            icsBuilder.AppendLine($"DTSTART;VALUE=DATE:{eventStart.ToString("yyyyMMdd")}");
            icsBuilder.AppendLine($"DTEND;VALUE=DATE:{eventEnd.AddDays(1).ToString("yyyyMMdd")}");

            // Title and description
            string status = application?.Status?.Name ?? "Scheduled";
            string title = $"{course.Name} ({status})";
            
            string description = BuildEventDescription(course, application, startDate, endDate);

            icsBuilder.AppendLine($"SUMMARY:{EscapeIcsText(title)}");
            icsBuilder.AppendLine($"DESCRIPTION:{EscapeIcsText(description)}");
            icsBuilder.AppendLine($"LOCATION:{EscapeIcsText(course.TrainingCenter)}");

            // Add note if dates were clipped
            if (course.StartDate < startDate || course.EndDate > endDate)
            {
                icsBuilder.AppendLine($"COMMENT:{EscapeIcsText("Original dates: " + 
                    $"{course.StartDate:yyyy-MM-dd} to {course.EndDate:yyyy-MM-dd}")}");
            }

            // End event
            icsBuilder.AppendLine("END:VEVENT");
        }

        // End calendar
        icsBuilder.AppendLine("END:VCALENDAR");

        return icsBuilder.ToString();
    }

    private string BuildEventDescription(Course course, Application? application, 
        DateOnly rangeStart, DateOnly rangeEnd)
    {
        var description = new StringBuilder();
        
        description.AppendLine($"Название курса: {course.Name}");
        description.AppendLine($"Тип мероприятия: {GetRussianCourseType(course.Type)}");
        description.AppendLine($"Формат проведения: {course.Format}");
        
        if (course.StartDate < rangeStart || course.EndDate > rangeEnd)
        {
            description.AppendLine($"Displayed dates: {GetDisplayedDate(course.StartDate, rangeStart)} to " +
                                 $"{GetDisplayedDate(course.EndDate, rangeEnd)}");
        }
        
        if (!string.IsNullOrEmpty(course.EducationGoal))
            description.AppendLine($"Цель обучения: {course.EducationGoal}");

        return description.ToString();
    }

    private string GetDisplayedDate(DateOnly eventDate, DateOnly rangeDate)
    {
        return eventDate == rangeDate ? 
            eventDate.ToString("yyyy-MM-dd") : 
            $"{eventDate:yyyy-MM-dd} (clipped)";
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
}