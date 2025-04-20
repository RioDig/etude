using EtudeBackend.Features.Templates.Entities;
using EtudeBackend.Shared.Data.Repositories;

namespace EtudeBackend.Features.Templates.Repositories;

public interface IReportTemplateRepository : IRepository<ReportTemplate>
{
    Task<ReportTemplate?> GetByNameAsync(string name);
    Task<List<ReportTemplate>> GetByTemplateTypeAsync(string templateType);
}