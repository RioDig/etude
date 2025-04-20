using Microsoft.Extensions.Caching.Distributed;
using Newtonsoft.Json;
using Formatting = System.Xml.Formatting;

namespace EtudeBackend.Shared.Extensions;

public static class CacheExtensions
{
    public static async Task<T?> GetValue<T>(this IDistributedCache cache, string key, CancellationToken ct,
        ILogger? logger = default)
    {
        try
        {
            var value = await cache.GetStringAsync(key, ct);
            await cache.RefreshAsync(key, ct);
            if (string.IsNullOrEmpty(value))
            {
                return default;
            }

            logger?.LogInformation("Значение {Key} получено из кэша", key);
            logger?.LogDebug("Значение {Key}: {Value}", key, value);
            if (typeof(T) == typeof(string) && value is T val)
            {
                return val;
            }

            var obj = JsonConvert.DeserializeObject<T>(value);
            return obj;
        }
        catch (Exception e)
        {
            logger?.LogError(e, "Ошибка при получении значения из кэша по ключу {Key}", key);
        }

        return default;
    }

    public static async Task SetValue<T>(this IDistributedCache cache, string key, T value, uint minutesLifeTime,
        CancellationToken ct, ILogger? logger = default)
    {
        try
        {
            if (value is null)
            {
                logger?.LogError("Вставляемая значение по ключу {Key} - null", key);
                return;
            }

            if (typeof(T) != typeof(string))
            {
                await cache.SetStringAsync(key,
                    JsonConvert.SerializeObject(value, (Newtonsoft.Json.Formatting)Formatting.None),
                    new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(minutesLifeTime)
                    },
                    ct);
            }
            else
            {
                if (string.IsNullOrEmpty(value.ToString()))
                {
                    logger?.LogError("Вставляемая строка по ключу {Key} пустая", key);
                    return;
                }

                await cache.SetStringAsync(key, value.ToString()!,
                    new DistributedCacheEntryOptions
                    {
                        AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(minutesLifeTime)
                    }, ct);
            }
        }
        catch (Exception e)
        {
            logger?.LogError(e, "Ошибка при вставке значения {Value} по ключу {Key}", value, key);
        }
    }
}
