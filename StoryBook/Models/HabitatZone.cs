namespace StoryBook.Models;

/// <summary>
/// 水族館動物生活區域分類
/// </summary>
public enum HabitatZone
{
    /// <summary>淡水區域（河流、湖泊）</summary>
    Freshwater,

    /// <summary>海水區域（一般海洋）</summary>
    Saltwater,

    /// <summary>深海區域</summary>
    DeepSea,

    /// <summary>珊瑚礁區域</summary>
    CoralReef,

    /// <summary>極地區域</summary>
    Polar
}

/// <summary>
/// 區域分類擴充方法
/// </summary>
public static class HabitatZoneExtensions
{
    /// <summary>
    /// 取得區域的多語言顯示名稱
    /// </summary>
    /// <param name="zone">區域分類</param>
    /// <returns>多語言顯示名稱</returns>
    /// <example>
    /// <code>
    /// var name = HabitatZone.CoralReef.GetDisplayName();
    /// // name.Zh = "珊瑚礁", name.En = "Coral Reef"
    /// </code>
    /// </example>
    public static LocalizedText GetDisplayName(this HabitatZone zone) => zone switch
    {
        HabitatZone.Freshwater => new LocalizedText { Zh = "淡水", En = "Freshwater" },
        HabitatZone.Saltwater => new LocalizedText { Zh = "海水", En = "Saltwater" },
        HabitatZone.DeepSea => new LocalizedText { Zh = "深海", En = "Deep Sea" },
        HabitatZone.CoralReef => new LocalizedText { Zh = "珊瑚礁", En = "Coral Reef" },
        HabitatZone.Polar => new LocalizedText { Zh = "極地", En = "Polar" },
        _ => new LocalizedText { Zh = "未知", En = "Unknown" }
    };

    /// <summary>
    /// 取得區域的 CSS 類別名稱
    /// </summary>
    /// <param name="zone">區域分類</param>
    /// <returns>CSS 類別名稱</returns>
    public static string GetCssClass(this HabitatZone zone) => zone switch
    {
        HabitatZone.Freshwater => "zone-freshwater",
        HabitatZone.Saltwater => "zone-saltwater",
        HabitatZone.DeepSea => "zone-deepsea",
        HabitatZone.CoralReef => "zone-coralreef",
        HabitatZone.Polar => "zone-polar",
        _ => "zone-unknown"
    };

    /// <summary>
    /// 從字串解析生活區域分類
    /// </summary>
    /// <param name="value">區域字串值</param>
    /// <returns>對應的 HabitatZone enum 值，無法辨識時預設為 Saltwater</returns>
    public static HabitatZone ParseHabitatZone(string? value)
    {
        if (TryParseHabitatZone(value, out var zone))
        {
            return zone;
        }

        return HabitatZone.Saltwater;
    }

    /// <summary>
    /// 嘗試從字串解析生活區域分類
    /// </summary>
    /// <param name="value">區域字串值</param>
    /// <param name="zone">解析結果</param>
    /// <returns>是否成功解析</returns>
    public static bool TryParseHabitatZone(string? value, out HabitatZone zone)
    {
        var result = value?.ToLowerInvariant() switch
        {
            "freshwater" => (HabitatZone?)HabitatZone.Freshwater,
            "saltwater" => HabitatZone.Saltwater,
            "deepsea" => HabitatZone.DeepSea,
            "coralreef" => HabitatZone.CoralReef,
            "polar" => HabitatZone.Polar,
            _ => null
        };

        zone = result ?? HabitatZone.Saltwater;

        return result.HasValue;
    }
}
