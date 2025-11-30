using StoryBook.Models;

namespace StoryBook.Services;

/// <summary>
/// 恐龍服務實作，提供恐龍資料存取
/// </summary>
public class DinosaurService : IDinosaurService
{
    private readonly IJsonDataService _jsonDataService;
    private readonly ILogger<DinosaurService> _logger;

    /// <summary>
    /// 建立 DinosaurService 實例
    /// </summary>
    /// <param name="jsonDataService">JSON 資料服務</param>
    /// <param name="logger">日誌服務</param>
    public DinosaurService(
        IJsonDataService jsonDataService,
        ILogger<DinosaurService> logger)
    {
        _jsonDataService = jsonDataService;
        _logger = logger;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<Dinosaur>> GetAllAsync()
    {
        var data = await _jsonDataService.LoadDinosaursAsync();
        return data.Dinosaurs;
    }

    /// <inheritdoc />
    public async Task<Dinosaur?> GetByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            _logger.LogWarning("搜尋恐龍時 ID 為空");
            return null;
        }

        var data = await _jsonDataService.LoadDinosaursAsync();
        var dinosaur = data.Dinosaurs.FirstOrDefault(d =>
            d.Id.Equals(id, StringComparison.OrdinalIgnoreCase));

        if (dinosaur is null)
        {
            _logger.LogDebug("找不到 ID 為 {Id} 的恐龍", id);
        }

        return dinosaur;
    }

    /// <inheritdoc />
    public async Task<IEnumerable<Dinosaur>> SearchAsync(string keyword, string language)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            return await GetAllAsync();
        }

        var data = await _jsonDataService.LoadDinosaursAsync();
        var searchTerm = keyword.Trim().ToLowerInvariant();
        var isEnglish = language?.ToLowerInvariant() == "en";

        _logger.LogDebug("搜尋恐龍：關鍵字={Keyword}，語言={Language}", keyword, language);

        return data.Dinosaurs.Where(d =>
        {
            var name = isEnglish ? d.Name.En : d.Name.Zh;
            var description = isEnglish ? d.Description.En : d.Description.Zh;
            var period = isEnglish ? d.Period.En : d.Period.Zh;
            var diet = isEnglish ? d.Diet.En : d.Diet.Zh;
            var location = isEnglish ? d.Location.En : d.Location.Zh;

            return name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)
                || description.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)
                || period.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)
                || diet.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)
                || location.Contains(searchTerm, StringComparison.OrdinalIgnoreCase);
        });
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync()
    {
        var data = await _jsonDataService.LoadDinosaursAsync();
        return data.Dinosaurs.Count;
    }

    /// <inheritdoc />
    public async Task<Dinosaur?> GetByIndexAsync(int index)
    {
        if (index < 0)
        {
            _logger.LogWarning("索引不可為負數：{Index}", index);
            return null;
        }

        var data = await _jsonDataService.LoadDinosaursAsync();

        if (index >= data.Dinosaurs.Count)
        {
            _logger.LogDebug("索引超出範圍：{Index}，總數={Count}", index, data.Dinosaurs.Count);
            return null;
        }

        return data.Dinosaurs[index];
    }
}
