using EtudeBackend.Features.TrainingRequests.Entities;
using EtudeBackend.Shared.Models;

namespace EtudeBackend.Data;

public static class MockData
{
    public static List<TrainingItem> GetSampleTrainings() =>
        new List<TrainingItem>
        {
            new TrainingItem
            {
                CreatedAt = DateTimeOffset.Now.AddDays(-15),
                Name = "Курс по безопасности",
                Description = "Обязательное обучение по информационной безопасности",
                Type = CourseType.Certification,
                Track = CourseTrack.HardSkills,
                Format = CourseFormat.Online,
                TrainingCenter = "Учебный центр А",
                StartDate = new DateOnly(2024, 4, 10),
                EndDate = new DateOnly(2024, 4, 12),
                Link = "https://training-center.kz/safe-course",
                Price = "0",
                EducationGoal = "Повышение осведомленности",
                Learner = new User
                {
                    Surname = "Иванов",
                    Name = "Иван",
                    Patronymic = "Иванович",
                    Position = "Инженер",
                    Department = "ИТ"
                },
                Approvers = new[]
                {
                    new User
                    {
                        Surname = "Петров",
                        Name = "Петр",
                        Patronymic = "Петрович",
                        Position = "Руководитель группы",
                        Department = "ИТ"
                    },
                    new User
                    {
                        Surname = "Сидоров",
                        Name = "Сидор",
                        Patronymic = null,
                        Position = "Начальник отдела",
                        Department = "Кадры"
                    }
                }
            },
            new TrainingItem
            {
                CreatedAt = DateTimeOffset.Now.AddDays(-40),
                Name = "Конференция DevFest",
                Description = "Международная конференция для разработчиков",
                Type = CourseType.Conference,
                Track = CourseTrack.SoftSkills,
                Format = CourseFormat.Offline,
                TrainingCenter = "Almaty IT Hub",
                StartDate = new DateOnly(2024, 3, 1),
                EndDate = new DateOnly(2024, 3, 3),
                Link = "г. Алматы, ул. Разработчиков, 25",
                Price = "50000",
                EducationGoal = "Networking и новые знания",
                Learner = new User
                {
                    Surname = "Смирнова",
                    Name = "Анна",
                    Patronymic = "Олеговна",
                    Position = "Разработчик",
                    Department = "Мобильная разработка"
                },
                Approvers = new[]
                {
                    new User
                    {
                        Surname = "Лебедев",
                        Name = "Алексей",
                        Patronymic = "Сергеевич",
                        Position = "Тимлид",
                        Department = "Мобильная разработка"
                    }
                }
            },
            new TrainingItem
            {
                CreatedAt = DateTimeOffset.Now.AddDays(-5),
                Name = "Сертификация PMP",
                Description = "Получение международной сертификации",
                Type = CourseType.Certification,
                Track = CourseTrack.ManagementSkills,
                Format = CourseFormat.Online,
                TrainingCenter = "PMI Institute",
                StartDate = new DateOnly(2024, 5, 5),
                EndDate = new DateOnly(2024, 5, 10),
                Link = "https://pmi.org/certification",
                Price = "120000",
                EducationGoal = "Формализация знаний и карьерный рост",
                Learner = new User
                {
                    Surname = "Каримов",
                    Name = "Бахыт",
                    Patronymic = "Ермекович",
                    Position = "Project Manager",
                    Department = "Управление проектами"
                },
                Approvers = new User[0] // без согласующих
            }
        };
}