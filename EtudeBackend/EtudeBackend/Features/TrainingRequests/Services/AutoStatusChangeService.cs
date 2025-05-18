using EtudeBackend.Features.TrainingRequests.Repositories;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace EtudeBackend.Features.TrainingRequests.Services;

public class AutoStatusChangeService : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly ILogger<AutoStatusChangeService> _logger;
    private readonly TimeSpan _interval;

    public AutoStatusChangeService(
        IServiceScopeFactory scopeFactory,
        ILogger<AutoStatusChangeService> logger,
        TimeSpan? interval = null)
    {
        _scopeFactory = scopeFactory;
        _logger = logger;
        _interval = interval ?? TimeSpan.FromSeconds(30);
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("Служба автоматического изменения статусов запущена с интервалом {Interval} секунд",
            _interval.TotalSeconds);

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                await ProcessStatusChangesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при автоматическом изменении статусов заявок");
            }

            await Task.Delay(_interval, stoppingToken);
        }

        _logger.LogInformation("Служба автоматического изменения статусов остановлена");
    }

    private async Task ProcessStatusChangesAsync(CancellationToken stoppingToken)
    {
        _logger.LogDebug("Начинаем проверку заявок на изменение статуса");

        using var scope = _scopeFactory.CreateScope();
        var statusRepository = scope.ServiceProvider.GetRequiredService<IStatusRepository>();
        var applicationRepository = scope.ServiceProvider.GetRequiredService<IApplicationRepository>();

        try
        {
            // Получаем статус "Approvement"
            var approvementStatus = await statusRepository.GetByTypeAsync("Approvement");
            if (approvementStatus == null)
            {
                _logger.LogWarning("Статус 'Approvement' не найден в системе");
                return;
            }

            // Получаем статус "Processed" для изменения
            var processedStatus = await statusRepository.GetByTypeAsync("Processed");
            if (processedStatus == null)
            {
                _logger.LogWarning("Статус 'Processed' не найден в системе");
                return;
            }

            // Получаем все заявки со статусом "Approvement"
            var applications = await applicationRepository.GetByStatusIdAsync(approvementStatus.Id);
            _logger.LogInformation("Найдено {Count} заявок со статусом 'Approvement'", applications.Count);

            int changedCount = 0;
            foreach (var application in applications)
            {
                if (stoppingToken.IsCancellationRequested)
                    break;

                // Меняем статус заявки на "Processed"
                application.StatusId = processedStatus.Id;

                // Добавляем запись в историю
                var historyEntry = new
                {
                    Date = DateTimeOffset.UtcNow,
                    StatusId = processedStatus.Id,
                    StatusName = processedStatus.Name,
                    Comment = "Согласование сотрудниками в Соло успешно"
                };

                string historyJson = System.Text.Json.JsonSerializer.Serialize(historyEntry);
                application.ApprovalHistory += (string.IsNullOrEmpty(application.ApprovalHistory) ? "" : "\n") + historyJson;

                application.UpdatedAt = DateTimeOffset.UtcNow;
                await applicationRepository.UpdateAsync(application);

                changedCount++;
                _logger.LogInformation("Статус заявки {AppId} изменен с 'Approvement' на 'Processed'",
                    application.Id);
            }

            if (changedCount > 0)
            {
                _logger.LogInformation("Всего изменено статусов: {Count}", changedCount);
            }
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Ошибка при обработке изменения статусов");
            throw;
        }

        _logger.LogDebug("Проверка заявок на изменение статуса завершена");
    }
}