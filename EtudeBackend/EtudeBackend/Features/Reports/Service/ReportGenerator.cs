using ClosedXML.Excel;
using EtudeBackend.Shared.Models;

namespace EtudeBackend.Features.Reports.Service;

public static class ReportGenerator
{
    public static void GenerateCompletedTrainingsReport(List<TrainingItem> items, string filePath)
    {
        using var workbook = new XLWorkbook();
        var worksheet = workbook.Worksheets.Add("Отчет по завершенным обучениям");

        var headers = new[]
        {
            "Название мероприятия", "Описание", "Тип", "Направление", "Формат",
            "Учебный центр", "Начало", "Окончание", "Ссылка или место проведения", "Стоимость",
            "Цель обучения", "ФИО участника", "Должность участника", "Подразделение участника",
            "Дата создания заявления", "Согласующие"
        };
        
        for (int i = 0; i < headers.Length; i++)
        {
            var cell = worksheet.Cell(1, i + 1);
            cell.Value = headers[i];
            cell.Style.Font.Bold = true;
            cell.Style.Fill.BackgroundColor = XLColor.LightGray;
            cell.Style.Alignment.Horizontal = XLAlignmentHorizontalValues.Center;
            cell.Style.Alignment.Vertical = XLAlignmentVerticalValues.Center;
        }
        
        int row = 2;
        foreach (var item in items)
        {
            worksheet.Cell(row, 1).Value = item.Name;
            worksheet.Cell(row, 2).Value = item.Description;
            worksheet.Cell(row, 3).Value = FormatCourseType(item.Type);
            worksheet.Cell(row, 4).Value = FormatCourseTrack(item.Track);
            worksheet.Cell(row, 5).Value = FormatCourseFormat(item.Format);
            worksheet.Cell(row, 6).Value = item.TrainingCenter;

            worksheet.Cell(row, 7).Value = item.StartDate.ToDateTime(TimeOnly.MinValue);
            worksheet.Cell(row, 7).Style.DateFormat.Format = "dd.MM.yyyy";

            worksheet.Cell(row, 8).Value = item.EndDate.ToDateTime(TimeOnly.MinValue);
            worksheet.Cell(row, 8).Style.DateFormat.Format = "dd.MM.yyyy";

            worksheet.Cell(row, 9).Value = item.Link;
            worksheet.Cell(row, 10).Value = item.Price;
            worksheet.Cell(row, 11).Value = item.EducationGoal;

            if (item.Learner != null)
            {
                worksheet.Cell(row, 12).Value = $"{item.Learner.Surname} {item.Learner.Name} {item.Learner.Patronymic ?? ""}".Trim();
                worksheet.Cell(row, 13).Value = item.Learner.Position;
                worksheet.Cell(row, 14).Value = item.Learner.Department;
            }

            worksheet.Cell(row, 15).Value = item.CreatedAt.Date;
            worksheet.Cell(row, 15).Style.DateFormat.Format = "dd.MM.yyyy";

            if (item.Approvers != null && item.Approvers.Length > 0)
            {
                var approversText = string.Join(Environment.NewLine, item.Approvers.Select(a =>
                    $"{a.Surname} {a.Name} {a.Patronymic ?? ""} — {a.Position} ({a.Department})".Trim()));
                var cell = worksheet.Cell(row, 16);
                cell.Value = approversText;
                cell.Style.Alignment.WrapText = true;
            }

            row++;
        }

        // Форматирование таблицы
        worksheet.Columns().AdjustToContents();
        
        // Ограничиваем ширину колонок для лучшей читабельности
        foreach (var column in worksheet.Columns())
        {
            if (column.Width > 60)
                column.Width = 60;
        }
        
        // Устанавливаем автофильтр и границы
        var usedRange = worksheet.RangeUsed();
        if (usedRange != null)
        {
            usedRange.SetAutoFilter();
            usedRange.Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
            usedRange.Style.Border.InsideBorder = XLBorderStyleValues.Thin;
        }

        // Сохраняем файл
        workbook.SaveAs(filePath);
    }

    private static string FormatCourseType(Features.TrainingRequests.Entities.CourseType type)
    {
        return type switch
        {
            Features.TrainingRequests.Entities.CourseType.Course => "Курс",
            Features.TrainingRequests.Entities.CourseType.Conference => "Конференция",
            Features.TrainingRequests.Entities.CourseType.Certification => "Сертификация",
            Features.TrainingRequests.Entities.CourseType.Workshop => "Мастер-класс",
            _ => "Не определен"
        };
    }

    private static string FormatCourseTrack(Features.TrainingRequests.Entities.CourseTrack track)
    {
        return track switch
        {
            Features.TrainingRequests.Entities.CourseTrack.SoftSkills => "Soft Skills",
            Features.TrainingRequests.Entities.CourseTrack.HardSkills => "Hard Skills",
            Features.TrainingRequests.Entities.CourseTrack.ManagementSkills => "Management Skills",
            _ => "Не определено"
        };
    }

    private static string FormatCourseFormat(Features.TrainingRequests.Entities.CourseFormat format)
    {
        return format switch
        {
            Features.TrainingRequests.Entities.CourseFormat.Online => "Онлайн",
            Features.TrainingRequests.Entities.CourseFormat.Offline => "Офлайн",
            _ => "Не определен"
        };
    }
}