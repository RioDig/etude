using EtudeBackend.Features.Templates.Entities;
using EtudeBackend.Shared.Data;
using EtudeBackend.Shared.Data.Repositories;
using Microsoft.EntityFrameworkCore;

namespace EtudeBackend.Features.Templates.Repositories;

public class ReportTemplateRepository : Repository<ReportTemplate>, IReportTemplateRepository
{
    public ReportTemplateRepository(ApplicationDbContext context) : base(context)
    {
    }

    public async Task<ReportTemplate?> GetByNameAsync(string name)
    {
        return await _dbSet
            .FirstOrDefaultAsync(rt => rt.Name == name);
    }

    public async Task<List<ReportTemplate>> GetByTemplateTypeAsync(string templateType)
    {
        return await _dbSet
            .Where(rt => rt.TemplateType == templateType)
            .OrderByDescending(rt => rt.CreatedAt)
            .ToListAsync();
    }
}