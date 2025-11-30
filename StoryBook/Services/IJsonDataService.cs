using StoryBook.Models;

namespace StoryBook.Services;

/// <summary>
/// JSON 資料服務介面，處理 JSON 檔案讀取
/// </summary>
public interface IJsonDataService
{
    /// <summary>
    /// 載入恐龍資料
    /// </summary>
    /// <returns>恐龍資料容器</returns>
    Task<DinosaurData> LoadDinosaursAsync();

    /// <summary>
    /// 載入水族館動物資料
    /// </summary>
    /// <returns>水族館動物資料容器</returns>
    Task<AquariumAnimalData> LoadAquariumAnimalsAsync();

    /// <summary>
    /// 清除快取，強制下次載入時重新讀取檔案
    /// </summary>
    Task ClearCacheAsync();
}
