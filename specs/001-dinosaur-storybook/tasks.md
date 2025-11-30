# Tasks: 恐龍故事書系統

**Input**: Design documents from `/specs/001-dinosaur-storybook/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ ✅, quickstart.md ✅

**Tests**: 未明確要求測試，本任務清單不包含測試任務。如需測試，請在規格中明確要求。

**Organization**: 任務按使用者故事組織，以便獨立實作和測試每個故事。

## Format: `[ID] [Story] Description`

- **[Story]**: 此任務屬於哪個使用者故事（如 US1, US2, US3）
- 描述中包含確切的檔案路徑

## Path Conventions

- **主專案**: `StoryBook/`
- **頁面**: `StoryBook/Pages/`
- **模型**: `StoryBook/Models/`
- **服務**: `StoryBook/Services/`
- **靜態資源**: `StoryBook/wwwroot/`

---

## Phase 1: Setup（專案初始化）

**Purpose**: 專案基礎設定和結構建立

- [ ] T001 建立資料模型目錄結構於 `StoryBook/Models/`
- [ ] T002 建立服務層目錄結構於 `StoryBook/Services/`
- [ ] T003 建立恐龍頁面目錄於 `StoryBook/Pages/Dinosaurs/`
- [ ] T004 建立靜態資源目錄於 `StoryBook/wwwroot/data/` 和 `StoryBook/wwwroot/images/dinosaurs/`
- [ ] T005 安裝 Serilog 相依套件並設定 `StoryBook/StoryBook.csproj`
- [ ] T006 設定 Serilog 日誌於 `StoryBook/Program.cs`（Console + File Sink）
- [ ] T007 建立恐龍專用 CSS 檔案於 `StoryBook/wwwroot/css/dinosaurs.css`
- [ ] T008 建立恐龍專用 JavaScript 檔案於 `StoryBook/wwwroot/js/dinosaurs.js`

---

## Phase 2: Foundational（基礎建設）

**Purpose**: 所有使用者故事共用的核心基礎設施，必須在任何故事開始前完成

**⚠️ 重要**: 此階段未完成前，不得開始任何使用者故事

- [ ] T009 建立 `LocalizedText` 模型於 `StoryBook/Models/LocalizedText.cs`
- [ ] T010 建立 `DinosaurImages` 模型於 `StoryBook/Models/DinosaurImages.cs`
- [ ] T011 建立 `Dinosaur` 模型於 `StoryBook/Models/Dinosaur.cs`
- [ ] T012 建立 `DinosaurData` 模型於 `StoryBook/Models/DinosaurData.cs`
- [ ] T013 建立 `IJsonDataService` 介面於 `StoryBook/Services/IJsonDataService.cs`
- [ ] T014 實作 `JsonDataService` 服務於 `StoryBook/Services/JsonDataService.cs`
- [ ] T015 建立 `IDinosaurService` 介面於 `StoryBook/Services/IDinosaurService.cs`
- [ ] T016 實作 `DinosaurService` 服務於 `StoryBook/Services/DinosaurService.cs`
- [ ] T017 在 `StoryBook/Program.cs` 註冊服務（Singleton）
- [ ] T018 建立恐龍範例資料檔案於 `StoryBook/wwwroot/data/dinosaurs.json`（至少 5 隻恐龍）
- [ ] T019 建立預設佔位圖片於 `StoryBook/wwwroot/images/placeholder.png`
- [ ] T020 設定 JSON 路徑於 `StoryBook/appsettings.json` 和 `StoryBook/appsettings.Development.json`

**Checkpoint**: 基礎建設完成 - 使用者故事實作可以開始

---

## Phase 3: User Story 1 - 瀏覽恐龍介紹 (Priority: P1) 🎯 MVP

**Goal**: 使用者可從首頁進入恐龍介紹頁面，瀏覽恐龍圖片與簡短介紹

**Independent Test**: 點擊首頁的「恐龍介紹」按鈕後，應顯示恐龍圖片與介紹文字（名稱、生活時期、食性、發現地點），每個介紹控制在 200 字以內

### Implementation for User Story 1

- [ ] T021 [US1] 更新首頁按鈕於 `StoryBook/Pages/Index.cshtml`，新增「恐龍介紹」按鈕
- [ ] T022 [US1] 建立恐龍介紹頁面模型於 `StoryBook/Pages/Dinosaurs/Index.cshtml.cs`
- [ ] T023 [US1] 建立恐龍介紹頁面視圖於 `StoryBook/Pages/Dinosaurs/Index.cshtml`
- [ ] T024 [US1] 建立恐龍卡片部分視圖於 `StoryBook/Pages/Dinosaurs/_DinosaurCard.cshtml`
- [ ] T025 [US1] 實作恐龍卡片樣式於 `StoryBook/wwwroot/css/dinosaurs.css`（可愛繪本風格）
- [ ] T026 [US1] 新增恐龍圖片資源於 `StoryBook/wwwroot/images/dinosaurs/`（至少第一隻恐龍圖片）

**Checkpoint**: 此時 User Story 1 應可完全運作並獨立測試

---

## Phase 4: User Story 2 - 換頁瀏覽多隻恐龍 (Priority: P1)

**Goal**: 使用者可使用「上一頁」和「下一頁」按鈕瀏覽不同恐龍

**Independent Test**: 在恐龍介紹頁面，點擊「下一頁」按鈕應顯示下一隻恐龍，點擊「上一頁」按鈕應顯示上一隻恐龍

### Implementation for User Story 2

- [ ] T027 [US2] 實作換頁 JavaScript 邏輯於 `StoryBook/wwwroot/js/dinosaurs.js`
- [ ] T028 [US2] 更新恐龍介紹頁面於 `StoryBook/Pages/Dinosaurs/Index.cshtml`，新增換頁按鈕
- [ ] T029 [US2] 實作換頁按鈕樣式於 `StoryBook/wwwroot/css/dinosaurs.css`（大且明顯，適合兒童）
- [ ] T030 [US2] 實作按鈕狀態管理（第一隻時停用上一頁、最後一隻時停用下一頁）於 `StoryBook/wwwroot/js/dinosaurs.js`

**Checkpoint**: 此時 User Stories 1 和 2 應可獨立運作

---

## Phase 5: User Story 3 - 回到首頁 (Priority: P1)

**Goal**: 使用者可在任何恐龍介紹頁面看到並點擊「回首頁」按鈕返回首頁

**Independent Test**: 在任何恐龍介紹頁面點擊「回首頁」按鈕，應返回網站首頁

### Implementation for User Story 3

- [ ] T031 [US3] 更新恐龍介紹頁面於 `StoryBook/Pages/Dinosaurs/Index.cshtml`，新增「回首頁」按鈕
- [ ] T032 [US3] 實作「回首頁」按鈕樣式於 `StoryBook/wwwroot/css/dinosaurs.css`

**Checkpoint**: 此時 User Stories 1, 2, 3 應可獨立運作

---

## Phase 6: User Story 4 - 點擊圖片查看大圖 (Priority: P2)

**Goal**: 使用者可點擊恐龍圖片查看大圖，並可關閉返回原頁面

**Independent Test**: 點擊恐龍圖片後，應以較大尺寸顯示該圖片，並可關閉返回原頁面

### Implementation for User Story 4

- [ ] T033 [US4] 建立圖片大圖 Modal 結構於 `StoryBook/Pages/Dinosaurs/Index.cshtml`
- [ ] T034 [US4] 實作圖片大圖 Modal 樣式於 `StoryBook/wwwroot/css/dinosaurs.css`
- [ ] T035 [US4] 實作圖片大圖開啟/關閉 JavaScript 於 `StoryBook/wwwroot/js/dinosaurs.js`

**Checkpoint**: 此時 User Stories 1-4 應可獨立運作

---

## Phase 7: User Story 5 - 搜尋恐龍 (Priority: P2)

**Goal**: 使用者可使用搜尋框即時過濾恐龍列表

**Independent Test**: 在搜尋框輸入恐龍名稱或關鍵字，應即時顯示符合條件的恐龍列表

### Implementation for User Story 5

- [ ] T036 [US5] 更新恐龍介紹頁面於 `StoryBook/Pages/Dinosaurs/Index.cshtml`，新增搜尋框
- [ ] T037 [US5] 實作即時搜尋邏輯（含 Debounce）於 `StoryBook/wwwroot/js/dinosaurs.js`
- [ ] T038 [US5] 實作搜尋結果顯示於 `StoryBook/Pages/Dinosaurs/Index.cshtml`
- [ ] T039 [US5] 實作「找不到結果」友善提示於 `StoryBook/wwwroot/js/dinosaurs.js`
- [ ] T040 [US5] 實作搜尋結果點擊導向恐龍介紹於 `StoryBook/wwwroot/js/dinosaurs.js`

**Checkpoint**: 此時 User Stories 1-5 應可獨立運作

---

## Phase 8: User Story 6 - 閱讀恐龍小故事 (Priority: P2)

**Goal**: 使用者可在恐龍介紹頁面閱讀該恐龍的小故事和插圖

**Independent Test**: 在恐龍介紹頁面向下捲動或換頁後，應可看到該恐龍相關的小故事和可愛插圖

### Implementation for User Story 6

- [ ] T041 [US6] 更新恐龍卡片於 `StoryBook/Pages/Dinosaurs/_DinosaurCard.cshtml`，新增故事區塊
- [ ] T042 [US6] 實作故事區塊樣式於 `StoryBook/wwwroot/css/dinosaurs.css`
- [ ] T043 [US6] 新增故事插圖資源於 `StoryBook/wwwroot/images/dinosaurs/`

**Checkpoint**: 此時 User Stories 1-6 應可獨立運作

---

## Phase 9: User Story 7 - 切換語言 (Priority: P3)

**Goal**: 使用者可切換網站顯示語言（中文/英文），設定透過 localStorage 保存

**Independent Test**: 點擊語言切換選項後，頁面所有文字內容應切換為所選語言，重新整理後設定仍保持

### Implementation for User Story 7

- [ ] T044 [US7] 建立語言切換元件於 `StoryBook/Pages/Shared/_LanguageSwitcher.cshtml`
- [ ] T045 [US7] 更新主版面配置於 `StoryBook/Pages/Shared/_Layout.cshtml`，引入語言切換元件
- [ ] T046 [US7] 實作語言切換 JavaScript 於 `StoryBook/wwwroot/js/site.js`（localStorage 保存）
- [ ] T047 [US7] 更新恐龍介紹頁面於 `StoryBook/Pages/Dinosaurs/Index.cshtml`，新增 data-lang 屬性
- [ ] T048 [US7] 更新首頁於 `StoryBook/Pages/Index.cshtml`，新增 data-lang 屬性支援多語言
- [ ] T049 [US7] 實作語言切換元件樣式於 `StoryBook/wwwroot/css/site.css`

**Checkpoint**: 所有使用者故事應已獨立運作

---

## Phase 10: Polish & Cross-Cutting Concerns

**Purpose**: 跨越多個使用者故事的改進

- [ ] T050 更新主版面配置樣式於 `StoryBook/Pages/Shared/_Layout.cshtml.css`（兒童友善主題色）
- [ ] T051 實作圖片載入失敗處理於 `StoryBook/wwwroot/js/dinosaurs.js`（顯示佔位圖）
- [ ] T052 實作錯誤處理（JSON 檔案遺失）於 `StoryBook/Services/JsonDataService.cs`
- [ ] T053 新增剩餘恐龍圖片資源於 `StoryBook/wwwroot/images/dinosaurs/`（完成 5-8 隻）
- [ ] T054 程式碼清理和重構
- [ ] T055 執行 `quickstart.md` 驗證

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 無相依性 - 可立即開始
- **Foundational (Phase 2)**: 相依於 Setup 完成 - **阻擋所有使用者故事**
- **User Stories (Phase 3-9)**: 全部相依於 Foundational 完成
  - P1 故事（US1, US2, US3）建議先完成，是 MVP 核心
  - P2 故事（US4, US5, US6）可以在 P1 完成後進行
  - P3 故事（US7）為加值功能，最後實作
- **Polish (Phase 10)**: 相依於所有所需故事完成

### User Story Dependencies

- **User Story 1 (P1)**: Foundational 完成後可開始 - 無其他故事相依
- **User Story 2 (P1)**: Foundational 完成後可開始 - 與 US1 整合但可獨立測試
- **User Story 3 (P1)**: Foundational 完成後可開始 - 無相依性
- **User Story 4 (P2)**: 需 US1 的圖片顯示功能
- **User Story 5 (P2)**: 需 US1 的恐龍顯示功能
- **User Story 6 (P2)**: 需 US1 的卡片結構
- **User Story 7 (P3)**: 無相依性，但需套用到所有頁面

### Within Each User Story

- 頁面模型（.cshtml.cs）在視圖（.cshtml）之前
- CSS 樣式可與視圖平行開發
- JavaScript 邏輯需在視圖建立後



---

---

## Implementation Strategy

### MVP First（User Stories 1-3）

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational（關鍵 - 阻擋所有故事）
3. 完成 Phase 3: User Story 1
4. 完成 Phase 4: User Story 2
5. 完成 Phase 5: User Story 3
6. **停止並驗證**: 獨立測試所有 P1 故事
7. 如準備就緒，可部署/展示 MVP

### Incremental Delivery

1. 完成 Setup + Foundational → 基礎就緒
2. 新增 User Story 1 → 獨立測試 → 部署/展示
3. 新增 User Story 2 → 獨立測試 → 部署/展示
4. 新增 User Story 3 → 獨立測試 → MVP 完成！
5. 新增 User Story 4, 5, 6 → P2 功能完成
6. 新增 User Story 7 → 完整功能
7. 每個故事都應增加價值而不破壞先前的故事

### Parallel Team Strategy

如果有多位開發者：

1. 團隊共同完成 Setup + Foundational
2. Foundational 完成後：
   - 開發者 A: User Story 1 + 2（換頁功能整合）
   - 開發者 B: User Story 3 + 4（導航和大圖）
   - 開發者 C: User Story 5 + 6（搜尋和故事）
3. 最後一起整合 User Story 7（語言切換）

---

## Notes

- [Story] 標籤將任務映射到特定使用者故事以便追蹤
- 每個使用者故事應可獨立完成和測試
- 每個任務或邏輯群組完成後提交
- 在任何檢查點停止以獨立驗證故事
- 避免：模糊任務、同一檔案衝突、破壞獨立性的跨故事相依性
