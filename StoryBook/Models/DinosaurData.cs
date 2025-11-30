namespace StoryBook.Models;

/// <summary>
/// 恐龍資料容器，對應 JSON 檔案根物件
/// </summary>
public class DinosaurData
{
    /// <summary>恐龍列表</summary>
    public List<Dinosaur> Dinosaurs { get; set; } = [];
}
