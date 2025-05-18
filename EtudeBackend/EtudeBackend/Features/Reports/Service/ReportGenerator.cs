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
            "Учебный центр", "Начало", "Окончание", "Ссылка или место проведения",
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

        worksheet.Column(3).Width = 300;

        int row = 2;
        foreach (var item in items)
        {
            worksheet.Cell(row, 1).Value = item.Name;
            worksheet.Cell(row, 2).Value = item.Description;
            worksheet.Cell(row, 3).Value = FormatEnum(item.Type);
            worksheet.Cell(row, 4).Value = FormatEnum(item.Track);
            worksheet.Cell(row, 5).Value = FormatEnum(item.Format);
            worksheet.Cell(row, 6).Value = item.TrainingCenter;

            worksheet.Cell(row, 7).Value = item.StartDate.ToDateTime(TimeOnly.MinValue);
            worksheet.Cell(row, 7).Style.DateFormat.Format = "dd.MM.yyyy";

            worksheet.Cell(row, 8).Value = item.EndDate.ToDateTime(TimeOnly.MinValue);
            worksheet.Cell(row, 8).Style.DateFormat.Format = "dd.MM.yyyy";

            worksheet.Cell(row, 9).Value = item.Link;
            worksheet.Cell(row, 10).Value = item.EducationGoal;

            if (item.Learner != null)
            {
                worksheet.Cell(row, 11).Value = $"{item.Learner.Surname} {item.Learner.Name} {item.Learner.Patronymic ?? ""}".Trim();
                worksheet.Cell(row, 12).Value = item.Learner.Position;
                worksheet.Cell(row, 13).Value = item.Learner.Department;
            }

            worksheet.Cell(row, 14).Value = item.CreatedAt.Date;
            worksheet.Cell(row, 14).Style.DateFormat.Format = "dd.MM.yyyy";

            if (item.Approvers is { Length: > 0 })
            {
                var approversText = string.Join(Environment.NewLine, item.Approvers.Select(a =>
                    $"{a.Surname} {a.Name} {a.Patronymic ?? ""} — {a.Position} {a.Department}".Trim()));
                var cell = worksheet.Cell(row, 15);
                cell.Value = approversText;
                cell.Style.Alignment.WrapText = true;
            }

            row++;
        }

        worksheet.Columns().AdjustToContents();
        worksheet.RangeUsed().SetAutoFilter();
        worksheet.RangeUsed().Style.Border.OutsideBorder = XLBorderStyleValues.Thin;
        worksheet.RangeUsed().Style.Border.InsideBorder = XLBorderStyleValues.Thin;

        workbook.SaveAs(filePath);
    }

    private static string FormatEnum<T>(T value) where T : Enum
    {
        return value.ToString() switch
        {
            "Training" => "Курс",
            "Conference" => "Конференция",
            "Certification" => "Сертификация",
            "Workshop" => "Мастер-класс",
            "Soft" => "Soft",
            "Hard" => "Hard",
            "Management" => "Management",
            "Online" => "Онлайн",
            "Offline" => "Оффлайн",
            _ => ""
        };
    }
}