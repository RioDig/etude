using EtudeBackend.Data;
using EtudeBackend.Features.Reports.DTOs;
using EtudeBackend.Features.Reports.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.Reports.Controllers;

[ApiController]
[Route("api/[controller]")]

public class ReportController : ControllerBase
{
    private readonly IWebHostEnvironment _env;
    
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService, IWebHostEnvironment env)
    {
        _reportService = reportService;
        _env = env;
    }

    /// <summary>
    /// Получает список всех отчетов с возможностью фильтрации
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(List<ReportInfoDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetReports([FromQuery] List<ReportFilterDto>? filter = null)
    {
        var reports = await _reportService.GetAllReportsAsync(filter);
        return Ok(reports);
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
            // var fileContent = await _reportService.DownloadReportAsync(id);
            // return File(
            //     fileContent,
            //     "text/plain",
            //     $"report-{id}.txt");
            
            var fileName = $"{id}.xlsx";
            var fullPath = Path.Combine(_env.WebRootPath, "reports", fileName);

            if (!System.IO.File.Exists(fullPath))
                return NotFound("Файл не найден");

            return File(System.IO.File.ReadAllBytes(fullPath),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName);
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { message = ex.Message });
        }
    }

    /// <summary>
    /// Генерирует новый отчет
    /// </summary>
    [HttpGet("generate")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> GenerateReport()
    {
        try
        {
            // var fileContent = await _reportService.GenerateReportAsync();
            // return File(
            //     fileContent,
            //     "text/plain",
            //     $"report-{DateTime.Now:yyyyMMdd}.txt");
            
            var trainings = MockData.GetSampleTrainings();
            var fileName = $"{Guid.NewGuid()}.xlsx";
            var savePath = Path.Combine(_env.WebRootPath, "reports");

            if (!Directory.Exists(savePath))
                Directory.CreateDirectory(savePath);

            var fullPath = Path.Combine(savePath, fileName);
            ReportGenerator.GenerateCompletedTrainingsReport(trainings, fullPath);

            return File(System.IO.File.ReadAllBytes(fullPath),
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                fileName);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}