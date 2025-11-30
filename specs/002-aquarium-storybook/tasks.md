# Tasks: 水族館動物介紹故事書

**Input**: Design documents from `/specs/002-aquarium-storybook/`
**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/aquarium-api.yaml ✅, quickstart.md ✅

**Tests**: 未明確要求測試，本任務清單不包含測試任務。如需測試，請重新執行 `/speckit.tasks` 並指定需要測試。

**Organization**: 任務依 User Story 分組，以支援獨立實作與測試。

## Format: `[ID] [P?] [Story] Description`

- **[P]**: 可平行執行（不同檔案、無相依性）
- **[Story]**: 任務所屬的 User Story（如 US1, US2, US3）
- 描述中包含精確的檔案路徑

---

## Phase 1: Setup（專案設定）

**Purpose**: 基礎設定，建立專案結構

- [X] T001 確認 .NET 8.0 SDK 已安裝並切換至 `002-aquarium-storybook` 分支
- [X] T002 [P] 建立水族館圖片目錄 `StoryBook/wwwroot/images/aquarium/`
- [X] T003 [P] 建立水族館 CSS 檔案 `StoryBook/wwwroot/css/aquarium.css`（空白檔案）
- [X] T004 [P] 建立水族館 JS 檔案 `StoryBook/wwwroot/js/aquarium.js`（空白檔案）

---

## Phase 2: Foundational（基礎建設）

**Purpose**: 所有 User Story 共用的核心基礎設施

**⚠️ CRITICAL**: 必須完成此階段後，才能開始任何 User Story

### Models（資料模型）

- [ ] T005 [P] 建立 `HabitatZone` enum 及擴充方法於 `StoryBook/Models/HabitatZone.cs`
- [ ] T006 [P] 建立 `AquariumAnimalImages` 模型於 `StoryBook/Models/AquariumAnimalImages.cs`
- [ ] T007 [P] 建立 `AquariumAnimal` 模型於 `StoryBook/Models/AquariumAnimal.cs`
- [ ] T008 [P] 建立 `AquariumAnimalData` 資料容器於 `StoryBook/Models/AquariumAnimalData.cs`
- [ ] T009 [P] 建立 `AquariumAnimalValidator` 驗證器於 `StoryBook/Models/AquariumAnimalValidator.cs`

### Services（服務層）

- [ ] T010 建立 `IAquariumService` 介面於 `StoryBook/Services/IAquariumService.cs`
- [ ] T011 擴充 `IJsonDataService` 介面，新增 `LoadAquariumAnimalsAsync()` 方法於 `StoryBook/Services/IJsonDataService.cs`
- [ ] T012 擴充 `JsonDataService`，實作 `LoadAquariumAnimalsAsync()` 方法於 `StoryBook/Services/JsonDataService.cs`
- [ ] T013 建立 `AquariumService` 實作於 `StoryBook/Services/AquariumService.cs`
- [ ] T014 在 `Program.cs` 註冊 `IAquariumService` 服務（Singleton）

### Data（資料）

- [ ] T015 建立水族館動物 JSON 資料檔案（15 隻動物）於 `StoryBook/wwwroot/data/aquarium.json`
- [ ] T016 [P] 準備 15 隻水族館動物的圖片檔案（placeholder）於 `StoryBook/wwwroot/images/aquarium/` 各子目錄

**Checkpoint**: 基礎建設完成，可開始 User Story 實作

---

## Phase 3: User Story 1 - 進入水族館動物故事書 (Priority: P1) 🎯 MVP

**Goal**: 使用者能從首頁進入水族館故事書，以童書翻頁模式瀏覽動物

**Independent Test**: 點擊首頁「水族館動物介紹」按鈕進入故事書，確認能以單頁單一動物的方式顯示

### Implementation for User Story 1

- [ ] T017 [US1] 建立水族館頁面目錄 `StoryBook/Pages/Aquarium/`
- [ ] T018 [US1] 建立水族館主頁 PageModel 於 `StoryBook/Pages/Aquarium/Index.cshtml.cs`
- [ ] T019 [US1] 建立水族館主頁 View 於 `StoryBook/Pages/Aquarium/Index.cshtml`（單頁顯示一隻動物）
- [ ] T019.5 [US1] 實作水族館封面區塊（封面圖片 + 簡短介紹）於 `StoryBook/Pages/Aquarium/Index.cshtml`（FR-002）
- [ ] T020 [US1] 修改首頁 `StoryBook/Pages/Index.cshtml` 新增「水族館動物介紹」入口按鈕
- [ ] T021 [US1] 在共用版面 `StoryBook/Pages/Shared/_Layout.cshtml` 新增水族館導航連結
- [ ] T022 [US1] 實作水族館基本樣式（海洋風格色系）於 `StoryBook/wwwroot/css/aquarium.css`

**Checkpoint**: User Story 1 完成 - 可從首頁進入水族館，看到第一隻動物

---

## Phase 4: User Story 2 - 查看單一動物詳細介紹 (Priority: P1)

**Goal**: 每頁只顯示一隻動物的完整介紹，版面簡潔適合孩童閱讀

**Independent Test**: 翻頁到任一動物，確認頁面只顯示該動物的圖片和簡短文字描述

### Implementation for User Story 2

- [ ] T023 [US2] 建立動物卡片 Partial View 於 `StoryBook/Pages/Aquarium/_AnimalCard.cshtml`
- [ ] T024 [US2] 在 `_AnimalCard.cshtml` 實作動物詳細資訊顯示（名稱、生活環境、食性、發現地點）
- [ ] T025 [US2] 實作動物小故事區塊顯示
- [ ] T026 [US2] 實作生活區域分類標籤樣式（淡水/海水/深海/珊瑚礁/極地）於 `StoryBook/wwwroot/css/aquarium.css`
- [ ] T027 [US2] 確保每頁文字內容控制在 200 字以內的版面設計

**Checkpoint**: User Story 2 完成 - 動物詳細頁面版面簡潔、內容完整

---

## Phase 5: User Story 3 - 換頁瀏覽不同動物 (Priority: P1)

**Goal**: 使用者能透過大且明顯的上一頁/下一頁按鈕切換動物

**Independent Test**: 在任一動物頁面測試上一頁/下一頁按鈕，確認能正確切換到相鄰的動物

### Implementation for User Story 3

- [ ] T028 [US3] 實作換頁按鈕 UI（大且明顯的上一頁/下一頁）於 `StoryBook/Pages/Aquarium/Index.cshtml`
- [ ] T029 [US3] 實作換頁 JavaScript 邏輯於 `StoryBook/wwwroot/js/aquarium.js`
- [ ] T030 [US3] 實作首頁停用上一頁按鈕、末頁停用下一頁按鈕邏輯
- [ ] T031 [US3] 實作換頁動畫效果（流暢切換，< 1 秒）
- [ ] T032 [US3] 處理快速連續點擊換頁按鈕的 debounce 邏輯

**Checkpoint**: User Story 3 完成 - 換頁功能流暢運作，按鈕大且明顯

---

## Phase 6: User Story 4 - 搜尋水族館動物 (Priority: P2)

**Goal**: 使用者能透過搜尋框快速找到特定動物

**Independent Test**: 在搜尋框輸入動物名稱或特徵關鍵字，確認搜尋結果能正確篩選顯示

### Implementation for User Story 4

- [ ] T033 [US4] 在水族館主頁新增搜尋框 UI 於 `StoryBook/Pages/Aquarium/Index.cshtml`
- [ ] T034 [US4] 實作前端即時搜尋過濾邏輯（比對名稱、生活環境、食性）於 `StoryBook/wwwroot/js/aquarium.js`
- [ ] T035 [US4] 實作搜尋 debounce 防止過度觸發（300ms）
- [ ] T036 [US4] 實作「找不到相關動物」友善提示訊息顯示
- [ ] T037 [US4] 實作清空搜尋框恢復顯示所有動物邏輯

**Checkpoint**: User Story 4 完成 - 搜尋功能即時篩選，回應 < 1 秒

---

## Phase 7: User Story 5 - 點擊圖片查看大圖 (Priority: P2)

**Goal**: 使用者能點擊動物圖片以更大尺寸查看細節

**Independent Test**: 點擊任一動物圖片，確認能以 Lightbox 方式顯示大圖

### Implementation for User Story 5

- [ ] T038 [P] [US5] 建立 Lightbox Modal HTML 結構於 `StoryBook/Pages/Aquarium/Index.cshtml`
- [ ] T039 [P] [US5] 實作 Lightbox 樣式（半透明背景、置中大圖、關閉按鈕）於 `StoryBook/wwwroot/css/aquarium.css`
- [ ] T040 [US5] 實作 Lightbox 開啟/關閉 JavaScript 邏輯於 `StoryBook/wwwroot/js/aquarium.js`
- [ ] T041 [US5] 實作點擊圖片外區域或 ESC 鍵關閉 Lightbox

**Checkpoint**: User Story 5 完成 - Lightbox 大圖檢視功能正常運作

---

## Phase 8: User Story 6 - 多語言切換 (Priority: P2)

**Goal**: 使用者能在中文和英文之間切換網站語言

**Independent Test**: 透過語言切換按鈕在中文和英文之間切換，確認所有動物介紹內容都正確切換語言

### Implementation for User Story 6

- [ ] T042 [US6] 在水族館頁面整合現有語言切換元件 `_LanguageSwitcher.cshtml`
- [ ] T043 [US6] 實作水族館頁面多語言內容切換 JavaScript 邏輯於 `StoryBook/wwwroot/js/aquarium.js`
- [ ] T044 [US6] 實作 Cookie 保存語言偏好設定（有效期 365 天）
- [ ] T045 [US6] 確保換頁後語言設定維持不變
- [ ] T046 [US6] 實作生活區域分類標籤的多語言顯示

**Checkpoint**: User Story 6 完成 - 中英文切換正常，偏好設定持久保存

---

## Phase 9: User Story 7 - 回到首頁 (Priority: P3)

**Goal**: 使用者能隨時透過按鈕回到網站首頁

**Independent Test**: 在任一水族館頁面點擊「回到首頁」按鈕，確認能正確導航回網站首頁

### Implementation for User Story 7

- [ ] T047 [US7] 在水族館頁面新增明顯的「回到首頁」按鈕於 `StoryBook/Pages/Aquarium/Index.cshtml`
- [ ] T048 [US7] 實作回到首頁按鈕樣式（與整體風格一致）於 `StoryBook/wwwroot/css/aquarium.css`

**Checkpoint**: User Story 7 完成 - 回到首頁功能正常運作

---

## Phase 10: Polish & Cross-Cutting Concerns（優化與收尾）

**Purpose**: 跨功能優化與品質確保

- [ ] T049 [P] 實作圖片載入失敗時的預設佔位圖片顯示
- [ ] T050 [P] 實作資料載入失敗時的友善錯誤訊息與重新載入按鈕
- [ ] T051 [P] 新增 Serilog 結構化日誌記錄（服務層操作、錯誤處理）
- [ ] T052 [P] 優化頁面載入效能（確保 < 3 秒）
- [ ] T053 [P] 執行 quickstart.md 驗證（確認開發流程文件正確）
- [ ] T054 程式碼清理與 XML 文件註解完善
- [ ] T055 最終整合測試（所有 User Story 功能驗證）

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: 無相依性 - 可立即開始
- **Phase 2 (Foundational)**: 依賴 Phase 1 完成 - **阻擋所有 User Story**
- **Phase 3-9 (User Stories)**: 全部依賴 Phase 2 完成
  - US1, US2, US3 (P1) 建議依序完成，因為介面有相依性
  - US4, US5, US6 (P2) 可在 US1-3 完成後平行進行
  - US7 (P3) 可獨立進行
- **Phase 10 (Polish)**: 依賴所有預期的 User Story 完成

### User Story Dependencies

| User Story | 優先級 | 可開始條件 | 與其他 Story 的相依 |
|------------|--------|-----------|-------------------|
| US1 - 進入故事書 | P1 | Phase 2 完成 | 無 - MVP 核心 |
| US2 - 動物詳細介紹 | P1 | Phase 2 完成 | 建議 US1 後進行（頁面基礎）|
| US3 - 換頁瀏覽 | P1 | Phase 2 完成 | 建議 US1, US2 後進行（需要頁面結構）|
| US4 - 搜尋功能 | P2 | Phase 2 完成 | 可與 US5, US6 平行 |
| US5 - Lightbox 大圖 | P2 | Phase 2 完成 | 可與 US4, US6 平行 |
| US6 - 多語言切換 | P2 | Phase 2 完成 | 可與 US4, US5 平行 |
| US7 - 回到首頁 | P3 | Phase 2 完成 | 完全獨立 |

### Within Each User Story

- Models → Services → Pages/Views
- 核心實作 → 樣式/互動 → 邊界情況處理
- 完成一個 Story 後再進行下一個優先級

### Parallel Opportunities

**Phase 1 (Setup) - 可平行:**

```text
T002 建立圖片目錄
T003 建立 CSS 檔案
T004 建立 JS 檔案
```

**Phase 2 (Foundational) - 可平行:**

```text
T005 HabitatZone enum
T006 AquariumAnimalImages 模型
T007 AquariumAnimal 模型
T008 AquariumAnimalData 容器
T009 AquariumAnimalValidator 驗證器
```

**Phase 6-8 (P2 Stories) - 可平行:**

```text
US4 搜尋功能
US5 Lightbox 大圖
US6 多語言切換
```

---

## Implementation Strategy

### MVP First (User Story 1-3)

1. 完成 Phase 1: Setup
2. 完成 Phase 2: Foundational（**CRITICAL - 阻擋所有 Stories**）
3. 完成 Phase 3: User Story 1（進入故事書）
4. 完成 Phase 4: User Story 2（動物詳細介紹）
5. 完成 Phase 5: User Story 3（換頁瀏覽）
6. **STOP and VALIDATE**: 測試 MVP 功能
7. Deploy/Demo（MVP 完成！）

### Incremental Delivery

1. Setup + Foundational → 基礎設施就緒
2. US1 + US2 + US3 → MVP（核心故事書功能）
3. US4 → 搜尋功能
4. US5 → Lightbox 大圖
5. US6 → 多語言切換
6. US7 → 回到首頁
7. Polish → 優化與品質確保

---

## Notes

- [P] 任務 = 不同檔案、無相依性，可平行執行
- [Story] 標籤 = 追蹤任務所屬的 User Story
- 每個 User Story 應可獨立完成與測試
- 每個任務或邏輯群組完成後提交
- 可在任何 Checkpoint 停止以獨立驗證該 Story
- 避免：模糊任務、同檔案衝突、破壞獨立性的跨 Story 相依
