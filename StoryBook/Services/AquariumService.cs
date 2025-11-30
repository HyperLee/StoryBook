using StoryBook.Models;

namespace StoryBook.Services;

/// <summary>
/// 水族館動物服務實作，提供動物資料存取
/// </summary>
/// <example>
/// <code>
/// var service = new AquariumService(jsonDataService, logger);
/// var animals = await service.GetAllAsync();
/// var clownfish = await service.GetByIdAsync("clownfish");
/// </code>
/// </example>
public class AquariumService : IAquariumService
{
    private readonly IJsonDataService _jsonDataService;
    private readonly ILogger<AquariumService> _logger;

    /// <summary>
    /// 建立 AquariumService 實例
    /// </summary>
    /// <param name="jsonDataService">JSON 資料服務</param>
    /// <param name="logger">日誌服務</param>
    public AquariumService(IJsonDataService jsonDataService, ILogger<AquariumService> logger)
    {
        _jsonDataService = jsonDataService ?? throw new ArgumentNullException(nameof(jsonDataService));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    /// <inheritdoc />
    public async Task<IEnumerable<AquariumAnimal>> GetAllAsync()
    {
        _logger.LogDebug("取得所有水族館動物");
        var data = await _jsonDataService.LoadAquariumAnimalsAsync();
        return data.Animals;
    }

    /// <inheritdoc />
    public async Task<AquariumAnimal?> GetByIdAsync(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            _logger.LogWarning("GetByIdAsync 收到空的 ID");
            return null;
        }

        _logger.LogDebug("根據 ID 取得水族館動物：{Id}", id);
        var data = await _jsonDataService.LoadAquariumAnimalsAsync();
        return data.Animals.FirstOrDefault(a => a.Id.Equals(id, StringComparison.OrdinalIgnoreCase));
    }

    /// <inheritdoc />
    public async Task<IEnumerable<AquariumAnimal>> SearchAsync(string keyword, string language)
    {
        if (string.IsNullOrWhiteSpace(keyword))
        {
            _logger.LogDebug("搜尋關鍵字為空，返回所有動物");
            return await GetAllAsync();
        }

        _logger.LogDebug("搜尋水族館動物：關鍵字={Keyword}，語言={Language}", keyword, language);

        var data = await _jsonDataService.LoadAquariumAnimalsAsync();
        var searchTerm = keyword.Trim().ToLowerInvariant();
        var isEnglish = language?.ToLowerInvariant() == "en";

        return data.Animals.Where(animal =>
        {
            // 搜尋名稱
            var name = isEnglish ? animal.Name.En : animal.Name.Zh;
            if (name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            // 搜尋生活環境
            var habitat = isEnglish ? animal.Habitat.En : animal.Habitat.Zh;
            if (habitat.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            // 搜尋食性
            var diet = isEnglish ? animal.Diet.En : animal.Diet.Zh;
            if (diet.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            // 搜尋分佈地點
            var location = isEnglish ? animal.Location.En : animal.Location.Zh;
            if (location.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            // 搜尋區域分類名稱
            var zoneName = animal.HabitatZone.GetDisplayName();
            var zoneText = isEnglish ? zoneName.En : zoneName.Zh;
            if (zoneText.Contains(searchTerm, StringComparison.OrdinalIgnoreCase))
            {
                return true;
            }

            return false;
        });
    }

    /// <inheritdoc />
    public async Task<IEnumerable<AquariumAnimal>> GetByHabitatZoneAsync(HabitatZone zone)
    {
        _logger.LogDebug("根據生活區域取得水族館動物：{Zone}", zone);
        var data = await _jsonDataService.LoadAquariumAnimalsAsync();
        return data.Animals.Where(a => a.HabitatZone == zone);
    }

    /// <inheritdoc />
    public async Task<int> GetCountAsync()
    {
        _logger.LogDebug("取得水族館動物總數");
        var data = await _jsonDataService.LoadAquariumAnimalsAsync();
        return data.Animals.Count;
    }

    /// <inheritdoc />
    public async Task<AquariumAnimal?> GetByIndexAsync(int index)
    {
        if (index < 0)
        {
            _logger.LogWarning("GetByIndexAsync 收到無效的索引：{Index}", index);
            return null;
        }

        _logger.LogDebug("根據索引取得水族館動物：{Index}", index);
        var data = await _jsonDataService.LoadAquariumAnimalsAsync();

        if (index >= data.Animals.Count)
        {
            _logger.LogWarning("索引超出範圍：{Index}，動物總數：{Count}", index, data.Animals.Count);
            return null;
        }

        return data.Animals[index];
    }
}
