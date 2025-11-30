using StoryBook.Models;

namespace StoryBook.Services;

/// <summary>
/// 恐龍服務介面，提供恐龍資料存取
/// </summary>
public interface IDinosaurService
{
    /// <summary>取得所有恐龍</summary>
    /// <returns>恐龍列表</returns>
    Task<IEnumerable<Dinosaur>> GetAllAsync();

    /// <summary>根據 Id 取得單隻恐龍</summary>
    /// <param name="id">恐龍 ID</param>
    /// <returns>恐龍資料，若不存在則返回 null</returns>
    Task<Dinosaur?> GetByIdAsync(string id);

    /// <summary>搜尋恐龍（比對名稱和介紹）</summary>
    /// <param name="keyword">搜尋關鍵字</param>
    /// <param name="language">語言代碼（zh 或 en）</param>
    /// <returns>符合條件的恐龍列表</returns>
    Task<IEnumerable<Dinosaur>> SearchAsync(string keyword, string language);

    /// <summary>取得恐龍總數</summary>
    /// <returns>恐龍總數</returns>
    Task<int> GetCountAsync();

    /// <summary>根據索引取得恐龍（換頁用）</summary>
    /// <param name="index">索引位置（從 0 開始）</param>
    /// <returns>恐龍資料，若索引無效則返回 null</returns>
    Task<Dinosaur?> GetByIndexAsync(int index);
}
