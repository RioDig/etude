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

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
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
            var fileContent = await _reportService.DownloadReportAsync(id);
            return File(
                fileContent, 
                "text/plain",
                $"report-{id}.txt");
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
            var fileContent = await _reportService.GenerateReportAsync();
            return File(
                fileContent, 
                "text/plain",
                $"report-{DateTime.Now:yyyyMMdd}.txt");
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message });
        }
    }
}