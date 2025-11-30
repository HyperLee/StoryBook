namespace StoryBook.Models;

/// <summary>
/// 水族館動物實體，包含所有動物相關資訊
/// </summary>
/// <example>
/// <code>
/// var clownfish = new AquariumAnimal
/// {
///     Id = "clownfish",
///     Name = new LocalizedText { Zh = "小丑魚", En = "Clownfish" },
///     HabitatZone = HabitatZone.CoralReef,
///     Habitat = new LocalizedText { Zh = "珊瑚礁海域", En = "Coral reef waters" },
///     Diet = new LocalizedText { Zh = "雜食性", En = "Omnivore" },
///     Location = new LocalizedText { Zh = "太平洋、印度洋", En = "Pacific, Indian Ocean" },
///     Description = new LocalizedText { Zh = "小丑魚是最受歡迎的熱帶魚...", En = "Clownfish are the most popular..." },
///     Images = new AquariumAnimalImages { Main = "/images/aquarium/clownfish/main.png" }
/// };
/// </code>
/// </example>
public class AquariumAnimal
{
    /// <summary>唯一識別碼（英文小寫，如 "clownfish"）</summary>
    public required string Id { get; set; }

    /// <summary>動物名稱（中英文）</summary>
    public required LocalizedText Name { get; set; }

    /// <summary>生活區域分類</summary>
    public required HabitatZone HabitatZone { get; set; }

    /// <summary>生活環境描述（中英文）</summary>
    public required LocalizedText Habitat { get; set; }

    /// <summary>食性：肉食性、草食性、雜食性、濾食性等（中英文）</summary>
    public required LocalizedText Diet { get; set; }

    /// <summary>發現/分佈地點（中英文）</summary>
    public required LocalizedText Location { get; set; }

    /// <summary>體型描述（中英文），可選</summary>
    public LocalizedText? Size { get; set; }

    /// <summary>介紹文字（中英文），每種語言不超過 200 字</summary>
    public required LocalizedText Description { get; set; }

    /// <summary>相關小故事（中英文），每種語言 100-150 字，可選</summary>
    public LocalizedText? Story { get; set; }

    /// <summary>圖片資訊</summary>
    public required AquariumAnimalImages Images { get; set; }
}
