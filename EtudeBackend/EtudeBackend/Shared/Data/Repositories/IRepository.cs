using System.Linq.Expressions;

namespace EtudeBackend.Shared.Data.Repositories;

public interface IRepository<T> where T : class
{
    Task<List<T>> GetAllAsync();
    Task<List<T>> GetAsync(Expression<Func<T, bool>> predicate);
    Task<T?> GetByIdAsync(Guid id);
    Task<T> AddAsync(T entity);
    Task UpdateAsync(T entity);
    Task RemoveAsync(T entity);
    Task<bool> ExistsAsync(Expression<Func<T, bool>> predicate);
}