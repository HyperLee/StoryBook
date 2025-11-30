namespace StoryBook.Models;

/// <summary>
/// 恐龍實體，包含所有恐龍相關資訊
/// </summary>
/// <example>
/// <code>
/// var trex = new Dinosaur
/// {
///     Id = "tyrannosaurus",
///     Name = new LocalizedText { Zh = "暴龍", En = "Tyrannosaurus Rex" },
///     Period = new LocalizedText { Zh = "白堊紀晚期", En = "Late Cretaceous" },
///     Diet = new LocalizedText { Zh = "肉食性", En = "Carnivore" },
///     Location = new LocalizedText { Zh = "北美洲", En = "North America" },
///     Description = new LocalizedText { Zh = "暴龍是最有名的恐龍...", En = "T-Rex is the most famous..." },
///     Images = new DinosaurImages { Main = "/images/dinosaurs/tyrannosaurus/main.png" }
/// };
/// </code>
/// </example>
public class Dinosaur
{
    /// <summary>唯一識別碼（英文小寫，如 "tyrannosaurus"）</summary>
    public required string Id { get; set; }

    /// <summary>恐龍名稱（中英文）</summary>
    public required LocalizedText Name { get; set; }

    /// <summary>生活時期（中英文）</summary>
    public required LocalizedText Period { get; set; }

    /// <summary>食性：肉食性、草食性、雜食性（中英文）</summary>
    public required LocalizedText Diet { get; set; }

    /// <summary>發現地點（中英文）</summary>
    public required LocalizedText Location { get; set; }

    /// <summary>體型描述（中英文），可選</summary>
    public LocalizedText? Size { get; set; }

    /// <summary>介紹文字（中英文），每種語言不超過 200 字</summary>
    public required LocalizedText Description { get; set; }

    /// <summary>相關小故事（中英文），每種語言不超過 150 字，可選</summary>
    public LocalizedText? Story { get; set; }

    /// <summary>圖片資訊</summary>
    public required DinosaurImages Images { get; set; }
}
