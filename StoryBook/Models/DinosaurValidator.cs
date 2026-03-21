using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace StoryBook.Models;

/// <summary>
/// 恐龍驗證器
/// </summary>
public static partial class DinosaurValidator
{
    /// <summary>介紹文字最大長度</summary>
    public const int DescriptionMaxLength = 200;

    /// <summary>小故事最大長度</summary>
    public const int StoryMaxLength = 150;

    /// <summary>
    /// 驗證介紹文字長度（中英文各 ≤200 字）
    /// </summary>
    /// <param name="description">介紹文字</param>
    /// <returns>驗證結果</returns>
    public static ValidationResult? ValidateDescription(LocalizedText description)
    {
        ArgumentNullException.ThrowIfNull(description);

        if (description.Zh.Length > DescriptionMaxLength)
        {
            return new ValidationResult($"中文介紹不可超過 {DescriptionMaxLength} 字");
        }

        if (description.En.Length > DescriptionMaxLength)
        {
            return new ValidationResult($"英文介紹不可超過 {DescriptionMaxLength} 字");
        }

        return ValidationResult.Success;
    }

    /// <summary>
    /// 驗證小故事長度（中英文各 ≤150 字）
    /// </summary>
    /// <param name="story">小故事文字</param>
    /// <returns>驗證結果</returns>
    public static ValidationResult? ValidateStory(LocalizedText? story)
    {
        if (story is null)
        {
            return ValidationResult.Success;
        }

        if (story.Zh.Length > StoryMaxLength)
        {
            return new ValidationResult($"中文故事不可超過 {StoryMaxLength} 字");
        }

        if (story.En.Length > StoryMaxLength)
        {
            return new ValidationResult($"英文故事不可超過 {StoryMaxLength} 字");
        }

        return ValidationResult.Success;
    }

    /// <summary>
    /// 驗證 ID 格式（英文小寫、數字、連字號）
    /// </summary>
    /// <param name="id">恐龍 ID</param>
    /// <returns>驗證結果</returns>
    public static ValidationResult? ValidateId(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
        {
            return new ValidationResult("Id 不可為空");
        }

        if (!IdPattern().IsMatch(id))
        {
            return new ValidationResult("Id 僅可包含小寫英文、數字和連字號");
        }

        return ValidationResult.Success;
    }

    /// <summary>
    /// 驗證恐龍的所有欄位
    /// </summary>
    /// <param name="dinosaur">恐龍</param>
    /// <returns>驗證結果列表</returns>
    public static IEnumerable<ValidationResult> ValidateDinosaur(Dinosaur dinosaur)
    {
        ArgumentNullException.ThrowIfNull(dinosaur);

        var idResult = ValidateId(dinosaur.Id);
        if (idResult is not null && idResult != ValidationResult.Success)
        {
            yield return idResult;
        }

        var descriptionResult = ValidateDescription(dinosaur.Description);
        if (descriptionResult is not null && descriptionResult != ValidationResult.Success)
        {
            yield return descriptionResult;
        }

        var storyResult = ValidateStory(dinosaur.Story);
        if (storyResult is not null && storyResult != ValidationResult.Success)
        {
            yield return storyResult;
        }
    }

    [GeneratedRegex(@"^[a-z0-9\-]+$")]
    private static partial Regex IdPattern();
}
