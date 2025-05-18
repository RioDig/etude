using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.AspNetCore.Mvc.ModelBinding.Binders;
using System.Diagnostics.CodeAnalysis;

namespace EtudeBackend.Shared.ModelBinders;

public class JsonQueryBinderProvider : IModelBinderProvider
{
    public IModelBinder? GetBinder(ModelBinderProviderContext context)
    {
        if (context == null)
        {
            throw new ArgumentNullException(nameof(context));
        }

        // Ищем атрибут JsonQuery на параметре
        if (context.Metadata.ModelType.IsGenericType &&
            context.Metadata.ModelType.GetGenericTypeDefinition() == typeof(List<>) &&
            context.BindingInfo?.BinderType?.Name == "JsonFiltersBinder")
        {
            return new JsonQueryModelBinder();
        }

        return null;
    }
}