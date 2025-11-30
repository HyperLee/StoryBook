# 資料模型：恐龍故事書系統

**功能分支**: `001-dinosaur-storybook`  
**日期**: 2025-11-30  
**狀態**: 完成

## 概述

本文件定義恐龍故事書系統的資料模型，包含實體、欄位、關聯性和驗證規則。

---

## 實體定義

### 1. LocalizedText（多語言文字）

**用途**: 儲存中英文雙語內容

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `Zh` | `string` | ✅ | 繁體中文內容 |
| `En` | `string` | ✅ | 英文內容 |

**C# 定義**:

```csharp
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
```

**JSON 範例**:

```json
{
  "zh": "暴龍",
  "en": "Tyrannosaurus Rex"
}
```

---

### 2. DinosaurImages（恐龍圖片）

**用途**: 儲存恐龍相關的圖片路徑

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `Main` | `string` | ✅ | 主要圖片路徑 |
| `Story` | `List<string>` | ❌ | 故事插圖路徑列表 |

**C# 定義**:

```csharp
namespace StoryBook.Models;

/// <summary>
/// 恐龍圖片資訊
/// </summary>
public class DinosaurImages
{
    /// <summary>主要圖片路徑（相對於 wwwroot）</summary>
    /// <example>/images/dinosaurs/tyrannosaurus/main.png</example>
    public required string Main { get; set; }
    
    /// <summary>故事插圖路徑列表</summary>
    public List<string> Story { get; set; } = new();
}
```

**JSON 範例**:

```json
{
  "main": "/images/dinosaurs/tyrannosaurus/main.png",
  "story": [
    "/images/dinosaurs/tyrannosaurus/story-1.png"
  ]
}
```

---

### 3. Dinosaur（恐龍）

**用途**: 核心實體，儲存單隻恐龍的所有資訊

| 欄位 | 型別 | 必填 | 說明 | 驗證規則 |
|------|------|------|------|----------|
| `Id` | `string` | ✅ | 唯一識別碼（英文小寫） | 非空、僅限英數字和連字號 |
| `Name` | `LocalizedText` | ✅ | 恐龍名稱 | 非空 |
| `Period` | `LocalizedText` | ✅ | 生活時期 | 非空 |
| `Diet` | `LocalizedText` | ✅ | 食性 | 非空 |
| `Location` | `LocalizedText` | ✅ | 發現地點 | 非空 |
| `Size` | `LocalizedText` | ❌ | 體型描述 | - |
| `Description` | `LocalizedText` | ✅ | 介紹文字 | 非空、中英文各 ≤200 字 |
| `Story` | `LocalizedText` | ❌ | 相關小故事 | 中英文各 ≤150 字 |
| `Images` | `DinosaurImages` | ✅ | 圖片資訊 | 主圖必填 |

**C# 定義**:

```csharp
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
```

**JSON 範例（完整恐龍資料）**:

```json
{
  "id": "tyrannosaurus",
  "name": {
    "zh": "暴龍",
    "en": "Tyrannosaurus Rex"
  },
  "period": {
    "zh": "白堊紀晚期（約6800萬年前）",
    "en": "Late Cretaceous (about 68 million years ago)"
  },
  "diet": {
    "zh": "肉食性",
    "en": "Carnivore"
  },
  "location": {
    "zh": "北美洲",
    "en": "North America"
  },
  "size": {
    "zh": "身長約12公尺，高約4公尺，體重約9噸",
    "en": "About 12m long, 4m tall, weighing 9 tons"
  },
  "description": {
    "zh": "暴龍是最有名的恐龍，牠是白堊紀晚期最強大的掠食者！暴龍有著巨大的頭部和鋒利的牙齒，咬合力超強，可以輕鬆咬碎骨頭。雖然牠的前肢很小，但強壯的後腿讓牠跑得很快喔！",
    "en": "T-Rex is the most famous dinosaur and the mightiest predator of the Late Cretaceous! With its massive head and sharp teeth, T-Rex had an incredibly powerful bite that could crush bones easily. Though its arms were tiny, its strong legs made it a fast runner!"
  },
  "story": {
    "zh": "小暴龍雷雷今天很開心，因為媽媽帶牠去河邊玩。雷雷看到水裡有魚，想要抓來當點心，但前肢太短搆不到。媽媽笑著說：「用你的大嘴巴呀！」雷雷張開大嘴，一口就叼起了魚，開心地笑了。",
    "en": "Little T-Rex Ray was happy today because mom took him to the river. Ray saw fish in the water and wanted to catch a snack, but his arms were too short to reach. Mom laughed and said, 'Use your big mouth!' Ray opened wide and caught the fish in one bite, smiling happily."
  },
  "images": {
    "main": "/images/dinosaurs/tyrannosaurus/main.png",
    "story": ["/images/dinosaurs/tyrannosaurus/story-1.png"]
  }
}
```

---

### 4. DinosaurData（恐龍資料容器）

**用途**: JSON 檔案的根物件

| 欄位 | 型別 | 必填 | 說明 |
|------|------|------|------|
| `Dinosaurs` | `List<Dinosaur>` | ✅ | 恐龍列表 |

**C# 定義**:

```csharp
namespace StoryBook.Models;

/// <summary>
/// 恐龍資料容器，對應 JSON 檔案根物件
/// </summary>
public class DinosaurData
{
    /// <summary>恐龍列表</summary>
    public List<Dinosaur> Dinosaurs { get; set; } = new();
}
```

**JSON 結構**:

```json
{
  "dinosaurs": [
    { /* Dinosaur 1 */ },
    { /* Dinosaur 2 */ },
    ...
  ]
}
```

---

## 實體關係圖

```text
┌─────────────────────────────────────────────────────────────┐
│                      DinosaurData                           │
│  ┌───────────────────────────────────────────────────────┐  │
│  │                   dinosaurs[]                         │  │
│  └───────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1:N
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                        Dinosaur                             │
├─────────────────────────────────────────────────────────────┤
│  id: string                                                 │
│  name: LocalizedText                                        │
│  period: LocalizedText                                      │
│  diet: LocalizedText                                        │
│  location: LocalizedText                                    │
│  size: LocalizedText?                                       │
│  description: LocalizedText                                 │
│  story: LocalizedText?                                      │
│  images: DinosaurImages                                     │
└─────────────────────────────────────────────────────────────┘
         │                                    │
         │ 1:1                                │ 1:1
         ▼                                    ▼
┌─────────────────────┐            ┌─────────────────────┐
│   LocalizedText     │            │   DinosaurImages    │
├─────────────────────┤            ├─────────────────────┤
│  zh: string         │            │  main: string       │
│  en: string         │            │  story: string[]    │
└─────────────────────┘            └─────────────────────┘
```

---

## 驗證規則

### Dinosaur 驗證

```csharp
using System.ComponentModel.DataAnnotations;

public class DinosaurValidator
{
    public static ValidationResult? ValidateDescription(LocalizedText description)
    {
        if (description.Zh.Length > 200)
            return new ValidationResult("中文介紹不可超過 200 字");
        if (description.En.Length > 200)
            return new ValidationResult("英文介紹不可超過 200 字");
        return ValidationResult.Success;
    }
    
    public static ValidationResult? ValidateStory(LocalizedText? story)
    {
        if (story is null) return ValidationResult.Success;
        if (story.Zh.Length > 150)
            return new ValidationResult("中文故事不可超過 150 字");
        if (story.En.Length > 150)
            return new ValidationResult("英文故事不可超過 150 字");
        return ValidationResult.Success;
    }
    
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

### IDinosaurService

```csharp
namespace StoryBook.Services;

/// <summary>
/// 恐龍服務介面，提供恐龍資料存取
/// </summary>
public interface IDinosaurService
{
    /// <summary>取得所有恐龍</summary>
    Task<IEnumerable<Dinosaur>> GetAllAsync();
    
    /// <summary>根據 Id 取得單隻恐龍</summary>
    Task<Dinosaur?> GetByIdAsync(string id);
    
    /// <summary>搜尋恐龍（比對名稱和介紹）</summary>
    /// <param name="keyword">搜尋關鍵字</param>
    /// <param name="language">語言代碼（zh 或 en）</param>
    Task<IEnumerable<Dinosaur>> SearchAsync(string keyword, string language);
    
    /// <summary>取得恐龍總數</summary>
    Task<int> GetCountAsync();
    
    /// <summary>根據索引取得恐龍（換頁用）</summary>
    Task<Dinosaur?> GetByIndexAsync(int index);
}
```

### IJsonDataService

```csharp
namespace StoryBook.Services;

/// <summary>
/// JSON 資料服務介面，處理 JSON 檔案讀取
/// </summary>
public interface IJsonDataService
{
    /// <summary>載入恐龍資料</summary>
    Task<DinosaurData> LoadDinosaursAsync();
}
```

---

## 檔案位置

| 檔案 | 路徑 | 說明 |
|------|------|------|
| 資料模型 | `StoryBook/Models/` | C# 類別定義 |
| JSON 資料 | `StoryBook/wwwroot/data/dinosaurs.json` | 恐龍資料 |
| 服務介面 | `StoryBook/Services/` | 服務定義與實作 |

---

## 附錄：完整 JSON Schema

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "DinosaurData",
  "type": "object",
  "required": ["dinosaurs"],
  "properties": {
    "dinosaurs": {
      "type": "array",
      "items": {
        "type": "object",
        "required": ["id", "name", "period", "diet", "location", "description", "images"],
        "properties": {
          "id": {
            "type": "string",
            "pattern": "^[a-z0-9\\-]+$"
          },
          "name": { "$ref": "#/definitions/LocalizedText" },
          "period": { "$ref": "#/definitions/LocalizedText" },
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
