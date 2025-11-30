using StoryBook.Models;

namespace StoryBook.Services;

/// <summary>
/// JSON 資料服務介面，處理 JSON 檔案讀取
/// </summary>
public interface IJsonDataService
{
    /// <summary>載入恐龍資料</summary>
    /// <returns>恐龍資料容器</returns>
    Task<DinosaurData> LoadDinosaursAsync();
}
