using System.Net;
using System.Net.Mail;

namespace EtudeBackend.Features.Auth.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;

    private readonly SmtpClient _smtpClient;
    
    public EmailService(IConfiguration configuration)
    {
        _configuration = configuration;
        var email = _configuration["EmailCredentials:Email"];
        var password = _configuration["EmailCredentials:Password"];
        _smtpClient = new SmtpClient("connect.smtp.bz", 2525);
        _smtpClient.Credentials = new NetworkCredential(email, password);
    }
    
    public async Task SendEmailAsync(string emailTo, string message)
    {
        var str = await File.ReadAllTextAsync("email_template.html");
        var tmp = str.Replace("{PASSWORD}", message);
        var msg = new MailMessage
        {
            Body = tmp,
            From = new MailAddress(_configuration["EmailCredentials:Email"]!),
            IsBodyHtml = true
        };
        msg.To.Add(new MailAddress(emailTo));
//        await _smtpClient.SendMailAsync(msg);
    }
}