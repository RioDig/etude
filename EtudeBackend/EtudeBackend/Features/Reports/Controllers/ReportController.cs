using EtudeBackend.Features.Reports.DTOs;
using EtudeBackend.Features.Reports.Services;
using Microsoft.AspNetCore.Mvc;

namespace EtudeBackend.Features.Reports.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReportController : ControllerBase
{
    private readonly IReportService _reportService;

    public ReportController(IReportService reportService)
    {
        _reportService = reportService;
    }
    
    /// <summary>
    /// Получает список всех доступных отчетов
    /// </summary>
    [HttpGet]
    [ProducesResponseType(StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAllReports()
    {
        var reports = await _reportService.GetAllReportsAsync();
        return Ok(reports);
    }
    
    /// <summary>
    /// Выполняет отчет и возвращает файл XLSX
    /// </summary>
    [HttpGet("execute")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> ExecuteReport([FromQuery] Guid id)
    {
        var reportResult = await _reportService.ExecuteReportAsync(id);
        
        if (reportResult == null)
            return NotFound();
            
        // Возвращаем файл XLSX
        return File(
            reportResult.FileContent, 
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            reportResult.FileName);
    }
}