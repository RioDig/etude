using EtudeBackend.Features.Reports.DTOs;
using EtudeBackend.Features.Reports.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.Reports.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;
    private readonly ILogger<ReportController> _logger;

    public ReportController(IReportService reportService, ILogger<ReportController> logger)
    {
        _reportService = reportService;
        _logger = logger;
    }

    /// <summary>
    /// Получает список всех отчетов с возможностью фильтрации
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<ReportInfoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetReports([FromQuery] string? filters = null)
    {
        try
        {
            List<ReportFilterDto>? filterDtos = null;
        
            if (!string.IsNullOrEmpty(filters))
            {
                try
                {
                    filterDtos = System.Text.Json.JsonSerializer.Deserialize<List<ReportFilterDto>>(filters);
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при десериализации фильтров: {Filters}", filters);
                    return BadRequest(new { message = "Неверный формат фильтров" });
                }
            }
        
            var reports = await _reportService.GetAllReportsAsync(filterDtos);
            return Ok(reports);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при получении списка отчетов");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Произошла внутренняя ошибка сервера при получении отчетов" });
        }
    }

    /// <summary>
    /// Скачивает готовый отчет
    /// </summary>
    [HttpGet("download")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> DownloadReport([FromQuery] Guid id)
    {
        try
        {
            var fileContent = await _reportService.DownloadReportAsync(id);
            
            // Получаем информацию об отчете
            var report = await _reportService.GetAllReportsAsync(new List<ReportFilterDto> 
            { 
                new ReportFilterDto { Name = "id", Value = id.ToString() } 
            });
            
            var reportInfo = report.FirstOrDefault();
            string fileName = reportInfo != null 
                ? $"отчет_{reportInfo.ReportType}_{reportInfo.ReportCreateDate:yyyyMMdd}.xlsx"
                : $"отчет_{id}.xlsx";
            
            return File(
                fileContent,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName);
        }
        catch (KeyNotFoundException ex)
        {
            _logger.LogWarning(ex, "Отчет не найден: {Message}", ex.Message);
            return NotFound(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при скачивании отчета");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Произошла внутренняя ошибка сервера при скачивании отчета" });
        }
    }

    /// <summary>
    /// Генерирует новый отчет по завершенным обучениям
    /// </summary>
    [HttpGet("generate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateReport()
    {
        try
        {
            var fileContent = await _reportService.GenerateReportAsync();
            
            return File(
                fileContent,
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                $"отчет_по_обучениям_{DateTime.Now:yyyyMMdd}.xlsx");
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogWarning(ex, "Ошибка при генерации отчета: {Message}", ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при генерации отчета");
            return StatusCode(StatusCodes.Status500InternalServerError, 
                new { message = "Произошла внутренняя ошибка сервера при генерации отчета" });
        }
    }
}