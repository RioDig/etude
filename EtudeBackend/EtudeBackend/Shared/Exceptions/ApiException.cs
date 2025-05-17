namespace EtudeBackend.Shared.Exceptions;

public class ApiException : Exception
{
    public int StatusCode { get; }
    public Dictionary<string, string[]>? Errors { get; }

    public ApiException(string message, int statusCode = 500, Dictionary<string, string[]>? errors = null)
        : base(message)
    {
        StatusCode = statusCode;
        Errors = errors;
    }
}
