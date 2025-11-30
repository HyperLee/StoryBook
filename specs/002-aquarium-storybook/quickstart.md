# 快速入門指南：水族館動物介紹故事書

**功能分支**: `002-aquarium-storybook`  
**日期**: 2025-11-30

## 先決條件

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Visual Studio Code 或 Visual Studio 2022
- Git

## 快速開始

### 1. 切換至功能分支

```bash
cd StoryBook
git checkout 002-aquarium-storybook
```

### 2. 還原相依套件

```bash
dotnet restore
```

### 3. 執行應用程式

```bash
cd StoryBook
dotnet run
```

應用程式將在 `https://localhost:5001` 或 `http://localhost:5000` 啟動。

### 4. 執行測試

```bash
# 執行所有測試
dotnet test

# 執行並顯示詳細輸出
dotnet test --verbosity normal

# 執行特定測試專案
dotnet test StoryBook.Tests/StoryBook.Tests.csproj
```

## 專案結構

```text
StoryBook/
├── StoryBook/                      # 主要 Web 應用程式
│   ├── Models/                     # 資料模型
│   │   ├── LocalizedText.cs        # 多語言文字（共用）
│   │   ├── AquariumAnimal.cs       # 水族館動物（新增）
│   │   ├── AquariumAnimalImages.cs # 動物圖片（新增）
│   │   ├── AquariumAnimalData.cs   # 資料容器（新增）
│   │   └── HabitatZone.cs          # 區域分類（新增）
│   ├── Services/                   # 業務邏輯服務
│   │   ├── IAquariumService.cs     # 水族館服務介面（新增）
│   │   ├── AquariumService.cs      # 水族館服務實作（新增）
│   │   ├── IJsonDataService.cs     # JSON 服務介面（擴充）
│   │   └── JsonDataService.cs      # JSON 服務實作（擴充）
│   ├── Pages/                      # Razor Pages
│   │   ├── Index.cshtml            # 首頁（修改：新增水族館入口）
│   │   └── Aquarium/               # 水族館相關頁面（新增）
│   │       ├── Index.cshtml        # 水族館故事書主頁
│   │       ├── Index.cshtml.cs
│   │       └── _AnimalCard.cshtml  # 動物卡片 Partial View
│   └── wwwroot/                    # 靜態資源
│       ├── data/
│       │   └── aquarium.json       # 水族館動物資料（新增）
│       ├── images/
│       │   └── aquarium/           # 水族館動物圖片（新增）
│       │       ├── clownfish/
│       │       ├── dolphin/
│       │       └── ...
│       ├── css/
│       │   └── aquarium.css        # 水族館專用樣式（新增）
│       └── js/
│           └── aquarium.js         # 水族館互動功能（新增）
│
├── StoryBook.Tests/                # 測試專案
│   ├── Unit/
│   │   └── Services/
│   │       └── AquariumServiceTests.cs   # 新增
│   └── Integration/
│       └── Pages/
│           └── AquariumPagesTests.cs     # 新增
│
└── specs/                          # 功能規格文件
    └── 002-aquarium-storybook/
        ├── spec.md                 # 功能規格
        ├── plan.md                 # 實作計畫
        ├── research.md             # 研究文件
        ├── data-model.md           # 資料模型
        ├── quickstart.md           # 本文件
        ├── contracts/
        │   └── aquarium-api.yaml   # API 契約
        └── checklists/
            └── requirements.md     # 需求檢查表
```

## 開發工作流程

### 新增水族館動物資料

1. 編輯 `wwwroot/data/aquarium.json`
2. 新增動物物件（參照現有資料格式）
3. 將對應圖片放入 `wwwroot/images/aquarium/<animal-id>/`

**JSON 格式範例**:

```json
{
  "id": "new-animal",
  "name": { "zh": "新動物", "en": "New Animal" },
  "habitatZone": "saltwater",
  "habitat": { "zh": "海洋環境", "en": "Ocean environment" },
  "diet": { "zh": "雜食性", "en": "Omnivore" },
  "location": { "zh": "太平洋", "en": "Pacific Ocean" },
  "description": { "zh": "介紹文字（不超過200字）...", "en": "Description (max 200 chars)..." },
  "story": { "zh": "小故事（100-150字）...", "en": "Short story (100-150 chars)..." },
  "images": { "main": "/images/aquarium/new-animal/main.png" }
}
```

### 生活區域分類

| 區域 | 英文代碼 | 說明 |
|------|----------|------|
| 淡水 | `freshwater` | 河流、湖泊等淡水環境 |
| 海水 | `saltwater` | 一般海洋環境 |
| 深海 | `deepsea` | 深海區域 |
| 珊瑚礁 | `coralreef` | 珊瑚礁區域 |
| 極地 | `polar` | 極地海域 |

### 新增頁面

1. 在 `Pages/Aquarium/` 目錄建立 `.cshtml` 和 `.cshtml.cs` 檔案
2. 注入 `IAquariumService` 服務
3. 實作 `OnGetAsync()` 方法

**範例**:

```csharp
public class IndexModel : PageModel
{
    private readonly IAquariumService _aquariumService;

    public IndexModel(IAquariumService aquariumService)
    {
        _aquariumService = aquariumService;
    }

    public IEnumerable<AquariumAnimal> Animals { get; private set; } = [];

    public async Task OnGetAsync()
    {
        Animals = await _aquariumService.GetAllAsync();
    }
}
```

### 撰寫測試

**單元測試範例**:

```csharp
[Fact]
public async Task GetByIdAsync_ExistingId_ReturnsAnimal()
{
    // Arrange
    var service = CreateService();
    
    // Act
    var result = await service.GetByIdAsync("clownfish");
    
    // Assert
    Assert.NotNull(result);
    Assert.Equal("clownfish", result.Id);
}

[Fact]
public async Task GetByHabitatZoneAsync_CoralReef_ReturnsFilteredAnimals()
{
    // Arrange
    var service = CreateService();
    
    // Act
    var result = await service.GetByHabitatZoneAsync(HabitatZone.CoralReef);
    
    // Assert
    Assert.All(result, animal => 
        Assert.Equal(HabitatZone.CoralReef, animal.HabitatZone));
}
```

**整合測試範例**:

```csharp
[Fact]
public async Task AquariumPage_ReturnsSuccessAndCorrectContent()
{
    var response = await _client.GetAsync("/Aquarium");
    
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    Assert.Contains("水族館", content);
}
```

## 常用命令

| 命令 | 說明 |
|------|------|
| `dotnet build` | 建構專案 |
| `dotnet run` | 執行應用程式 |
| `dotnet test` | 執行所有測試 |
| `dotnet watch run` | 熱重載模式執行 |
| `dotnet clean` | 清理建構輸出 |

## 與恐龍故事書的差異

| 功能 | 恐龍故事書 | 水族館故事書 |
|------|------------|--------------|
| 分類方式 | 無 | 生活區域（淡水/海水/深海等） |
| 時期欄位 | `Period`（恐龍時期） | `Habitat`（生活環境） |
| 色系 | 綠色/土色系 | 藍色/海洋色系 |
| 搜尋欄位 | 名稱、介紹 | 名稱、生活環境、食性 |

## 除錯提示

### 常見問題

1. **JSON 載入失敗**
   - 確認 `wwwroot/data/aquarium.json` 檔案存在
   - 檢查 JSON 格式是否正確

2. **圖片未顯示**
   - 確認圖片路徑正確
   - 圖片應放置於 `wwwroot/images/aquarium/<animal-id>/`

3. **服務未註冊**
   - 確認 `Program.cs` 中已註冊 `IAquariumService`：
   ```csharp
   builder.Services.AddSingleton<IAquariumService, AquariumService>();
   ```

### 日誌檢視

- 開發環境日誌輸出至 Console
- 檔案日誌位於 `StoryBook/logs/` 目錄

## 相關文件

- [功能規格](./spec.md)
- [實作計畫](./plan.md)
- [研究文件](./research.md)
- [資料模型](./data-model.md)
- [API 契約](./contracts/aquarium-api.yaml)
- [需求檢查表](./checklists/requirements.md)
