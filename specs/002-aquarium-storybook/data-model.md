# 資料模型：水族館動物介紹故事書

**功能分支**: `002-aquarium-storybook`  
**日期**: 2025-11-30  
**狀態**: 完成

## 概述

本文件定義水族館動物介紹故事書系統的資料模型，包含實體、欄位、關聯性和驗證規則。系統參照恐龍故事書架構，共用 `LocalizedText` 模型。

---

## 實體定義

### 1. LocalizedText（多語言文字）- 共用

**用途**: 儲存中英文雙語內容（與恐龍故事書共用）

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `Zh` | `string` | ✅ | 繁體中文內容 |
| `En` | `string` | ✅ | 英文內容 |

**C# 定義**（已存在於 `StoryBook/Models/LocalizedText.cs`）:

```csharp
namespace StoryBook.Models;

/// <summary>
/// 多語言文字，支援中文和英文
/// </summary>
/// <example>
/// <code>
/// var name = new LocalizedText { Zh = "小丑魚", En = "Clownfish" };
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
```

---

### 2. HabitatZone（生活區域分類）- 新增

**用途**: 定義水族館動物的生活區域分類

| 值 | 中文 | 英文 | 說明 |
|----|------|------|------|
| `Freshwater` | 淡水 | Freshwater | 河流、湖泊等淡水環境 |
| `Saltwater` | 海水 | Saltwater | 一般海洋環境 |
| `DeepSea` | 深海 | Deep Sea | 深海區域 |
| `CoralReef` | 珊瑚礁 | Coral Reef | 珊瑚礁區域 |
| `Polar` | 極地 | Polar | 極地海域 |

**C# 定義**:

```csharp
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
}
```

**JSON 範例**:

```json
{
  "habitatZone": "coralreef"
}
```

---

### 3. AquariumAnimalImages（水族館動物圖片）- 新增

**用途**: 儲存水族館動物相關的圖片路徑

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `Main` | `string` | ✅ | 主要圖片路徑 |
| `Story` | `List<string>` | ❌ | 故事插圖路徑列表 |

**C# 定義**:

```csharp
namespace StoryBook.Models;

/// <summary>
/// 水族館動物圖片資訊
/// </summary>
public class AquariumAnimalImages
{
    /// <summary>主要圖片路徑（相對於 wwwroot）</summary>
    /// <example>/images/aquarium/clownfish/main.png</example>
    public required string Main { get; set; }
    
    /// <summary>故事插圖路徑列表</summary>
    public List<string> Story { get; set; } = new();
}
```

**JSON 範例**:

```json
{
  "main": "/images/aquarium/clownfish/main.png",
  "story": [
    "/images/aquarium/clownfish/story-1.png"
  ]
}
```

---

### 4. AquariumAnimal（水族館動物）- 新增

**用途**: 核心實體，儲存單隻水族館動物的所有資訊

| 欄位 | 型別 | 必填 | 說明 | 驗證規則 |
|------|------|------|------|----------|
| `Id` | `string` | ✅ | 唯一識別碼（英文小寫） | 非空、僅限英數字和連字號 |
| `Name` | `LocalizedText` | ✅ | 動物名稱 | 非空 |
| `HabitatZone` | `HabitatZone` | ✅ | 生活區域分類 | 有效的 enum 值 |
| `Habitat` | `LocalizedText` | ✅ | 生活環境描述 | 非空 |
| `Diet` | `LocalizedText` | ✅ | 食性 | 非空 |
| `Location` | `LocalizedText` | ✅ | 發現/分佈地點 | 非空 |
| `Size` | `LocalizedText` | ❌ | 體型描述 | - |
| `Description` | `LocalizedText` | ✅ | 介紹文字 | 非空、中英文各 ≤200 字 |
| `Story` | `LocalizedText` | ❌ | 相關小故事 | 中英文各 100-150 字 |
| `Images` | `AquariumAnimalImages` | ✅ | 圖片資訊 | 主圖必填 |

**C# 定義**:

```csharp
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
```

**JSON 範例（完整動物資料）**:

```json
{
  "id": "clownfish",
  "name": {
    "zh": "小丑魚",
    "en": "Clownfish"
  },
  "habitatZone": "coralreef",
  "habitat": {
    "zh": "熱帶珊瑚礁海域，與海葵共生",
    "en": "Tropical coral reef waters, living in symbiosis with sea anemones"
  },
  "diet": {
    "zh": "雜食性",
    "en": "Omnivore"
  },
  "location": {
    "zh": "太平洋、印度洋的珊瑚礁區",
    "en": "Coral reefs of Pacific and Indian Oceans"
  },
  "size": {
    "zh": "身長約 7-15 公分",
    "en": "About 7-15 cm in length"
  },
  "description": {
    "zh": "小丑魚是最受歡迎的熱帶魚之一！牠們身上有鮮豔的橘色和白色條紋，非常好認。小丑魚最特別的地方是牠們會住在海葵裡面，海葵的觸手有毒，但小丑魚身上有特殊的黏液保護，所以不會被螫傷。小丑魚和海葵是好朋友，互相照顧對方喔！",
    "en": "Clownfish are one of the most popular tropical fish! They have bright orange and white stripes that make them easy to recognize. The special thing about clownfish is that they live inside sea anemones. The anemone's tentacles are poisonous, but clownfish have special mucus that protects them. Clownfish and anemones are best friends who take care of each other!"
  },
  "story": {
    "zh": "小丑魚尼尼今天很開心，因為海葵阿姨幫牠慶祝生日。尼尼住在海葵阿姨的觸手之間，每天都很安全。當一隻大魚游過來想吃尼尼時，海葵阿姨伸出觸手把大魚嚇跑了。尼尼說：「謝謝妳保護我！」海葵阿姨笑著說：「你也幫我趕走壞蟲蟲呀！」牠們是最好的朋友。",
    "en": "Nini the clownfish was happy today because Auntie Anemone threw a birthday party for her. Nini lives safely among Auntie Anemone's tentacles. When a big fish came to eat Nini, Auntie Anemone stretched out her tentacles and scared it away. Nini said, 'Thank you for protecting me!' Auntie Anemone smiled, 'You also chase away the bugs for me!' They are the best of friends."
  },
  "images": {
    "main": "/images/aquarium/clownfish/main.png",
    "story": ["/images/aquarium/clownfish/story-1.png"]
  }
}
```

---

### 5. AquariumAnimalData（水族館動物資料容器）- 新增

**用途**: JSON 檔案的根物件

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `Animals` | `List<AquariumAnimal>` | ✅ | 水族館動物列表 |

**C# 定義**:

```csharp
namespace StoryBook.Models;

/// <summary>
/// 水族館動物資料容器，對應 JSON 檔案根物件
/// </summary>
public class AquariumAnimalData
{
    /// <summary>水族館動物列表</summary>
    public List<AquariumAnimal> Animals { get; set; } = new();
}
```

**JSON 結構**:

```json
{
  "animals": [
    { /* AquariumAnimal 1 */ },
    { /* AquariumAnimal 2 */ },
    ...
  ]
}
```

---

## 實體關係圖

```text
┌─────────────────────────────────────────────────────────────┐
│                   AquariumAnimalData                        │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                     animals[]                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                     AquariumAnimal                          │
├─────────────────────────────────────────────────────────────┤
│  id: string                                                 │
│  name: LocalizedText                                        │
│  habitatZone: HabitatZone (enum)                           │
│  habitat: LocalizedText                                     │
│  diet: LocalizedText                                        │
│  location: LocalizedText                                    │
│  size: LocalizedText?                                       │
│  description: LocalizedText                                 │
│  story: LocalizedText?                                      │
│  images: AquariumAnimalImages                              │
└─────────────────────────────────────────────────────────────┘
         │              │                    │
         │ 1:1          │ 1:1                │ 1:1
         ▼              ▼                    ▼
┌───────────────┐ ┌───────────────┐ ┌─────────────────────┐
│ LocalizedText │ │  HabitatZone  │ │AquariumAnimalImages │
├───────────────┤ ├───────────────┤ ├─────────────────────┤
│  zh: string   │ │  Freshwater   │ │  main: string       │
│  en: string   │ │  Saltwater    │ │  story: string[]    │
└───────────────┘ │  DeepSea      │ └─────────────────────┘
    (共用模型)    │  CoralReef    │
                  │  Polar        │
                  └───────────────┘
```

---

## 與恐龍故事書的比較

| 面向 | 恐龍故事書 | 水族館故事書 | 差異 |
|------|------------|--------------|------|
| 核心實體 | `Dinosaur` | `AquariumAnimal` | 名稱不同 |
| 時期欄位 | `Period`（生活時期） | `HabitatZone`（生活區域） | 恐龍用時期、水族館用區域 |
| 分類方式 | 無 | `HabitatZone` enum | 水族館新增分類功能 |
| 多語言 | `LocalizedText` | `LocalizedText` | 共用 |
| 圖片 | `DinosaurImages` | `AquariumAnimalImages` | 結構相同，名稱不同 |
| 故事 | `Story` (150字) | `Story` (100-150字) | 相同 |
| 介紹 | `Description` (200字) | `Description` (200字) | 相同 |

---

## 驗證規則

### AquariumAnimal 驗證

```csharp
using System.ComponentModel.DataAnnotations;

namespace StoryBook.Models;

/// <summary>
/// 水族館動物驗證器
/// </summary>
public static class AquariumAnimalValidator
{
    /// <summary>
    /// 驗證介紹文字長度（中英文各 ≤200 字）
    /// </summary>
    public static ValidationResult? ValidateDescription(LocalizedText description)
    {
        if (description.Zh.Length > 200)
            return new ValidationResult("中文介紹不可超過 200 字");
        if (description.En.Length > 200)
            return new ValidationResult("英文介紹不可超過 200 字");
        return ValidationResult.Success;
    }
    
    /// <summary>
    /// 驗證小故事長度（中英文各 100-150 字）
    /// </summary>
    public static ValidationResult? ValidateStory(LocalizedText? story)
    {
        if (story is null) return ValidationResult.Success;
        if (story.Zh.Length < 100)
            return new ValidationResult("中文故事不可少於 100 字");
        if (story.Zh.Length > 150)
            return new ValidationResult("中文故事不可超過 150 字");
        if (story.En.Length < 100)
            return new ValidationResult("英文故事不可少於 100 字");
        if (story.En.Length > 150)
            return new ValidationResult("英文故事不可超過 150 字");
        return ValidationResult.Success;
    }
    
    /// <summary>
    /// 驗證 ID 格式（英文小寫、數字、連字號）
    /// </summary>
    public static ValidationResult? ValidateId(string id)
    {
        if (string.IsNullOrWhiteSpace(id))
            return new ValidationResult("Id 不可為空");
        if (!System.Text.RegularExpressions.Regex.IsMatch(id, @"^[a-z0-9\-]+$"))
            return new ValidationResult("Id 僅可包含小寫英文、數字和連字號");
        return ValidationResult.Success;
    }
}
```

---

## 服務介面

### IAquariumService

```csharp
namespace StoryBook.Services;

using StoryBook.Models;

/// <summary>
/// 水族館動物服務介面，提供動物資料存取
/// </summary>
public interface IAquariumService
{
    /// <summary>取得所有水族館動物</summary>
    /// <returns>動物列表</returns>
    Task<IEnumerable<AquariumAnimal>> GetAllAsync();
    
    /// <summary>根據 Id 取得單隻動物</summary>
    /// <param name="id">動物 ID</param>
    /// <returns>動物資料，若不存在則返回 null</returns>
    Task<AquariumAnimal?> GetByIdAsync(string id);
    
    /// <summary>搜尋動物（比對名稱、生活環境、食性）</summary>
    /// <param name="keyword">搜尋關鍵字</param>
    /// <param name="language">語言代碼（zh 或 en）</param>
    /// <returns>符合條件的動物列表</returns>
    Task<IEnumerable<AquariumAnimal>> SearchAsync(string keyword, string language);
    
    /// <summary>根據生活區域取得動物</summary>
    /// <param name="zone">生活區域分類</param>
    /// <returns>該區域的動物列表</returns>
    Task<IEnumerable<AquariumAnimal>> GetByHabitatZoneAsync(HabitatZone zone);
    
    /// <summary>取得動物總數</summary>
    /// <returns>動物總數</returns>
    Task<int> GetCountAsync();
    
    /// <summary>根據索引取得動物（換頁用）</summary>
    /// <param name="index">索引位置（從 0 開始）</param>
    /// <returns>動物資料，若索引無效則返回 null</returns>
    Task<AquariumAnimal?> GetByIndexAsync(int index);
}
```

### IJsonDataService（擴充）

```csharp
namespace StoryBook.Services;

using StoryBook.Models;

/// <summary>
/// JSON 資料服務介面，處理 JSON 檔案讀取
/// </summary>
public interface IJsonDataService
{
    /// <summary>載入恐龍資料</summary>
    Task<DinosaurData> LoadDinosaursAsync();
    
    /// <summary>載入水族館動物資料（新增）</summary>
    Task<AquariumAnimalData> LoadAquariumAnimalsAsync();
}
```

---

## 檔案位置

| 檔案 | 路徑 | 狀態 |
|------|------|------|
| LocalizedText | `StoryBook/Models/LocalizedText.cs` | 現有（共用） |
| HabitatZone | `StoryBook/Models/HabitatZone.cs` | 新增 |
| AquariumAnimalImages | `StoryBook/Models/AquariumAnimalImages.cs` | 新增 |
| AquariumAnimal | `StoryBook/Models/AquariumAnimal.cs` | 新增 |
| AquariumAnimalData | `StoryBook/Models/AquariumAnimalData.cs` | 新增 |
| AquariumAnimalValidator | `StoryBook/Models/AquariumAnimalValidator.cs` | 新增 |
| IAquariumService | `StoryBook/Services/IAquariumService.cs` | 新增 |
| AquariumService | `StoryBook/Services/AquariumService.cs` | 新增 |
| IJsonDataService | `StoryBook/Services/IJsonDataService.cs` | 現有（擴充） |
| JsonDataService | `StoryBook/Services/JsonDataService.cs` | 現有（擴充） |
| JSON 資料 | `StoryBook/wwwroot/data/aquarium.json` | 新增 |

---

## 附錄：完整 JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "AquariumAnimalData",
  "type": "object",
  "required": ["animals"],
  "properties": {
    "animals": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "habitatZone", "habitat", "diet", "location", "description", "images"],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^[a-z0-9\\-]+$"
          },
          "name": { "$ref": "#/definitions/LocalizedText" },
          "habitatZone": {
            "type": "string",
            "enum": ["freshwater", "saltwater", "deepsea", "coralreef", "polar"]
          },
          "habitat": { "$ref": "#/definitions/LocalizedText" },
          "diet": { "$ref": "#/definitions/LocalizedText" },
          "location": { "$ref": "#/definitions/LocalizedText" },
          "size": { "$ref": "#/definitions/LocalizedText" },
          "description": { "$ref": "#/definitions/LocalizedText" },
          "story": { "$ref": "#/definitions/LocalizedText" },
          "images": {
            "type": "object",
            "required": ["main"],
            "properties": {
              "main": { "type": "string" },
              "story": {
                "type": "array",
                "items": { "type": "string" }
              }
            }
          }
        }
      }
    }
  },
  "definitions": {
    "LocalizedText": {
      "type": "object",
      "required": ["zh", "en"],
      "properties": {
        "zh": { "type": "string" },
        "en": { "type": "string" }
      }
    }
  }
}
```
