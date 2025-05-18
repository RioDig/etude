using System.Text.Json;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace EtudeBackend.Shared.ModelBinders;

public class JsonQueryModelBinder : IModelBinder
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
            // Возвращаем пустое значение, если параметр не указан
            return Task.CompletedTask;
        }

        string jsonValue = valueProviderResult.FirstValue;

        try
        {
            // Десериализуем JSON в нужный тип
            var result = JsonSerializer.Deserialize(jsonValue, bindingContext.ModelType,
                new JsonSerializerOptions
                {
                    PropertyNameCaseInsensitive = true
                });

            bindingContext.Result = ModelBindingResult.Success(result);
        }
        catch (JsonException ex)
        {
            bindingContext.ModelState.AddModelError(bindingContext.ModelName, $"Ошибка десериализации JSON: {ex.Message}");
        }

        return Task.CompletedTask;
    }
}