# Implementation Plan: 恐龍故事書系統

**Branch**: `001-dinosaur-storybook` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-dinosaur-storybook/spec.md`

**Note**: 此範本由 `/speckit.plan` 命令填寫。

## Summary

建立一個兒童友善的恐龍故事書網站，使用 ASP.NET Core 8.0 Razor Pages 架構。網站將顯示恐龍介紹（含圖片、生活時期、食性、發現地點），支援換頁瀏覽、圖片大圖檢視、即時搜尋、小故事展示，以及中英文語言切換功能。資料儲存採用 JSON 檔案（練習用途），前端使用原生 JavaScript 搭配 Bootstrap 5 實現可愛的兒童繪本風格介面。

## Technical Context

**Language/Version**: C# 13 / .NET 8.0 (ASP.NET Core 8.0)  
**Primary Dependencies**: ASP.NET Core Razor Pages, Bootstrap 5, jQuery (已包含在專案中)  
**Storage**: JSON 檔案 (`wwwroot/data/dinosaurs.json`) - 練習用途，不使用資料庫  
**Testing**: xUnit + Moq (單元測試) + WebApplicationFactory (整合測試)；備案：TestServer 或 Mock-based 測試  
**Target Platform**: 桌面瀏覽器 (Chrome, Firefox, Safari, Edge) - 不需考慮手機版  
**Project Type**: Web Application (Razor Pages)  
**Performance Goals**: API p95 回應時間 < 200ms，頁面載入 < 3 秒，換頁 < 1 秒  
**Constraints**: 單一請求記憶體使用 < 100MB，恐龍介紹 ≤ 200 字，純靜態內容展示  
**Scale/Scope**: 5-8 隻恐龍資料，2 種語言（中文/英文），約 5 個頁面

### 前端技術選擇

**推薦方案**: 原生 JavaScript + Bootstrap 5
- **理由**: 專案已包含 Bootstrap 和 jQuery，兒童故事書網站互動需求簡單
- **優點**: 無需額外設定建構工具、學習曲線低、效能好
- **替代方案考量**: 若需更複雜狀態管理，可考慮 Alpine.js（輕量）或 Vue.js（漸進式）

## Constitution Check

*GATE: 必須在 Phase 0 研究前通過。Phase 1 設計後重新檢查。*

### Pre-Design 檢查 (Phase 0 前)

| 原則 | 狀態 | 說明 |
|------|------|------|
| I. 程式碼品質至上 | ✅ 通過 | 將使用 C# 13 最新功能、檔案範圍命名空間、XML 文件註解 |
| II. 測試優先開發 | ✅ 通過 | 規劃 xUnit + Moq 單元測試、WebApplicationFactory 整合測試 |
| III. 使用者體驗一致性 | ✅ 通過 | 使用 Bootstrap 5 統一設計、兒童友善大按鈕、清楚錯誤訊息 |
| IV. 效能與延展性 | ✅ 通過 | JSON 檔案讀取輕量、靜態內容無 N+1 問題、目標 < 200ms |
| V. 可觀察性與監控 | ⚠️ 簡化 | 練習專案，使用基本日誌記錄，暫不整合 Application Insights |
| VI. 安全優先 | ✅ 通過 | 無使用者認證需求、輸入驗證（搜尋框）、無敏感資料 |

### 潛在違規說明

- **V. 可觀察性**: 作為練習專案，暫時簡化監控需求，僅使用內建日誌。若後續擴展可加入 Serilog。

### Post-Design 檢查 (Phase 1 後)

| 原則 | 狀態 | 說明 |
|------|------|------|
| I. 程式碼品質至上 | ✅ 通過 | data-model.md 定義清晰的 C# 類別、XML 文件註解、驗證規則 |
| II. 測試優先開發 | ✅ 通過 | research.md 規劃完整測試策略、quickstart.md 包含測試指引 |
| III. 使用者體驗一致性 | ✅ 通過 | contracts/ 定義一致的 API 回應格式、RFC 7807 錯誤處理 |
| IV. 效能與延展性 | ✅ 通過 | JSON 快取策略、Singleton 服務、圖片延遲載入 |
| V. 可觀察性與監控 | ⚠️ 簡化 | 使用基本日誌，符合練習專案需求 |
| VI. 安全優先 | ✅ 通過 | 輸入驗證（搜尋關鍵字）、無敏感資料暴露 |

**結論**: 所有憲章原則已通過或有合理說明，可進入 Phase 2 任務規劃。

## Project Structure

### Documentation (本功能)

```text
specs/001-dinosaur-storybook/
├── spec.md              # 功能規格
├── plan.md              # 本檔案 (/speckit.plan 輸出)
├── research.md          # Phase 0 輸出
├── data-model.md        # Phase 1 輸出
├── quickstart.md        # Phase 1 輸出
├── contracts/           # Phase 1 輸出 (API 契約)
│   └── dinosaurs-api.yaml
├── checklists/
│   └── requirements.md  # 需求檢查清單
└── tasks.md             # Phase 2 輸出 (/speckit.tasks - 非本命令產生)
```

### Source Code (專案根目錄)

```text
StoryBook/
├── Program.cs                    # 應用程式進入點
├── StoryBook.csproj              # 專案設定檔
├── appsettings.json              # 應用程式設定
├── appsettings.Development.json  # 開發環境設定
│
├── Models/                       # 資料模型
│   ├── Dinosaur.cs               # 恐龍實體
│   └── LocalizedText.cs          # 多語言文字
│
├── Services/                     # 業務邏輯服務
│   ├── IDinosaurService.cs       # 恐龍服務介面
│   ├── DinosaurService.cs        # 恐龍服務實作
│   └── IJsonDataService.cs       # JSON 資料服務介面
│   └── JsonDataService.cs        # JSON 資料服務實作
│
├── Pages/                        # Razor Pages
│   ├── Index.cshtml              # 首頁
│   ├── Index.cshtml.cs
│   ├── Dinosaurs/                # 恐龍相關頁面
│   │   ├── Index.cshtml          # 恐龍介紹頁面
│   │   ├── Index.cshtml.cs
│   │   └── _DinosaurCard.cshtml  # 恐龍卡片部分視圖
│   ├── Shared/
│   │   ├── _Layout.cshtml        # 主版面配置
│   │   └── _LanguageSwitcher.cshtml # 語言切換元件
│   ├── _ViewImports.cshtml
│   └── _ViewStart.cshtml
│
├── wwwroot/                      # 靜態資源
│   ├── data/
│   │   └── dinosaurs.json        # 恐龍資料 (中英文)
│   ├── images/
│   │   ├── dinosaurs/            # 恐龍圖片
│   │   │   ├── tyrannosaurus/
│   │   │   │   ├── main.png
│   │   │   │   └── story-1.png
│   │   │   └── ... (其他恐龍)
│   │   └── placeholder.png       # 預設佔位圖
│   ├── css/
│   │   ├── site.css              # 全站樣式
│   │   └── dinosaurs.css         # 恐龍頁面專用樣式
│   └── js/
│       ├── site.js               # 全站腳本
│       └── dinosaurs.js          # 恐龍頁面功能 (搜尋、大圖、語言切換)
│
└── Properties/
    └── launchSettings.json

StoryBook.Tests/                  # 測試專案
├── StoryBook.Tests.csproj
├── Unit/                         # 單元測試
│   ├── Services/
│   │   ├── DinosaurServiceTests.cs
│   │   └── JsonDataServiceTests.cs
│   └── Models/
│       └── DinosaurTests.cs
├── Integration/                  # 整合測試
│   ├── DinosaurPagesTests.cs
│   └── ApiEndpointTests.cs
└── TestData/                     # 測試用資料
    └── test-dinosaurs.json
```

**Structure Decision**: 採用 ASP.NET Core Razor Pages 標準結構，以 Feature Folders 概念組織恐龍相關頁面於 `Pages/Dinosaurs/`。Services 層封裝 JSON 資料存取邏輯，便於測試和未來擴展。測試專案獨立於主專案，使用 xUnit + Moq。

## Complexity Tracking

> **僅在 Constitution Check 有需要說明的違規時填寫**

| 違規項目 | 需要原因 | 拒絕更簡單替代方案的理由 |
|----------|----------|--------------------------|
| V. 可觀察性簡化 | 練習專案，監控需求低 | 完整 Application Insights 整合對學習目的過於複雜，基本日誌已足夠 |

---

## Phase 0 輸出

完成後請見 [research.md](./research.md)

## Phase 1 輸出

完成後請見：
- [data-model.md](./data-model.md)
- [quickstart.md](./quickstart.md)
- [contracts/](./contracts/)
