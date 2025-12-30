# Implementation Plan: 水族館動物介紹故事書

**Branch**: `002-aquarium-storybook` | **Date**: 2025-11-30 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/002-aquarium-storybook/spec.md`

## Summary

建立水族館動物介紹故事書系統，採用童書翻頁模式展示 15 種水族館動物。系統參照現有恐龍故事書架構，新增生活區域分類（淡水/海水/深海）功能，支援中英文雙語、即時搜尋、Lightbox 大圖檢視和換頁瀏覽。使用 ASP.NET Core Razor Pages + Bootstrap 5 + 原生 JavaScript 實作。

## Technical Context

**Language/Version**: C# 12 / .NET 8.0 (ASP.NET Core 8.0)  
**Primary Dependencies**: ASP.NET Core Razor Pages, Bootstrap 5, jQuery (已包含在專案中), Serilog  
**Storage**: JSON 檔案 (`wwwroot/data/aquarium.json`) - 練習用途，不使用資料庫  
**Testing**: xUnit + Moq (單元測試) + WebApplicationFactory (整合測試)  
**Logging**: Serilog（結構化日誌）+ Console Sink + File Sink  
**Target Platform**: 桌面瀏覽器 (Chrome, Firefox, Safari, Edge) - 不需考慮手機版  
**Project Type**: Web Application (Razor Pages)  
**Performance Goals**: API p95 回應時間 < 200ms，頁面載入 < 3 秒，換頁 < 1 秒  
**Constraints**: 單一請求記憶體使用 < 100MB，動物介紹 ≤ 200 字，純靜態內容展示  
**Scale/Scope**: 15 隻動物資料，2 種語言（中文/英文），約 5 個頁面

### 前端技術選擇

**推薦方案**: 原生 JavaScript + Bootstrap 5
- **理由**: 專案已包含 Bootstrap 和 jQuery，兒童故事書網站互動需求簡單
- **優點**: 無需額外設定建構工具、學習曲線低、效能好

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| 原則 | 狀態 | 說明 |
|------|------|------|
| I. 程式碼品質至上 | ✅ PASS | 遵循 C# 13 最佳實踐、XML 文件註解、檔案範圍命名空間 |
| II. 測試優先開發 | ✅ PASS | 使用 xUnit + Moq + WebApplicationFactory，遵循 TDD 流程 |
| III. 使用者體驗一致性 | ✅ PASS | 參照恐龍故事書 UI 風格，使用 Bootstrap 5，支援無障礙設計 |
| IV. 效能與延展性 | ✅ PASS | JSON 快取於 Singleton 服務，圖片延遲載入，靜態檔案快取 |
| V. 可觀察性與監控 | ✅ PASS | 使用 Serilog 結構化日誌，正確使用日誌層級 |
| VI. 安全優先 | ✅ PASS | 純靜態內容展示，無敏感資料，輸入驗證（搜尋關鍵字） |

**Gate 結果**: ✅ 全部通過，可進入 Phase 0

## Project Structure

### Documentation (this feature)

```text
specs/002-aquarium-storybook/
├── plan.md              # 本文件
├── research.md          # Phase 0 輸出
├── data-model.md        # Phase 1 輸出
├── quickstart.md        # Phase 1 輸出
├── contracts/           # Phase 1 輸出
│   └── aquarium-api.yaml
├── checklists/
│   └── requirements.md
└── tasks.md             # Phase 2 輸出（由 /speckit.tasks 建立）
```

### Source Code (repository root)

```text
StoryBook/
├── Models/
│   ├── LocalizedText.cs          # 現有（共用）
│   ├── AquariumAnimal.cs         # 新增
│   ├── AquariumAnimalImages.cs   # 新增
│   └── AquariumAnimalData.cs     # 新增
├── Services/
│   ├── IJsonDataService.cs       # 現有（擴充）
│   ├── JsonDataService.cs        # 現有（擴充）
│   ├── IAquariumService.cs       # 新增
│   └── AquariumService.cs        # 新增
├── Pages/
│   ├── Index.cshtml              # 現有（新增水族館入口）
│   └── Aquarium/                 # 新增
│       ├── Index.cshtml          # 水族館故事書主頁
│       ├── Index.cshtml.cs
│       ├── _AnimalCard.cshtml    # 動物卡片 Partial View
│       └── Search.cshtml         # 搜尋結果頁（可選）
└── wwwroot/
    ├── data/
    │   └── aquarium.json         # 新增：水族館動物資料
    ├── images/
    │   └── aquarium/             # 新增：水族館動物圖片
    │       ├── clownfish/
    │       ├── dolphin/
    │       ├── sea-turtle/
    │       └── ... (15 種動物)
    ├── css/
    │   └── aquarium.css          # 新增：水族館專用樣式
    └── js/
        └── aquarium.js           # 新增：水族館互動功能

StoryBook.Tests/
├── Unit/
│   └── Services/
│       └── AquariumServiceTests.cs   # 新增
└── Integration/
    └── Pages/
        └── AquariumPagesTests.cs     # 新增
```

**Structure Decision**: 參照恐龍故事書 (001) 的架構，保持一致性。水族館動物新增獨立的 Models、Services 和 Pages，避免影響現有恐龍功能。共用 `LocalizedText` 模型和 `IJsonDataService` 介面。

## Complexity Tracking

> 無憲章違規需要說明

| 違規 | 需要原因 | 拒絕更簡單替代方案的原因 |
|------|----------|-------------------------|
| N/A | N/A | N/A |

---

## Phase 0 Output Reference

詳見 [research.md](./research.md)

## Phase 1 Output Reference

- 資料模型：[data-model.md](./data-model.md)
- API 契約：[contracts/aquarium-api.yaml](./contracts/aquarium-api.yaml)
- 快速入門：[quickstart.md](./quickstart.md)

---

## Constitution Re-check (Post-Design)

*Phase 1 設計完成後的憲章合規性重新驗證*

| 原則 | 狀態 | Phase 1 設計合規說明 |
|------|------|---------------------|
| I. 程式碼品質至上 | ✅ PASS | `data-model.md` 定義完整的 XML 文件註解、C# 13 特性（required、pattern matching）、驗證器類別 |
| II. 測試優先開發 | ✅ PASS | `research.md` 包含完整的單元測試和整合測試範例，測試覆蓋目標明確（Models 100%、Services 100%） |
| III. 使用者體驗一致性 | ✅ PASS | `research.md` 定義海洋風格色系、大按鈕設計、區域分類標籤樣式，與恐龍故事書保持一致框架 |
| IV. 效能與延展性 | ✅ PASS | `research.md` 確認 Singleton 服務快取、圖片延遲載入、前端過濾 + Debounce 策略 |
| V. 可觀察性與監控 | ✅ PASS | `research.md` 定義 Serilog 日誌策略、日誌層級使用規範、錯誤處理與日誌記錄範例 |
| VI. 安全優先 | ✅ PASS | `contracts/aquarium-api.yaml` 使用 RFC 7807 Problem Details 錯誤格式，輸入驗證（ID 格式、搜尋關鍵字） |

**Post-Design Gate 結果**: ✅ 全部通過，設計符合憲章原則

---

## 下一步驟

執行 `/speckit.tasks` 命令以產生 `tasks.md`，進入 Phase 2 實作階段。
