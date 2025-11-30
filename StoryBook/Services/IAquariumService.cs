using StoryBook.Models;

namespace StoryBook.Services;

/// <summary>
/// 水族館動物服務介面，提供動物資料存取
/// </summary>
public interface IAquariumService
{
    /// <summary>取得所有水族館動物</summary>
    /// <returns>動物列表</returns>
    Task<IEnumerable<AquariumAnimal>> GetAllAsync();

    /// <summary>根據 Id 取得單隻動物</summary>
    /// <param name="id">動物 ID</param>
    /// <returns>動物資料，若不存在則返回 null</returns>
    Task<AquariumAnimal?> GetByIdAsync(string id);

    /// <summary>搜尋動物（比對名稱、生活環境、食性）</summary>
    /// <param name="keyword">搜尋關鍵字</param>
    /// <param name="language">語言代碼（zh 或 en）</param>
    /// <returns>符合條件的動物列表</returns>
    Task<IEnumerable<AquariumAnimal>> SearchAsync(string keyword, string language);

    /// <summary>根據生活區域取得動物</summary>
    /// <param name="zone">生活區域分類</param>
    /// <returns>該區域的動物列表</returns>
    Task<IEnumerable<AquariumAnimal>> GetByHabitatZoneAsync(HabitatZone zone);

    /// <summary>取得動物總數</summary>
    /// <returns>動物總數</returns>
    Task<int> GetCountAsync();

    /// <summary>根據索引取得動物（換頁用）</summary>
    /// <param name="index">索引位置（從 0 開始）</param>
    /// <returns>動物資料，若索引無效則返回 null</returns>
    Task<AquariumAnimal?> GetByIndexAsync(int index);
}
