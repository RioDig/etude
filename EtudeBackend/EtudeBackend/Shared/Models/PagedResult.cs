namespace EtudeBackend.Shared.Models;

public class PagedResult<T>
{
    public IEnumerable<T> Items { get; }
    public int TotalCount { get; }
    public int PageCount { get; }
    public int CurrentPage { get; }
    public int PageSize { get; }

    public PagedResult(IEnumerable<T> items, int totalCount, int currentPage, int pageSize)
    {
        Items = items;
        TotalCount = totalCount;
        CurrentPage = currentPage;
        PageSize = pageSize;
        PageCount = (int)Math.Ceiling(totalCount / (double)pageSize);
    }
}