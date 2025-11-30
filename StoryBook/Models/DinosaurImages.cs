namespace StoryBook.Models;

/// <summary>
/// 恐龍圖片資訊
/// </summary>
public class DinosaurImages
{
    /// <summary>主要圖片路徑（相對於 wwwroot）</summary>
    /// <example>/images/dinosaurs/tyrannosaurus/main.png</example>
    public required string Main { get; set; }

    /// <summary>
    /// 故事插圖路徑列表（預設為空列表）
    /// </summary>
    public List<string> Story { get; set; } = [];
}
