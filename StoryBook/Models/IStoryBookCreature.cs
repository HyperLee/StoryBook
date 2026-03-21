namespace StoryBook.Models;

/// <summary>
/// 故事書生物共用介面，定義水族館動物和恐龍等生物的共用屬性
/// </summary>
/// <example>
/// <code>
/// IStoryBookCreature creature = new AquariumAnimal { ... };
/// var name = creature.Name.GetText("zh");
/// </code>
/// </example>
public interface IStoryBookCreature
{
    /// <summary>唯一識別碼（英文小寫）</summary>
    string Id { get; }

    /// <summary>名稱（中英文）</summary>
    LocalizedText Name { get; }

    /// <summary>食性（中英文）</summary>
    LocalizedText Diet { get; }

    /// <summary>發現/分佈地點（中英文）</summary>
    LocalizedText Location { get; }

    /// <summary>體型描述（中英文），可選</summary>
    LocalizedText? Size { get; }

    /// <summary>介紹文字（中英文）</summary>
    LocalizedText Description { get; }

    /// <summary>相關小故事（中英文），可選</summary>
    LocalizedText? Story { get; }
}
