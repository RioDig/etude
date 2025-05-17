using System.Text.Json.Serialization;

namespace EtudeBackend.Features.Auth.Models;

public class CreateDocumentModel
{
    [JsonPropertyName("EtudeDocID")]
    public string EtudeDocID { get; set; } = string.Empty;
    
    [JsonPropertyName("DocInfo")]
    public DocumentInfo DocInfo { get; set; } = new DocumentInfo();
    
    [JsonPropertyName("coordinating")]
    public Dictionary<string, string> Coordinating { get; set; } = new Dictionary<string, string>();
    
    [JsonPropertyName("isApproval")]
    public bool IsApproval { get; set; } = false;
}

public class DocumentInfo
{
    [JsonPropertyName("title")]
    public string Title { get; set; } = string.Empty;
    
    [JsonPropertyName("description")]
    public string Description { get; set; } = string.Empty;
    
    [JsonPropertyName("type")]
    public string Type { get; set; } = string.Empty;
    
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }
    
    [JsonPropertyName("additional_info")]
    public Dictionary<string, string>? AdditionalInfo { get; set; }
}

public class DocumentCreateResponse
{
    [JsonPropertyName("success")]
    public bool Success { get; set; }
    
    [JsonPropertyName("message")]
    public string Message { get; set; } = string.Empty;
    
    [JsonPropertyName("document_id")]
    public string? DocumentId { get; set; }
}

public class DocumentStatusResponse
{
    [JsonPropertyName("id")]
    public string Id { get; set; } = string.Empty;
    
    [JsonPropertyName("EtudeDocID")]
    public string EtudeDocID { get; set; } = string.Empty;
    
    [JsonPropertyName("isApproval")]
    public bool IsApproval { get; set; }
    
    [JsonPropertyName("coordinating")]
    public Dictionary<string, bool> CoordinationStatus { get; set; } = new Dictionary<string, bool>();
    
    [JsonPropertyName("created_at")]
    public DateTime CreatedAt { get; set; }
}

public class DocumentStatusCheckModel
{
    [JsonPropertyName("document_id")]
    public string DocumentId { get; set; } = string.Empty;
}