# Code Review: Dinosaurs Pages — 完整審查報告

## Summary

審查了 `StoryBook/Pages/Dinosaurs/` 及其所有依賴，共 **10 個檔案、約 2,400 行程式碼**。整體程式碼品質良好：C# 部分遵循 .editorconfig 慣例、正確使用 nullable reference types 和結構化日誌；前端有完整的 XSS 防護和鍵盤導航。

主要問題集中在三個面向：**無障礙性缺陷**（對兒童教育應用尤為重要）、**可變快取資料安全**、以及**效能冗餘**。

**Verdict: Needs minor changes** — 無 security-critical 漏洞，但有 8 個 Critical Issues 需要修復。

---

## 🔴 Critical Issues (8)

### C-1. 可變快取資料直接回傳（資料一致性風險）
**檔案**: `DinosaurService.cs:30`

`GetAllAsync()` 回傳快取中的 `List<Dinosaur>` 參考。任何消費者若修改此 list，將破壞所有後續請求的快取資料。

```csharp
// ❌ Before
return data.Dinosaurs;

// ✅ After
return data.Dinosaurs.AsReadOnly();
```

同時建議將 Models 的 `set` 改為 `init`。

---

### C-2. Nullable 合約違反
**檔案**: `IDinosaurService.cs:23`, `DinosaurService.cs:64`

介面宣告 `string language`（non-nullable），但實作使用 `language?.ToLowerInvariant()`。啟用 `<Nullable>enable` 後，caller 不會做 null 檢查。

```csharp
// ✅ Fix: 讓合約誠實
Task<IEnumerable<Dinosaur>> SearchAsync(string keyword, string? language);
```

---

### C-3. 空資料集時導航按鈕異常
**檔案**: `Index.cshtml.cs:68-75`

當 `TotalCount == 0` 且 `index > 0` 時，clamping 被跳過，`HasPrevious` 為 `true`，出現無意義的「上一頁」按鈕。

```csharp
// ✅ Fix
if (TotalCount == 0) { index = 0; }
else { index = Math.Clamp(index, 0, TotalCount - 1); }
```

---

### C-4. Modal `aria-labelledby` 指向不存在的元素
**檔案**: `Index.cshtml:111`

`aria-labelledby="modalImageAlt"` — 但不存在 `id="modalImageAlt"` 的元素。螢幕閱讀器無法宣告 dialog。

```html
<!-- ✅ Fix -->
<div id="imageModal" ... aria-labelledby="modalImageCaption">
```

---

### C-5. 缺少 `prefers-reduced-motion` 支援
**檔案**: `dinosaurs.css` (多處動畫)

所有動畫無條件播放。對有前庭障礙或光敏感的兒童可能造成不適。

```css
/* ✅ Fix: 加到 dinosaurs.css 最後 */
@media (prefers-reduced-motion: reduce) {
    .image-loading, .story-icon { animation: none; }
    .image-modal-content, .search-results.active { animation: none; }
    .dinosaur-card, .dinosaur-image, .nav-button { transition: none; }
}
```

---

### C-6. Modal 無 focus trap
**檔案**: `dinosaurs.js:237-261`

Modal 開啟時 Tab 鍵可到達背後元素，違反 WCAG 2.1 AA。需要在 modal 開啟時限制焦點循環。

---

### C-7. 搜尋結果缺少 ARIA live region
**檔案**: `dinosaurs.js` 搜尋功能

`#searchResults` 的 `innerHTML` 更新對螢幕閱讀器不可見。需新增 `aria-live="polite"` 公告區域。

```html
<div id="searchAnnouncer" class="visually-hidden" aria-live="polite" aria-atomic="true"></div>
```

---

### C-8. Modal 關閉後焦點回到錯誤元素
**檔案**: `dinosaurs.js:277`

應記住觸發 modal 的元素，關閉時將焦點返回該元素，而非固定的第一個圖片。

---

## 🟡 Suggestions (15)

| # | 問題 | 檔案 | 影響 |
|---|------|------|------|
| S-1 | 每次請求 3 次 JSON 載入（可合併為 1 次） | `Index.cshtml.cs:64-78` | 效能 |
| S-2 | `@Html.Raw()` 雖目前安全但易碎 — 改用 `<script type="application/json">` | `Index.cshtml:125` | 安全性 |
| S-3 | inline `onerror` 違反 CSP — 改用 JS 事件 | `_DinosaurCard.cshtml:9,86` | 安全性 |
| S-4 | 導航區應使用 `<nav>` 語義元素 | `Index.cshtml:55` | 無障礙 |
| S-5 | 建議使用 primary constructor | `Index.cshtml.cs:50`, `DinosaurService.cs:18` | 程式碼品質 |
| S-6 | `Images.Story` 的冗餘 null 檢查 | `_DinosaurCard.cshtml:80` | 程式碼品質 |
| S-7 | `SearchAsync` LINQ 延遲執行 — 應 `.ToList()` | `DinosaurService.cs:68-81` | 正確性 |
| S-8 | 搜尋無輸入長度上限 | `DinosaurService.cs:55` | 效能/安全 |
| S-9 | 無測試專案 — 最需測試 `SearchAsync` | 全域 | 測試 |
| S-10 | `escapeHtml` 每次呼叫建立 DOM 元素 | `dinosaurs.js:651` | 效能 |
| S-11 | 重複的 DOM 查詢（5 處 `getElementById`） | `dinosaurs.js` | 效能 |
| S-12 | 搜尋 input 缺少 `role="combobox"` ARIA | `Index.cshtml:22` | 無障礙 |
| S-13 | 重複的 `.dinosaur-image` CSS 選擇器 | `dinosaurs.css:62,403` | 維護性 |
| S-14 | MutationObserver 未斷開連線 | `dinosaurs.js:97` | 維護性 |
| S-15 | 空的 click handler（dead code） | `dinosaurs.js:510-516` | 維護性 |

---

## ✅ Good Practices (26)

### C# / Backend
1. ✅ 正確使用 `is null`/`is not null`（符合 .editorconfig）
2. ✅ 結構化日誌搭配訊息模板（`{Index}`, `{Keyword}`）
3. ✅ 完整的 XML 文件（包含 `<example>` + `<code>` 區塊）
4. ✅ 路由約束 `{index:int?}` 在路由層防止非整數輸入
5. ✅ 優雅的 null 處理搭配有意義的 fallback UI
6. ✅ File-scoped namespaces + `_camelCase` 私有欄位命名
7. ✅ `required` 關鍵字確保屬性初始化
8. ✅ 乾淨的關注點分離（Service interface → Implementation → Model → View）
9. ✅ 正確的 DI 模式（IJsonDataService + ILogger<T>）
10. ✅ 最小且清晰的介面設計（IDinosaurService）
11. ✅ 一致的 PascalCase/camelCase 命名慣例

### Frontend
12. ✅ IIFE + `'use strict'` 防止全域汙染
13. ✅ `escapeHtml()` + `escapeRegExp()` 完整 XSS 防護
14. ✅ 300ms debounce 防止過度 DOM 更新
15. ✅ CSS custom properties 語意化主題系統
16. ✅ Modal 開/關焦點管理（需微調觸發元素追蹤）
17. ✅ 鍵盤導航支援（方向鍵翻頁 + 搜尋結果）
18. ✅ 圖片錯誤迴圈防護（`dataset.errorHandled` flag）
19. ✅ 全面使用嚴格相等 `===`
20. ✅ 伺服器端 JSON 序列化搭配 CamelCase policy
21. ✅ 有組織的 CSS（section headers + 一致命名前綴）
22. ✅ 圖片 lazy loading
23. ✅ 搜尋結果高亮功能
24. ✅ 雙語切換支援（data-lang-zh/data-lang-en）
25. ✅ 響應式設計（mobile ≤599px / desktop ≥600px）
26. ✅ MutationObserver 監控動態圖片

---

## Metrics

| 指標 | 數量 |
|------|------|
| 審查檔案數 | 10 |
| 🔴 Critical Issues | 8 |
| 🟡 Suggestions | 15 |
| ✅ Good Practices | 26 |
| **Verdict** | **Needs minor changes** |

---

## 優先修復順序

1. **C-1** 可變快取 → 資料一致性風險最高
2. **C-5 + C-6 + C-7 + C-8** 無障礙四項 → 兒童教育應用核心需求
3. **C-3** 空資料導航 → 邊界案例 bug
4. **C-4** ARIA labelledby → 快速修復
5. **C-2** Nullable 合約 → 防止未來 NullReferenceException
