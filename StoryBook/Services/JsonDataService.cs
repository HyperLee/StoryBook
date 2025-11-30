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
    private readonly SemaphoreSlim _loadSemaphore = new(1, 1);
    private DateTime _lastLoadTime = DateTime.MinValue;
    private const int CacheExpirationMinutes = 60;

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
        if (IsCacheValid())
        {
            return _cachedData!;
        }

        await _loadSemaphore.WaitAsync();
        try
        {
            // 雙重檢查鎖定：在取得鎖定後再次檢查快取
            if (IsCacheValid())
            {
                return _cachedData!;
            }

            var jsonPath = GetJsonFilePath();
            var fullPath = BuildFullPath(jsonPath);

            _logger.LogInformation("載入恐龍資料：{Path}", fullPath);

            if (!File.Exists(fullPath))
            {
                _logger.LogWarning(
                    "恐龍資料檔案不存在：{Path}。將返回空資料集。請確認檔案路徑是否正確。", 
                    fullPath);
                return CreateEmptyDataWithWarning("檔案不存在");
            }

            return await LoadAndParseJsonAsync(fullPath);
        }
        finally
        {
            _loadSemaphore.Release();
        }
    }

    /// <summary>
    /// 檢查快取是否有效
    /// </summary>
    /// <returns>快取是否有效</returns>
    private bool IsCacheValid()
    {
        if (_cachedData is null)
        {
            return false;
        }

        // 在開發環境中，快取時間更短以便即時看到變更
        var expirationMinutes = _environment.IsDevelopment() ? 1 : CacheExpirationMinutes;
        return DateTime.UtcNow - _lastLoadTime < TimeSpan.FromMinutes(expirationMinutes);
    }

    /// <summary>
    /// 取得 JSON 檔案路徑設定
    /// </summary>
    /// <returns>JSON 檔案相對路徑</returns>
    private string GetJsonFilePath()
    {
        var configPath = _configuration.GetValue<string>("DataFiles:DinosaursJson");
        
        if (string.IsNullOrWhiteSpace(configPath))
        {
            _logger.LogDebug("未設定 DataFiles:DinosaursJson，使用預設路徑");
            return "data/dinosaurs.json";
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
    /// 載入並解析 JSON 檔案
    /// </summary>
    /// <param name="fullPath">完整檔案路徑</param>
    /// <returns>恐龍資料</returns>
    private async Task<DinosaurData> LoadAndParseJsonAsync(string fullPath)
    {
        try
        {
            var jsonContent = await File.ReadAllTextAsync(fullPath);

            if (string.IsNullOrWhiteSpace(jsonContent))
            {
                _logger.LogWarning("恐龍資料檔案為空：{Path}", fullPath);
                return CreateEmptyDataWithWarning("檔案內容為空");
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
                return CreateEmptyDataWithWarning("JSON 解析失敗");
            }

            // 驗證資料完整性
            ValidateData(data);

            _cachedData = data;
            _lastLoadTime = DateTime.UtcNow;

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
            return CreateEmptyDataWithWarning("JSON 格式錯誤");
        }
        catch (IOException ex)
        {
            _logger.LogError(
                ex, 
                "讀取恐龍資料檔案時發生 I/O 錯誤。檔案路徑：{Path}",
                fullPath);
            return CreateEmptyDataWithWarning("檔案讀取錯誤");
        }
        catch (UnauthorizedAccessException ex)
        {
            _logger.LogError(
                ex, 
                "無權限存取恐龍資料檔案。檔案路徑：{Path}",
                fullPath);
            return CreateEmptyDataWithWarning("檔案存取權限不足");
        }
    }

    /// <summary>
    /// 驗證載入的資料
    /// </summary>
    /// <param name="data">恐龍資料</param>
    private void ValidateData(DinosaurData data)
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
    /// 建立帶有警告的空資料集
    /// </summary>
    /// <param name="reason">警告原因</param>
    /// <returns>空的恐龍資料</returns>
    private DinosaurData CreateEmptyDataWithWarning(string reason)
    {
        _logger.LogWarning("返回空的恐龍資料集。原因：{Reason}", reason);
        return new DinosaurData();
    }

    /// <summary>
    /// 清除快取，強制下次載入時重新讀取檔案
    /// </summary>
    public void ClearCache()
    {
        _loadSemaphore.Wait();
        try
        {
            _cachedData = null;
            _lastLoadTime = DateTime.MinValue;
        }
        finally
        {
            _loadSemaphore.Release();
        }
        _logger.LogInformation("恐龍資料快取已清除");
    }
}
