using System.Text.Json;
using StoryBook.Models;

namespace StoryBook.Services;

/// <summary>
/// JSON 資料服務實作，處理 JSON 檔案讀取
/// </summary>
public class JsonDataService : IJsonDataService
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<JsonDataService> _logger;
    private readonly IConfiguration _configuration;
    private DinosaurData? _cachedData;
    private readonly object _cacheLock = new();

    /// <summary>
    /// 建立 JsonDataService 實例
    /// </summary>
    /// <param name="environment">網站環境</param>
    /// <param name="logger">日誌服務</param>
    /// <param name="configuration">設定服務</param>
    public JsonDataService(
        IWebHostEnvironment environment,
        ILogger<JsonDataService> logger,
        IConfiguration configuration)
    {
        _environment = environment;
        _logger = logger;
        _configuration = configuration;
    }

    /// <inheritdoc />
    public async Task<DinosaurData> LoadDinosaursAsync()
    {
        // 使用快取避免重複讀取
        if (_cachedData is not null)
        {
            return _cachedData;
        }

        lock (_cacheLock)
        {
            if (_cachedData is not null)
            {
                return _cachedData;
            }
        }

        var jsonPath = _configuration.GetValue<string>("DataFiles:DinosaursJson")
            ?? "data/dinosaurs.json";

        var fullPath = Path.Combine(_environment.WebRootPath, jsonPath);

        _logger.LogInformation("載入恐龍資料：{Path}", fullPath);

        if (!File.Exists(fullPath))
        {
            _logger.LogWarning("恐龍資料檔案不存在：{Path}", fullPath);
            return new DinosaurData();
        }

        try
        {
            var jsonContent = await File.ReadAllTextAsync(fullPath);

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var data = JsonSerializer.Deserialize<DinosaurData>(jsonContent, options);

            if (data is null)
            {
                _logger.LogWarning("無法解析恐龍資料 JSON");
                return new DinosaurData();
            }

            lock (_cacheLock)
            {
                _cachedData = data;
            }

            _logger.LogInformation("成功載入 {Count} 隻恐龍", data.Dinosaurs.Count);

            return data;
        }
        catch (JsonException ex)
        {
            _logger.LogError(ex, "解析恐龍資料 JSON 時發生錯誤");
            return new DinosaurData();
        }
        catch (IOException ex)
        {
            _logger.LogError(ex, "讀取恐龍資料檔案時發生錯誤");
            return new DinosaurData();
        }
    }
}
