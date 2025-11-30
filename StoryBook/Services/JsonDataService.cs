using System.Text.Json;
using StoryBook.Models;

namespace StoryBook.Services;

/// <summary>
/// JSON 資料服務實作，處理 JSON 檔案讀取
/// </summary>
public class JsonDataService : IJsonDataService, IDisposable
{
    private readonly IWebHostEnvironment _environment;
    private readonly ILogger<JsonDataService> _logger;
    private readonly IConfiguration _configuration;
    private DinosaurData? _cachedDinosaurData;
    private AquariumAnimalData? _cachedAquariumData;
    private readonly SemaphoreSlim _loadSemaphore = new(1, 1);
    private DateTime _lastDinosaurLoadTime = DateTime.MinValue;
    private DateTime _lastAquariumLoadTime = DateTime.MinValue;
    private const int CacheExpirationMinutes = 60;
    private bool _disposed;

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
        _environment = environment ?? throw new ArgumentNullException(nameof(environment));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        _configuration = configuration ?? throw new ArgumentNullException(nameof(configuration));
    }

    /// <inheritdoc />
    public async Task<DinosaurData> LoadDinosaursAsync()
    {
        // 檢查快取是否有效
        if (IsDinosaurCacheValid())
        {
            return _cachedDinosaurData!;
        }

        await _loadSemaphore.WaitAsync();
        try
        {
            // 雙重檢查鎖定：在取得鎖定後再次檢查快取
            if (IsDinosaurCacheValid())
            {
                return _cachedDinosaurData!;
            }

            var jsonPath = GetJsonFilePath("DataFiles:DinosaursJson", "data/dinosaurs.json");
            var fullPath = BuildFullPath(jsonPath);

            _logger.LogInformation("載入恐龍資料：{Path}", fullPath);

            if (!File.Exists(fullPath))
            {
                _logger.LogWarning(
                    "恐龍資料檔案不存在：{Path}。將返回空資料集。請確認檔案路徑是否正確。",
                    fullPath);
                return CreateEmptyDinosaurDataWithWarning("檔案不存在");
            }

            return await LoadAndParseDinosaurJsonAsync(fullPath);
        }
        finally
        {
            _loadSemaphore.Release();
        }
    }

    /// <inheritdoc />
    public async Task<AquariumAnimalData> LoadAquariumAnimalsAsync()
    {
        // 檢查快取是否有效
        if (IsAquariumCacheValid())
        {
            return _cachedAquariumData!;
        }

        await _loadSemaphore.WaitAsync();
        try
        {
            // 雙重檢查鎖定：在取得鎖定後再次檢查快取
            if (IsAquariumCacheValid())
            {
                return _cachedAquariumData!;
            }

            var jsonPath = GetJsonFilePath("DataFiles:AquariumJson", "data/aquarium.json");
            var fullPath = BuildFullPath(jsonPath);

            _logger.LogInformation("載入水族館動物資料：{Path}", fullPath);

            if (!File.Exists(fullPath))
            {
                _logger.LogWarning(
                    "水族館動物資料檔案不存在：{Path}。將返回空資料集。請確認檔案路徑是否正確。",
                    fullPath);
                return CreateEmptyAquariumDataWithWarning("檔案不存在");
            }

            return await LoadAndParseAquariumJsonAsync(fullPath);
        }
        finally
        {
            _loadSemaphore.Release();
        }
    }

    /// <summary>
    /// 檢查恐龍快取是否有效
    /// </summary>
    /// <returns>快取是否有效</returns>
    private bool IsDinosaurCacheValid()
    {
        if (_cachedDinosaurData is null)
        {
            return false;
        }

        // 在開發環境中，快取時間更短以便即時看到變更
        var expirationMinutes = _environment.IsDevelopment() ? 1 : CacheExpirationMinutes;
        return DateTime.UtcNow - _lastDinosaurLoadTime < TimeSpan.FromMinutes(expirationMinutes);
    }

    /// <summary>
    /// 檢查水族館快取是否有效
    /// </summary>
    /// <returns>快取是否有效</returns>
    private bool IsAquariumCacheValid()
    {
        if (_cachedAquariumData is null)
        {
            return false;
        }

        // 在開發環境中，快取時間更短以便即時看到變更
        var expirationMinutes = _environment.IsDevelopment() ? 1 : CacheExpirationMinutes;
        return DateTime.UtcNow - _lastAquariumLoadTime < TimeSpan.FromMinutes(expirationMinutes);
    }

    /// <summary>
    /// 取得 JSON 檔案路徑設定
    /// </summary>
    /// <param name="configKey">設定鍵名</param>
    /// <param name="defaultPath">預設路徑</param>
    /// <returns>JSON 檔案相對路徑</returns>
    private string GetJsonFilePath(string configKey, string defaultPath)
    {
        var configPath = _configuration.GetValue<string>(configKey);

        if (string.IsNullOrWhiteSpace(configPath))
        {
            _logger.LogDebug("未設定 {ConfigKey}，使用預設路徑", configKey);
            return defaultPath;
        }

        return configPath;
    }

    /// <summary>
    /// 建構完整檔案路徑
    /// </summary>
    /// <param name="relativePath">相對路徑</param>
    /// <returns>完整路徑</returns>
    private string BuildFullPath(string relativePath)
    {
        if (string.IsNullOrWhiteSpace(_environment.WebRootPath))
        {
            _logger.LogError("WebRootPath 未設定，無法載入靜態資源");
            throw new InvalidOperationException("WebRootPath 未正確設定");
        }

        return Path.Combine(_environment.WebRootPath, relativePath);
    }

    /// <summary>
    /// 載入並解析恐龍 JSON 檔案
    /// </summary>
    /// <param name="fullPath">完整檔案路徑</param>
    /// <returns>恐龍資料</returns>
    private async Task<DinosaurData> LoadAndParseDinosaurJsonAsync(string fullPath)
    {
        try
        {
            var jsonContent = await File.ReadAllTextAsync(fullPath);

            if (string.IsNullOrWhiteSpace(jsonContent))
            {
                _logger.LogWarning("恐龍資料檔案為空：{Path}", fullPath);
                return CreateEmptyDinosaurDataWithWarning("檔案內容為空");
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                AllowTrailingCommas = true,
                ReadCommentHandling = JsonCommentHandling.Skip
            };

            var data = JsonSerializer.Deserialize<DinosaurData>(jsonContent, options);

            if (data is null)
            {
                _logger.LogWarning("無法解析恐龍資料 JSON，反序列化結果為 null");
                return CreateEmptyDinosaurDataWithWarning("JSON 解析失敗");
            }

            // 驗證資料完整性
            ValidateDinosaurData(data);

            _cachedDinosaurData = data;
            _lastDinosaurLoadTime = DateTime.UtcNow;

            _logger.LogInformation("成功載入 {Count} 隻恐龍", data.Dinosaurs.Count);

            return data;
        }
        catch (JsonException ex)
        {
            _logger.LogError(
                ex,
                "解析恐龍資料 JSON 時發生錯誤。檔案路徑：{Path}，錯誤位置：行 {Line}，位置 {Position}",
                fullPath,
                ex.LineNumber,
                ex.BytePositionInLine);
            return CreateEmptyDinosaurDataWithWarning("JSON 格式錯誤");
        }
        catch (IOException ex)
        {
            _logger.LogError(
                ex,
                "讀取恐龍資料檔案時發生 I/O 錯誤。檔案路徑：{Path}",
                fullPath);
            return CreateEmptyDinosaurDataWithWarning("檔案讀取錯誤");
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(
                ex,
                "無權限存取恐龍資料檔案。檔案路徑：{Path}",
                fullPath);
            return CreateEmptyDinosaurDataWithWarning("檔案存取權限不足");
        }
    }

    /// <summary>
    /// 載入並解析水族館動物 JSON 檔案
    /// </summary>
    /// <param name="fullPath">完整檔案路徑</param>
    /// <returns>水族館動物資料</returns>
    private async Task<AquariumAnimalData> LoadAndParseAquariumJsonAsync(string fullPath)
    {
        try
        {
            var jsonContent = await File.ReadAllTextAsync(fullPath);

            if (string.IsNullOrWhiteSpace(jsonContent))
            {
                _logger.LogWarning("水族館動物資料檔案為空：{Path}", fullPath);
                return CreateEmptyAquariumDataWithWarning("檔案內容為空");
            }

            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true,
                AllowTrailingCommas = true,
                ReadCommentHandling = JsonCommentHandling.Skip
            };

            // 先反序列化為中間格式，再轉換為強型別
            var rawData = JsonSerializer.Deserialize<JsonElement>(jsonContent, options);
            var data = ParseAquariumData(rawData);

            if (data is null)
            {
                _logger.LogWarning("無法解析水族館動物資料 JSON，反序列化結果為 null");
                return CreateEmptyAquariumDataWithWarning("JSON 解析失敗");
            }

            // 驗證資料完整性
            ValidateAquariumData(data);

            _cachedAquariumData = data;
            _lastAquariumLoadTime = DateTime.UtcNow;

            _logger.LogInformation("成功載入 {Count} 隻水族館動物", data.Animals.Count);

            return data;
        }
        catch (JsonException ex)
        {
            _logger.LogError(
                ex,
                "解析水族館動物資料 JSON 時發生錯誤。檔案路徑：{Path}，錯誤位置：行 {Line}，位置 {Position}",
                fullPath,
                ex.LineNumber,
                ex.BytePositionInLine);
            return CreateEmptyAquariumDataWithWarning("JSON 格式錯誤");
        }
        catch (IOException ex)
        {
            _logger.LogError(
                ex,
                "讀取水族館動物資料檔案時發生 I/O 錯誤。檔案路徑：{Path}",
                fullPath);
            return CreateEmptyAquariumDataWithWarning("檔案讀取錯誤");
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(
                ex,
                "無權限存取水族館動物資料檔案。檔案路徑：{Path}",
                fullPath);
            return CreateEmptyAquariumDataWithWarning("檔案存取權限不足");
        }
    }

    /// <summary>
    /// 解析水族館動物 JSON 資料
    /// </summary>
    /// <param name="rawData">原始 JSON 資料</param>
    /// <returns>水族館動物資料</returns>
    private AquariumAnimalData ParseAquariumData(JsonElement rawData)
    {
        var data = new AquariumAnimalData();

        if (!rawData.TryGetProperty("animals", out var animalsElement))
        {
            return data;
        }

        foreach (var animalElement in animalsElement.EnumerateArray())
        {
            var animal = ParseAquariumAnimal(animalElement);
            if (animal is not null)
            {
                data.Animals.Add(animal);
            }
        }

        return data;
    }

    /// <summary>
    /// 解析單隻水族館動物
    /// </summary>
    /// <param name="element">JSON 元素</param>
    /// <returns>水族館動物</returns>
    private AquariumAnimal? ParseAquariumAnimal(JsonElement element)
    {
        try
        {
            var id = element.GetProperty("id").GetString() ?? string.Empty;
            var habitatZoneStr = element.GetProperty("habitatZone").GetString() ?? "saltwater";

            return new AquariumAnimal
            {
                Id = id,
                Name = ParseLocalizedText(element.GetProperty("name")),
                HabitatZone = HabitatZoneExtensions.ParseHabitatZone(habitatZoneStr),
                Habitat = ParseLocalizedText(element.GetProperty("habitat")),
                Diet = ParseLocalizedText(element.GetProperty("diet")),
                Location = ParseLocalizedText(element.GetProperty("location")),
                Size = element.TryGetProperty("size", out var sizeElement) ? ParseLocalizedText(sizeElement) : null,
                Description = ParseLocalizedText(element.GetProperty("description")),
                Story = element.TryGetProperty("story", out var storyElement) ? ParseLocalizedText(storyElement) : null,
                Images = ParseAquariumAnimalImages(element.GetProperty("images"))
            };
        }
        catch (Exception ex)
        {
            _logger.LogWarning(ex, "解析水族館動物資料時發生錯誤");
            return null;
        }
    }

    /// <summary>
    /// 解析多語言文字
    /// </summary>
    /// <param name="element">JSON 元素</param>
    /// <returns>多語言文字</returns>
    private static LocalizedText ParseLocalizedText(JsonElement element)
    {
        return new LocalizedText
        {
            Zh = element.GetProperty("zh").GetString() ?? string.Empty,
            En = element.GetProperty("en").GetString() ?? string.Empty
        };
    }

    /// <summary>
    /// 解析水族館動物圖片資訊
    /// </summary>
    /// <param name="element">JSON 元素</param>
    /// <returns>水族館動物圖片資訊</returns>
    private static AquariumAnimalImages ParseAquariumAnimalImages(JsonElement element)
    {
        var images = new AquariumAnimalImages
        {
            Main = element.GetProperty("main").GetString() ?? string.Empty
        };

        if (element.TryGetProperty("story", out var storyElement))
        {
            foreach (var storyImage in storyElement.EnumerateArray())
            {
                var imagePath = storyImage.GetString();
                if (!string.IsNullOrEmpty(imagePath))
                {
                    images.Story.Add(imagePath);
                }
            }
        }

        return images;
    }

    /// <summary>
    /// 驗證載入的恐龍資料
    /// </summary>
    /// <param name="data">恐龍資料</param>
    private void ValidateDinosaurData(DinosaurData data)
    {
        if (data.Dinosaurs.Count == 0)
        {
            _logger.LogWarning("恐龍資料為空，沒有任何恐龍記錄");
            return;
        }

        var invalidDinosaurs = data.Dinosaurs
            .Where(d => string.IsNullOrWhiteSpace(d.Id) || d.Name is null)
            .ToList();

        if (invalidDinosaurs.Count > 0)
        {
            _logger.LogWarning(
                "發現 {Count} 筆無效的恐龍記錄（缺少 Id 或 Name）",
                invalidDinosaurs.Count);
        }
    }

    /// <summary>
    /// 驗證載入的水族館動物資料
    /// </summary>
    /// <param name="data">水族館動物資料</param>
    private void ValidateAquariumData(AquariumAnimalData data)
    {
        if (data.Animals.Count == 0)
        {
            _logger.LogWarning("水族館動物資料為空，沒有任何動物記錄");
            return;
        }

        var invalidAnimals = data.Animals
            .Where(a => string.IsNullOrWhiteSpace(a.Id) || a.Name is null)
            .ToList();

        if (invalidAnimals.Count > 0)
        {
            _logger.LogWarning(
                "發現 {Count} 筆無效的水族館動物記錄（缺少 Id 或 Name）",
                invalidAnimals.Count);
        }
    }

    /// <summary>
    /// 建立帶有警告的空恐龍資料集
    /// </summary>
    /// <param name="reason">警告原因</param>
    /// <returns>空的恐龍資料</returns>
    private DinosaurData CreateEmptyDinosaurDataWithWarning(string reason)
    {
        _logger.LogWarning("返回空的恐龍資料集。原因：{Reason}", reason);
        return new DinosaurData();
    }

    /// <summary>
    /// 建立帶有警告的空水族館動物資料集
    /// </summary>
    /// <param name="reason">警告原因</param>
    /// <returns>空的水族館動物資料</returns>
    private AquariumAnimalData CreateEmptyAquariumDataWithWarning(string reason)
    {
        _logger.LogWarning("返回空的水族館動物資料集。原因：{Reason}", reason);
        return new AquariumAnimalData();
    }

    /// <summary>
    /// 清除快取，強制下次載入時重新讀取檔案
    /// </summary>
    public async Task ClearCacheAsync()
    {
        await _loadSemaphore.WaitAsync();
        try
        {
            _cachedDinosaurData = null;
            _cachedAquariumData = null;
            _lastDinosaurLoadTime = DateTime.MinValue;
            _lastAquariumLoadTime = DateTime.MinValue;
        }
        finally
        {
            _loadSemaphore.Release();
        }
        _logger.LogInformation("資料快取已清除（恐龍與水族館動物）");
    }

    /// <summary>
    /// 釋放資源
    /// </summary>
    public void Dispose()
    {
        if (_disposed)
        {
            return;
        }

        _loadSemaphore.Dispose();
        _disposed = true;
        GC.SuppressFinalize(this);
    }
}
