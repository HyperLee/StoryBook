namespace StoryBook.Models;

/// <summary>
/// 水族館動物資料容器，對應 JSON 檔案根物件
/// </summary>
/// <example>
/// <code>
/// var data = new AquariumAnimalData
/// {
///     Animals = new List&lt;AquariumAnimal&gt;
///     {
///         new AquariumAnimal { Id = "clownfish", ... }
///     }
/// };
/// </code>
/// </example>
public class AquariumAnimalData
{
    /// <summary>水族館動物列表</summary>
    public List<AquariumAnimal> Animals { get; set; } = [];
}
