using System.Text.Json.Serialization;
using System.ComponentModel;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace EtudeBackend.Features.TrainingRequests.Models;

public class JsonFiltersAttribute : ModelBinderAttribute
{
    public JsonFiltersAttribute() : base(typeof(JsonFiltersBinder))
    {
    }
}

public class FilterItem
{
    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;
    
    [JsonPropertyName("value")]
    public string Value { get; set; } = string.Empty;
}

public class JsonFiltersBinder : IModelBinder
{
    public Task BindModelAsync(ModelBindingContext bindingContext)
    {
        if (bindingContext == null)
        {
            throw new ArgumentNullException(nameof(bindingContext));
        }

        var valueProviderResult = bindingContext.ValueProvider.GetValue(bindingContext.ModelName);

        if (valueProviderResult == ValueProviderResult.None || string.IsNullOrEmpty(valueProviderResult.FirstValue))
        {
            return Task.CompletedTask; // Фильтры отсутствуют, возвращаем пустую модель
        }

        string jsonValue = valueProviderResult.FirstValue;
        
        try
        {
            var filters = System.Text.Json.JsonSerializer.Deserialize<List<FilterItem>>(jsonValue, 
                new System.Text.Json.JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            bindingContext.Result = ModelBindingResult.Success(filters);
        }
        catch (System.Text.Json.JsonException)
        {
            bindingContext.ModelState.AddModelError(bindingContext.ModelName, "Некорректный формат JSON для фильтров");
        }

        return Task.CompletedTask;
    }
}