using System.ComponentModel.DataAnnotations.Schema;
using EtudeBackend.Features.TrainingRequests.Entities;

namespace EtudeBackend.Features.Templates.Entities;

public class CourseTemplate
{
    public Guid Id { get; set; } = Guid.NewGuid();
    
    public string Name { get; set; } = string.Empty;
    
    [Column(TypeName = "text")]
    public string Description { get; set; } = string.Empty;
    
    public CourseType Type { get; set; } = CourseType.NotImplemented;
    
    public CourseTrack Track { get; set; } = CourseTrack.NotImplemented;
    
    public CourseFormat Format { get; set; } = CourseFormat.NotImplemented;
    
    public string TrainingCenter { get; set; } = string.Empty;
    
    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    
    [Column(TypeName = "timestamp with time zone")]
    public DateTimeOffset? UpdatedAt { get; set; }
}