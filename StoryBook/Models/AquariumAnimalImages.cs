namespace StoryBook.Models;

/// <summary>
/// 水族館動物圖片資訊
/// </summary>
/// <example>
/// <code>
/// var images = new AquariumAnimalImages
/// {
///     Main = "/images/aquarium/clownfish/main.png",
///     Story = new List&lt;string&gt; { "/images/aquarium/clownfish/story-1.png" }
/// };
/// </code>
/// </example>
public class AquariumAnimalImages
{
    /// <summary>主要圖片路徑（相對於 wwwroot）</summary>
    /// <example>/images/aquarium/clownfish/main.png</example>
    public required string Main { get; set; }

    /// <summary>故事插圖路徑列表</summary>
    public List<string> Story { get; set; } = [];
}
