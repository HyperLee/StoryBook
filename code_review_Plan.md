# Code Review Plan: Dinosaurs Pages

## Problem Statement
對 `StoryBook/Pages/Dinosaurs/` 目錄下的所有程式碼進行全面的 code review，使用 `.github/skills/code-review/` 中定義的 senior-engineer-level 審查標準，涵蓋安全性、正確性、效能、程式碼品質、架構設計、測試及無障礙性。

## Scope — 待審查檔案

### 核心頁面檔案（直接目標）
| 檔案 | 類型 | 行數 |
|------|------|------|
| `StoryBook/Pages/Dinosaurs/Index.cshtml` | Razor Page (View) | ~132 |
| `StoryBook/Pages/Dinosaurs/Index.cshtml.cs` | Page Model (C#) | ~85 |
| `StoryBook/Pages/Dinosaurs/_DinosaurCard.cshtml` | Partial View | ~100 |

### 相關依賴檔案（上下文理解）
| 檔案 | 類型 | 行數 |
|------|------|------|
| `StoryBook/Models/Dinosaur.cs` | 資料模型 | ~60 |
| `StoryBook/Models/DinosaurData.cs` | JSON 容器模型 | ~10 |
| `StoryBook/Models/DinosaurImages.cs` | 圖片模型 | ~15 |
| `StoryBook/Services/IDinosaurService.cs` | 服務介面 | ~20 |
| `StoryBook/Services/DinosaurService.cs` | 服務實作 | ~80 |
| `StoryBook/wwwroot/css/dinosaurs.css` | 樣式表 | ~744 |
| `StoryBook/wwwroot/js/dinosaurs.js` | 前端腳本 | ~669 |

## Approach
依照 `.github/skills/code-review/SKILL.md` 定義的三步驟工作流程執行：

1. **Step 1 — 理解上下文**: 閱讀所有相關程式碼、模型、服務、CSS/JS；檢查 `.editorconfig` 和專案慣例
2. **Step 2 — 系統性分析**: 針對 Security / Correctness / Performance / Code Quality / Architecture / Testing / Accessibility 七大面向逐一檢查
3. **Step 3 — 撰寫審查報告**: 按 SKILL.md 的 Output Template 格式產出結構化報告

## Todos

### 1. `review-razor-pages` — 審查 Razor Pages (C# 後端)
**範圍**: `Index.cshtml.cs`, `Index.cshtml`, `_DinosaurCard.cshtml`
- 正確性：索引邊界檢查、null 處理、非同步模式
- 安全性：XSS 風險（`@Html.Raw`）、輸入驗證
- 效能：重複呼叫 service（`GetAllAsync` + `GetCountAsync`）
- 程式碼品質：命名、XML 文件、.editorconfig 合規性
- 架構：頁面模型職責分離、依賴注入

### 2. `review-models-services` — 審查 Models & Services
**範圍**: `Dinosaur.cs`, `DinosaurData.cs`, `DinosaurImages.cs`, `IDinosaurService.cs`, `DinosaurService.cs`
- 模型設計：nullable 處理、驗證屬性
- 服務層：介面設計、錯誤處理、搜尋邏輯效能
- 資料存取：JSON 載入策略、快取機制

### 3. `review-frontend` — 審查前端 CSS/JS
**範圍**: `dinosaurs.css`, `dinosaurs.js`
- 安全性：`onerror` handler、XSS 防護
- 效能：圖片載入策略、debounce、DOM 操作效率
- 無障礙性：ARIA 屬性、鍵盤導航、螢幕閱讀器支援
- 程式碼品質：命名慣例、模組化程度

### 4. `compile-review-report` — 彙整最終審查報告
將所有發現彙整為統一的 Code Review 報告，依照 SKILL.md 格式：
- Summary → Critical Issues → Suggestions → Good Practices → Metrics

## Notes
- 此專案為兒童故事書應用，支援中英雙語
- 目前沒有測試專案，缺少單元測試覆蓋
- 前端使用原生 JS（非框架），CSS 量較大
- 重點關注 `@Html.Raw` 的 XSS 風險，這是最明顯的安全風險點
