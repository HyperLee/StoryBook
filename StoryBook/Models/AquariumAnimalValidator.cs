using System.ComponentModel.DataAnnotations;
using System.Text.RegularExpressions;

namespace StoryBook.Models;

/// <summary>
/// 水族館動物驗證器
/// </summary>
public static partial class AquariumAnimalValidator
{
    /// <summary>
    /// 驗證介紹文字長度（中英文各 ≤200 字）
    /// </summary>
    /// <param name="description">介紹文字</param>
    /// <returns>驗證結果</returns>
    public static ValidationResult? ValidateDescription(LocalizedText description)
    {
        if (description.Zh.Length > 200)
        {
            return new ValidationResult("中文介紹不可超過 200 字");
        }

        if (description.En.Length > 200)
        {
            return new ValidationResult("英文介紹不可超過 200 字");
        }

        return ValidationResult.Success;
    }

    /// <summary>
    /// 驗證小故事長度（中英文各 100-150 字）
    /// </summary>
    /// <param name="story">小故事文字</param>
    /// <returns>驗證結果</returns>
    public static ValidationResult? ValidateStory(LocalizedText? story)
    {
        if (story is null)
        {
            return ValidationResult.Success;
        }

        if (story.Zh.Length < 100)
        {
            return new ValidationResult("中文故事不可少於 100 字");
        }

        if (story.Zh.Length > 150)
        {
            return new ValidationResult("中文故事不可超過 150 字");
        }

        if (story.En.Length < 100)
        {
            return new ValidationResult("英文故事不可少於 100 字");
        }

        if (story.En.Length > 150)
        {
            return new ValidationResult("英文故事不可超過 150 字");
        }

        return ValidationResult.Success;
    }

    /// <summary>
    /// 驗證 ID 格式（英文小寫、數字、連字號）
    /// </summary>
    /// <param name="id">動物 ID</param>
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
    /// 驗證水族館動物的所有欄位
    /// </summary>
    /// <param name="animal">水族館動物</param>
    /// <returns>驗證結果列表</returns>
    public static IEnumerable<ValidationResult> ValidateAnimal(AquariumAnimal animal)
    {
        var idResult = ValidateId(animal.Id);
        if (idResult is not null && idResult != ValidationResult.Success)
        {
            yield return idResult;
        }

        var descriptionResult = ValidateDescription(animal.Description);
        if (descriptionResult is not null && descriptionResult != ValidationResult.Success)
        {
            yield return descriptionResult;
        }

        var storyResult = ValidateStory(animal.Story);
        if (storyResult is not null && storyResult != ValidationResult.Success)
        {
            yield return storyResult;
        }
    }

    [GeneratedRegex(@"^[a-z0-9\-]+$")]
    private static partial Regex IdPattern();
}
