using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using EtudeBackend.Features.Auth.Services;
using EtudeBackend.Features.TrainingRequests.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EtudeBackend.Features.TrainingRequests.Services;

public class DocumentApprovalService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<DocumentApprovalService> _logger;
    private readonly TimeSpan _checkInterval = TimeSpan.FromMinutes(5); // Проверка каждые 5 минут

    public DocumentApprovalService(
        IServiceScopeFactory scopeFactory,
        ILogger<DocumentApprovalService> logger)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Фоновая служба проверки документов запущена");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await CheckDocumentsAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при проверке статусов документов");
            }

            await Task.Delay(_checkInterval, stoppingToken);
        }

        _logger.LogInformation("Фоновая служба проверки документов остановлена");
    }

    private async Task CheckDocumentsAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Начинаем проверку статусов документов в EtudeAuth");

        using var scope = _scopeFactory.CreateScope();
        var statusRepository = scope.ServiceProvider.GetRequiredService<IStatusRepository>();
        var applicationRepository = scope.ServiceProvider.GetRequiredService<IApplicationRepository>();
        var etudeAuthApiService = scope.ServiceProvider.GetRequiredService<EtudeAuthApiService>();

        try
        {
            // Получаем статус "Approvement"
            var approvementStatus = await statusRepository.GetByTypeAsync("Approvement");
            if (approvementStatus == null)
            {
                _logger.LogWarning("Статус 'Approvement' не найден в системе");
                return;
            }

            // Получаем статус "Processed" для последующего изменения
            var processedStatus = await statusRepository.GetByTypeAsync("Processed");
            if (processedStatus == null)
            {
                _logger.LogWarning("Статус 'Processed' не найден в системе");
                return;
            }

            // Получаем все заявки со статусом "Approvement"
            var applications = await applicationRepository.GetByStatusIdAsync(approvementStatus.Id);
            _logger.LogInformation("Найдено {Count} заявок со статусом 'Approvement'", applications.Count);

            foreach (var application in applications)
            {
                if (stoppingToken.IsCancellationRequested)
                    break;

                try
                {
                    // Проверяем статус согласования в EtudeAuth
                    var docStatus = await etudeAuthApiService.GetDocumentStatusAsync(application.SoloDocId.ToString());

                    if (docStatus?.IsApproval == true)
                    {
                        _logger.LogInformation("Документ {DocId} согласован в EtudeAuth, обновляем статус на Processed",
                            application.SoloDocId);

                        // Меняем статус заявки на "Processed"
                        application.StatusId = processedStatus.Id;

                        // Добавляем запись в историю
                        var historyEntry = new
                        {
                            Date = DateTimeOffset.UtcNow,
                            StatusId = processedStatus.Id,
                            StatusName = processedStatus.Name,
                            Comment = "Автоматическое изменение статуса: документ согласован в системе EtudeAuth"
                        };

                        string historyJson = System.Text.Json.JsonSerializer.Serialize(historyEntry);
                        application.ApprovalHistory += (string.IsNullOrEmpty(application.ApprovalHistory) ? "" : "\n") + historyJson;

                        application.UpdatedAt = DateTimeOffset.UtcNow;
                        await applicationRepository.UpdateAsync(application);

                        _logger.LogInformation("Статус заявки {AppId} успешно обновлен на 'Processed'",
                            application.Id);
                    }
                    else if (docStatus != null && !docStatus.IsApproval)
                    {
                        _logger.LogDebug("Документ {DocId} ещё на согласовании в EtudeAuth. Статус согласования: {IsApproval}",
                            application.SoloDocId, docStatus.IsApproval);

                        if (docStatus.CoordinationStatus != null && docStatus.CoordinationStatus.Count > 0)
                        {
                            _logger.LogDebug("Детали согласования: {StatusDetails}",
                                string.Join(", ", docStatus.CoordinationStatus.Select(kv => $"{kv.Key}: {kv.Value}")));
                        }
                    }
                    else
                    {
                        _logger.LogWarning("Не удалось получить статус документа {DocId} из EtudeAuth",
                            application.SoloDocId);
                    }
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Ошибка при проверке статуса документа {DocId} в EtudeAuth",
                        application.SoloDocId);
                }
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при проверке статусов документов");
        }

        _logger.LogInformation("Проверка статусов документов завершена");
    }
}