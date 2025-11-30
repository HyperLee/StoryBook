namespace StoryBook.Models;

/// <summary>
/// 多語言文字，支援中文和英文
/// </summary>
/// <example>
/// <code>
/// var name = new LocalizedText { Zh = "暴龍", En = "Tyrannosaurus Rex" };
/// </code>
/// </example>
public class LocalizedText
{
    /// <summary>繁體中文內容</summary>
    public required string Zh { get; set; }

    /// <summary>英文內容</summary>
    public required string En { get; set; }

    /// <summary>
    /// 根據語言代碼取得對應文字
    /// </summary>
    /// <param name="languageCode">語言代碼（zh 或 en）</param>
    /// <returns>對應語言的文字，預設返回中文</returns>
    public string GetText(string languageCode) =>
        languageCode?.ToLowerInvariant() == "en" ? En : Zh;
}
