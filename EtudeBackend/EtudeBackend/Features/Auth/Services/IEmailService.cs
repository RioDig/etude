namespace EtudeBackend.Features.Auth.Services;

public interface IEmailService
{
    Task SendEmailAsync(string emailTo, string message);
}