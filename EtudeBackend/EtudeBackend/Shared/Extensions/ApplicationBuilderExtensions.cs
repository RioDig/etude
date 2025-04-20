using EtudeBackend.Shared.Data;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Shared.Extensions;

public static class ApplicationBuilderExtensions
{
    public static IApplicationBuilder ApplyMigrations(this IApplicationBuilder app)
    {
        using var scope = app.ApplicationServices.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
        dbContext.Database.Migrate();

        return app;
    }
}