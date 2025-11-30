# 快速入門指南：恐龍故事書系統

**功能分支**: `001-dinosaur-storybook`  
**日期**: 2025-11-30

## 先決條件

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- Visual Studio Code 或 Visual Studio 2022
- Git

## 快速開始

### 1. 複製專案並切換分支

```bash
git clone <repository-url>
cd StoryBook
git checkout 001-dinosaur-storybook
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
├── StoryBook/                # 主要 Web 應用程式
│   ├── Models/               # 資料模型
│   ├── Services/             # 業務邏輯服務
│   ├── Pages/                # Razor Pages
│   │   └── Dinosaurs/        # 恐龍相關頁面
│   └── wwwroot/              # 靜態資源
│       ├── data/             # JSON 資料
│       ├── images/           # 圖片資源
│       ├── css/              # 樣式表
│       └── js/               # JavaScript
│
├── StoryBook.Tests/          # 測試專案
│   ├── Unit/                 # 單元測試
│   └── Integration/          # 整合測試
│
└── specs/                    # 功能規格文件
    └── 001-dinosaur-storybook/
        ├── spec.md           # 功能規格
        ├── plan.md           # 實作計畫
        ├── research.md       # 研究文件
        ├── data-model.md     # 資料模型
        ├── quickstart.md     # 本文件
        └── contracts/        # API 契約
```

## 開發工作流程

### 新增恐龍資料

1. 編輯 `wwwroot/data/dinosaurs.json`
2. 新增恐龍物件（參照現有資料格式）
3. 將對應圖片放入 `wwwroot/images/dinosaurs/<dinosaur-id>/`

**JSON 格式範例**:

```json
{
  "id": "new-dinosaur",
  "name": { "zh": "新恐龍", "en": "New Dinosaur" },
  "period": { "zh": "侏羅紀", "en": "Jurassic" },
  "diet": { "zh": "草食性", "en": "Herbivore" },
  "location": { "zh": "亞洲", "en": "Asia" },
  "description": { "zh": "介紹文字...", "en": "Description..." },
  "images": { "main": "/images/dinosaurs/new-dinosaur/main.png" }
}
```

### 新增頁面

1. 在 `Pages/` 目錄建立 `.cshtml` 和 `.cshtml.cs` 檔案
2. 注入需要的服務（如 `IDinosaurService`）
3. 實作 `OnGetAsync()` 方法

### 新增服務

1. 在 `Services/` 目錄建立介面和實作類別
2. 在 `Program.cs` 註冊服務：

```csharp
builder.Services.AddSingleton<IMyService, MyService>();
```

### 撰寫測試

**單元測試範例**:

```csharp
[Fact]
public async Task GetByIdAsync_ExistingId_ReturnsDinosaur()
{
    // Arrange
    var service = CreateService();
    
    // Act
    var result = await service.GetByIdAsync("tyrannosaurus");
    
    // Assert
    Assert.NotNull(result);
    Assert.Equal("tyrannosaurus", result.Id);
}
```

**整合測試範例**:

```csharp
[Fact]
public async Task DinosaurPage_ReturnsSuccessAndCorrectContent()
{
    var response = await _client.GetAsync("/Dinosaurs");
    
    response.EnsureSuccessStatusCode();
    var content = await response.Content.ReadAsStringAsync();
    Assert.Contains("恐龍介紹", content);
}
```

## 常用命令

| 命令 | 說明 |
|------|------|
| `dotnet build` | 建構專案 |
| `dotnet run` | 執行應用程式 |
| `dotnet test` | 執行測試 |
| `dotnet watch run` | 熱重載模式執行 |
| `dotnet clean` | 清除建構輸出 |

## 環境設定

### appsettings.Development.json

```json
{
  "Logging": {
    "LogLevel": {
      "Default": "Information",
      "Microsoft.AspNetCore": "Warning"
    }
  },
  "DinosaurData": {
    "JsonPath": "wwwroot/data/dinosaurs.json"
  }
}
```

### 使用 Hot Reload

```bash
dotnet watch run
```

修改程式碼後會自動重新編譯和重新載入。

## 瀏覽器測試

### 測試清單

1. **首頁**
   - [ ] 顯示「恐龍介紹」按鈕
   - [ ] 點擊按鈕進入恐龍介紹頁面

2. **恐龍介紹頁面**
   - [ ] 顯示恐龍圖片
   - [ ] 顯示名稱、時期、食性、地點
   - [ ] 上/下一頁按鈕正常運作
   - [ ] 第一隻時「上一頁」停用
   - [ ] 最後一隻時「下一頁」停用

3. **搜尋功能**
   - [ ] 輸入關鍵字即時過濾
   - [ ] 點擊結果進入該恐龍

4. **圖片大圖**
   - [ ] 點擊圖片開啟大圖
   - [ ] 點擊外部區域關閉

5. **語言切換**
   - [ ] 切換至英文
   - [ ] 重新整理後保持語言設定

## 常見問題

### Q: JSON 檔案路徑錯誤？

確認 `appsettings.json` 中的路徑設定正確，且檔案存在於 `wwwroot/data/` 目錄。

### Q: 圖片無法顯示？

1. 確認圖片存在於 `wwwroot/images/dinosaurs/` 目錄
2. 確認 JSON 中的路徑以 `/` 開頭
3. 檢查瀏覽器開發者工具的 Network 頁籤

### Q: 測試失敗？

```bash
# 查看詳細錯誤訊息
dotnet test --verbosity detailed

# 執行特定測試
dotnet test --filter "ClassName=DinosaurServiceTests"
```

### Q: 如何新增測試資料？

在 `StoryBook.Tests/TestData/` 目錄建立 `test-dinosaurs.json`，格式與主資料相同。

## 相關文件

- [功能規格](./spec.md)
- [實作計畫](./plan.md)
- [研究文件](./research.md)
- [資料模型](./data-model.md)
- [API 契約](./contracts/dinosaurs-api.yaml)

## 聯絡方式

如有問題，請建立 GitHub Issue 或聯繫專案維護者。
