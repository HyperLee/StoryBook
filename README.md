# 🦕 恐龍故事書 (Dinosaur StoryBook)

[![.NET](https://img.shields.io/badge/.NET-8.0-512BD4?style=flat-square&logo=dotnet)](https://dotnet.microsoft.com/)
[![ASP.NET Core](https://img.shields.io/badge/ASP.NET%20Core-Razor%20Pages-512BD4?style=flat-square)](https://docs.microsoft.com/aspnet/core/razor-pages/)
[![License](https://img.shields.io/badge/License-MIT-yellow?style=flat-square)](LICENSE)

一個專為兒童設計的恐龍介紹互動網站，透過可愛的圖片、有趣的小故事，讓孩子輕鬆學習恐龍知識！

![恐龍故事書首頁](docs/images/homepage-preview.png)

## ✨ 功能特色

- **恐龍介紹瀏覽** - 精美的恐龍卡片，包含名稱、生活時期、食性、發現地點等資訊
- **多語言支援** - 支援中文 / 英文即時切換，適合不同語言背景的孩子
- **即時搜尋** - 輸入關鍵字即時過濾恐龍，快速找到想看的內容
- **可愛小故事** - 每隻恐龍都有專屬的趣味小故事，增加學習樂趣
- **圖片放大檢視** - 點擊圖片可查看大圖，細看恐龍細節
- **響應式設計** - 適配各種裝置尺寸，手機、平板、電腦都能舒適瀏覽
- **兒童友善介面** - 大按鈕、明顯導覽，孩子也能輕鬆操作

## 🦖 收錄恐龍

目前收錄了 15 種經典恐龍：

| 恐龍 | 英文名 | 時期 | 食性 |
|------|--------|------|------|
| 🦖 暴龍 | Tyrannosaurus Rex | 白堊紀晚期 | 肉食性 |
| 🦕 三角龍 | Triceratops | 白堊紀晚期 | 草食性 |
| 🦕 劍龍 | Stegosaurus | 侏羅紀晚期 | 草食性 |
| 🦕 腕龍 | Brachiosaurus | 侏羅紀晚期 | 草食性 |
| 🦖 迅猛龍 | Velociraptor | 白堊紀晚期 | 肉食性 |
| 🦅 無齒翼龍 | Pteranodon | 白堊紀晚期 | 肉食性（魚類） |
| 🛡️ 甲龍 | Ankylosaurus | 白堊紀晚期 | 草食性 |
| 🎺 副櫛龍 | Parasaurolophus | 白堊紀晚期 | 草食性 |
| ⛵ 棘龍 | Spinosaurus | 白堊紀中期 | 肉食性 |
| 🦕 梁龍 | Diplodocus | 侏羅紀晚期 | 草食性 |
| 🦖 異特龍 | Allosaurus | 侏羅紀晚期 | 肉食性 |
| 👆 禽龍 | Iguanodon | 白堊紀早期 | 草食性 |
| 🤕 厚頭龍 | Pachycephalosaurus | 白堊紀晚期 | 草食性 |
| 🐂 牛龍 | Carnotaurus | 白堊紀晚期 | 肉食性 |
| 🌊 滄龍 | Mosasaurus | 白堊紀晚期 | 肉食性 |

## 🚀 快速開始

### 環境需求

- [.NET 8.0 SDK](https://dotnet.microsoft.com/download/dotnet/8.0) 或更高版本

### 執行專案

1. 複製專案到本機：

   ```bash
   git clone https://github.com/HyperLee/StoryBook.git
   cd StoryBook
   ```

2. 執行應用程式：

   ```bash
   dotnet run --project StoryBook/StoryBook.csproj
   ```

3. 開啟瀏覽器，前往 `https://localhost:5001` 或 `http://localhost:5000`

> [!TIP]
> 您也可以使用 `dotnet watch` 來啟動開發伺服器，程式碼變更後會自動重新載入。

## 🏗️ 專案架構

```text
StoryBook/
├── Models/                 # 資料模型
│   ├── Dinosaur.cs        # 恐龍實體
│   ├── DinosaurData.cs    # 恐龍資料集
│   ├── DinosaurImages.cs  # 圖片資訊
│   └── LocalizedText.cs   # 多語言文字
├── Pages/                  # Razor Pages 頁面
│   ├── Index.cshtml       # 首頁
│   ├── Dinosaurs/         # 恐龍介紹頁面
│   └── Shared/            # 共用元件 (Layout, 語言切換器)
├── Services/               # 服務層
│   ├── DinosaurService.cs # 恐龍資料服務
│   └── JsonDataService.cs # JSON 資料讀取服務
├── wwwroot/               # 靜態資源
│   ├── css/               # 樣式表
│   ├── js/                # JavaScript
│   ├── data/              # JSON 資料檔
│   │   └── dinosaurs.json # 恐龍資料
│   └── images/            # 恐龍圖片
└── Program.cs             # 應用程式進入點
```

## 🛠️ 技術棧

- **後端框架**: ASP.NET Core 8.0 Razor Pages
- **前端**: HTML5, CSS3, JavaScript (原生)
- **UI 框架**: Bootstrap 5
- **日誌**: Serilog (Console + File)
- **資料格式**: JSON

## 📝 新增恐龍資料

若要新增新的恐龍，請編輯 `wwwroot/data/dinosaurs.json`：

```json
{
  "id": "your-dinosaur-id",
  "name": {
    "zh": "恐龍中文名",
    "en": "Dinosaur English Name"
  },
  "period": {
    "zh": "生活時期（中文）",
    "en": "Living Period (English)"
  },
  "diet": {
    "zh": "食性（中文）",
    "en": "Diet (English)"
  },
  "location": {
    "zh": "發現地點（中文）",
    "en": "Discovery Location (English)"
  },
  "size": {
    "zh": "體型資訊（中文）",
    "en": "Size Information (English)"
  },
  "description": {
    "zh": "恐龍介紹文字...",
    "en": "Dinosaur description..."
  },
  "story": {
    "zh": "小故事內容...",
    "en": "Short story content..."
  },
  "images": {
    "main": "/images/dinosaurs/your-dinosaur-id/main.svg",
    "story": ["/images/dinosaurs/your-dinosaur-id/story-1.svg"]
  }
}
```

然後在 `wwwroot/images/dinosaurs/` 下建立對應的圖片資料夾。

## 🔧 開發指令

```bash
# 建構專案
dotnet build

# 執行專案
dotnet run --project StoryBook/StoryBook.csproj

# 開發模式（自動重載）
dotnet watch --project StoryBook/StoryBook.csproj

# 發佈專案
dotnet publish -c Release
```

## 📚 相關文件

- [功能規格書](specs/001-dinosaur-storybook/spec.md) - 詳細的功能需求說明
- [資料模型設計](specs/001-dinosaur-storybook/data-model.md) - 資料結構設計
- [API 合約](specs/001-dinosaur-storybook/contracts/dinosaurs-api.yaml) - API 介面定義

## 🤝 貢獻

歡迎提交 Issue 或 Pull Request！

## 📄 授權

本專案採用 MIT 授權條款 - 詳見 [LICENSE](LICENSE) 檔案。
