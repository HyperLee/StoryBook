# 🐠 水族館功能（Aquarium Feature）深度 Code Review 報告

**審查日期**：2026-03-21  
**審查範圍**：`StoryBook/Pages/Aquarium/` 及所有相關檔案  
**審查人**：Copilot Code Review（Senior Engineer Level）

---

## 📋 Summary 總覽

本次深度審查涵蓋水族館故事書功能的完整實作，包含 **3 個 Razor 頁面檔案**（`Index.cshtml`、`Index.cshtml.cs`、`_AnimalCard.cshtml`）、**6 個 Model 類別**、**2 個 Service 類別**、**1 個 JavaScript 檔案**（968 行）及 **1 個 CSS 檔案**（1350 行），共計約 **2,700+ 行程式碼**。

**整體評價**：此功能的程式碼品質整體良好，架構清晰，遵循了 ASP.NET Core Razor Pages 的最佳實踐。程式碼具備完整的多語言（中英文）支援、無障礙功能（Accessibility）、以及前端互動功能（搜尋、Lightbox、換頁動畫）。XML 文件注釋詳盡，命名規範一致。但仍存在若干效能問題、潛在安全風險、以及架構改進空間。

**判定**：⚠️ **Needs Minor Changes**（需要小幅修正）

---

## 🔴 Critical Issues 嚴重問題

### 1. 【效能】Index.cshtml 中 `AllAnimals.ToList().IndexOf(a)` 造成 O(n²) 複雜度

**檔案**：`Pages/Aquarium/Index.cshtml`，第 214 行

```csharp
index = Model.AllAnimals.ToList().IndexOf(a),
```

在 `@Html.Raw(...)` 序列化區塊中，對每一筆動物呼叫 `Model.AllAnimals.ToList().IndexOf(a)`。這會導致：
- 每次呼叫 `ToList()` 都會建立一個新的 `List<AquariumAnimal>` 副本
- `IndexOf()` 再進行線性搜尋
- 整體複雜度為 **O(n²)**，且產生 N 次不必要的記憶體配置

當動物數量增長時，這會顯著影響頁面載入速度和 GC 壓力。

**修正建議**：使用 `Select` 的索引重載，避免重複建立列表和搜尋：

```csharp
@Html.Raw(System.Text.Json.JsonSerializer.Serialize(
    Model.AllAnimals.Select((a, i) => new {
        id = a.Id,
        index = i,  // 直接使用 Select 提供的索引
        nameZh = a.Name.Zh,
        // ... 其餘欄位不變
    }),
    new System.Text.Json.JsonSerializerOptions { WriteIndented = false }))
```

---

### 2. 【安全性 / XSS】`_AnimalCard.cshtml` 中 `onerror` 行內事件處理器存在 XSS 風險

**檔案**：`Pages/Aquarium/_AnimalCard.cshtml`，第 15 行

```html
onerror="this.onerror=null; this.src='/images/aquarium/placeholder.svg'; 
         console.warn('圖片載入失敗:', '@Model.Images.Main');"
```

`@Model.Images.Main` 的值被直接插入到 JavaScript 字串中（行內 `onerror` 屬性）。如果圖片路徑包含單引號 `'` 或其他特殊字元，將導致 JavaScript 語法錯誤；更嚴重的是，若資料來源被汙染，可能成為 **DOM-based XSS** 攻擊向量。

同樣的問題也出現在第 114 行的故事插圖 `onerror`。

**修正建議**：移除行內 `onerror`，改用 JavaScript 統一處理（程式碼中 `initImageErrorHandling()` 已有此功能，實際上 `onerror` 是冗餘的）：

```html
<!-- 移除 onerror 屬性，已由 aquarium.js 的 initImageErrorHandling() 處理 -->
<img src="@Model.Images.Main" 
     alt="@Model.Name.Zh" 
     class="animal-image"
     loading="lazy" />
```

---

### 3. 【安全性 / XSS】`highlightText()` 函式存在 XSS 風險

**檔案**：`wwwroot/js/aquarium.js`，第 780-785 行

```javascript
function highlightText(text, query) {
    if (!query || !text) return escapeHtml(text);
    const regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
    return escapeHtml(text).replace(regex, '<span class="search-highlight">$1</span>');
}
```

此函式先對文字進行 `escapeHtml()`，然後使用 `.replace()` 在已跳脫的文字中插入 HTML 標籤。目前的實作邏輯是正確的（先跳脫再插入安全的 HTML），但 `renderSearchResults()` 中（第 629-641 行）使用字串拼接直接注入 HTML：

```javascript
html += '<a class="search-result-item" href="/Aquarium/' + animal.index + '" ...';
```

`animal.index` 來自 JSON 資料（由伺服器端產生），理論上是安全的整數值。但 `image` 欄位（第 631 行）直接透過 `escapeHtml()` 處理後插入到 `src` 和 `onerror` 屬性中，若 `escapeHtml` 未正確處理所有 URL 攻擊向量（如 `javascript:` 協議），仍可能存在風險。

**修正建議**：
- 驗證 `animal.index` 為整數：`parseInt(animal.index, 10)`
- 對 `image` URL 進行額外的協議白名單檢查
- 移除搜尋結果中圖片的 `onerror` 屬性（第 631 行），改由全域錯誤處理器處理

---

### 4. 【正確性】`OnGetAsync` 中 `GetAllAsync()` 和 `GetCountAsync()` 雙重載入資料

**檔案**：`Pages/Aquarium/Index.cshtml.cs`，第 109-110 行

```csharp
AllAnimals = await _aquariumService.GetAllAsync();
TotalCount = await _aquariumService.GetCountAsync();
```

這兩個方法各自獨立呼叫 `_jsonDataService.LoadAquariumAnimalsAsync()`，造成同一筆資料被載入兩次。雖然 `IJsonDataService` 可能有快取機制，但這仍然是不必要的重複呼叫。

**修正建議**：直接從 `AllAnimals` 計算數量：

```csharp
AllAnimals = await _aquariumService.GetAllAsync();
TotalCount = AllAnimals.Count();  // 或使用 AllAnimals 如果已經是 List
```

或者在 Service 層提供一個方法同時返回資料和數量。

---

## 🟡 Suggestions 改進建議

### 1. 【效能】`AquariumService` 每個方法都重新載入全部資料

**檔案**：`Services/AquariumService.cs`，多處

`GetAllAsync()`、`GetByIdAsync()`、`SearchAsync()`、`GetByHabitatZoneAsync()`、`GetCountAsync()`、`GetByIndexAsync()` — 每個方法都呼叫 `_jsonDataService.LoadAquariumAnimalsAsync()`。

雖然 `IJsonDataService` 可能實作了快取（Singleton 生命週期暗示如此），但此設計使得 `AquariumService` 無法獨立於 `IJsonDataService` 的快取策略進行最佳化。且在 `OnGetAsync` 中，一次頁面請求可能觸發 3 次載入（`GetAllAsync` + `GetCountAsync` + `GetByIndexAsync`）。

**建議**：考慮在 `AquariumService` 層級實作內部快取或在 PageModel 中使用單一呼叫取得所有需要的資料：

```csharp
public async Task OnGetAsync(int? index = null)
{
    var allAnimals = await _aquariumService.GetAllAsync();
    AllAnimals = allAnimals;
    TotalCount = allAnimals.Count();  // 避免額外呼叫 GetCountAsync
    
    if (pageIndex >= 0 && pageIndex < TotalCount)
    {
        CurrentAnimal = allAnimals.ElementAtOrDefault(pageIndex);  // 避免額外呼叫 GetByIndexAsync
    }
}
```

---

### 2. 【架構】Model 類別應考慮使用 `record` 型別

**檔案**：`Models/AquariumAnimal.cs`、`Models/LocalizedText.cs`、`Models/AquariumAnimalImages.cs`

這些模型類別本質上是不可變的資料傳輸物件（DTO），從 JSON 反序列化後不應被修改。使用 `class` 搭配 `get; set;` 允許不必要的可變性。

**建議**：改用 `record` 型別以獲得更好的不可變性保證和值語意：

```csharp
/// <summary>
/// 多語言文字，支援中文和英文
/// </summary>
public record LocalizedText
{
    public required string Zh { get; init; }
    public required string En { get; init; }
    
    public string GetText(string languageCode) =>
        languageCode?.ToLowerInvariant() == "en" ? En : Zh;
}
```

> **注意**：需確認 `System.Text.Json` 對 `record` + `required` + `init` 的反序列化支援（.NET 8+ 完整支援）。

---

### 3. 【正確性】`AquariumAnimalValidator` 未被實際使用

**檔案**：`Models/AquariumAnimalValidator.cs`

搜尋整個專案，`ValidateAnimal()`、`ValidateDescription()`、`ValidateStory()`、`ValidateId()` 均未在任何地方被呼叫。驗證器存在但未被整合到資料載入流程中。

**建議**：在 `JsonDataService.LoadAquariumAnimalsAsync()` 或 `AquariumService.GetAllAsync()` 中加入驗證邏輯，在資料載入時檢查格式是否正確：

```csharp
public async Task<IEnumerable<AquariumAnimal>> GetAllAsync()
{
    var data = await _jsonDataService.LoadAquariumAnimalsAsync();
    
    foreach (var animal in data.Animals)
    {
        var validationResults = AquariumAnimalValidator.ValidateAnimal(animal);
        foreach (var result in validationResults)
        {
            _logger.LogWarning("動物資料驗證失敗 [{AnimalId}]: {Error}", animal.Id, result.ErrorMessage);
        }
    }
    
    return data.Animals;
}
```

---

### 4. 【安全性】`AquariumAnimalData.Animals` 直接暴露內部可變集合

**檔案**：`Models/AquariumAnimalData.cs`，第 20 行

```csharp
public List<AquariumAnimal> Animals { get; set; } = [];
```

`AquariumService` 直接返回 `data.Animals`（一個 `List<T>` 引用）。由於 Service 是 Singleton，任何消費者取得此引用後都能修改共享列表（例如新增、刪除、排序），影響其他請求。

**建議**：Service 層返回時使用不可變集合或防禦性複製：

```csharp
// 選項 A：返回 IReadOnlyList
public async Task<IReadOnlyList<AquariumAnimal>> GetAllAsync()
{
    var data = await _jsonDataService.LoadAquariumAnimalsAsync();
    return data.Animals.AsReadOnly();
}

// 選項 B：將 Model 改為 IReadOnlyList
public class AquariumAnimalData
{
    public IReadOnlyList<AquariumAnimal> Animals { get; set; } = [];
}
```

---

### 5. 【正確性】`GetCountAsync` 吞掉異常並返回 0

**檔案**：`Services/AquariumService.cs`，第 134-147 行

```csharp
public async Task<int> GetCountAsync()
{
    try
    {
        var data = await _jsonDataService.LoadAquariumAnimalsAsync();
        return data.Animals.Count;
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "取得水族館動物總數時發生錯誤");
        return 0;  // 靜默返回 0
    }
}
```

當資料載入失敗時，此方法靜默返回 `0` 而非讓例外傳播。這導致呼叫方無法區分「沒有動物」和「載入失敗」兩種情境。在 `OnGetAsync` 中，`GetCountAsync` 返回 0 可能導致封面頁的「開始探索」按鈕被隱藏（`CanEnterFromCover => TotalCount > 0`），但錯誤卻不會被捕獲。

**建議**：讓異常傳播，由上層統一處理：

```csharp
public async Task<int> GetCountAsync()
{
    _logger.LogDebug("取得水族館動物總數");
    var data = await _jsonDataService.LoadAquariumAnimalsAsync();
    return data.Animals.Count;
}
```

---

### 6. 【效能 / 前端】所有動物資料被序列化到每個頁面的 HTML 中

**檔案**：`Pages/Aquarium/Index.cshtml`，第 212-231 行

```html
<script id="aquarium-animals-data" type="application/json">
@Html.Raw(System.Text.Json.JsonSerializer.Serialize(Model.AllAnimals.Select(a => new { ... })))
</script>
```

即使目前只有 16 隻動物，所有動物的完整資料（名稱、棲息地、食性、地點、描述、圖片路徑等）都被內嵌到每個頁面的 HTML 中。這增加了：
- 每個頁面的 HTML 大小（每個動物約 300-500 bytes，目前約 5-8KB）
- 初始頁面解析時間
- 隨動物數量增長線性膨脹

**建議**：
- **短期**：目前 16 隻動物的資料量可接受（~5KB gzipped < 2KB），暫時不需要修改
- **長期**：若動物數量超過 50 隻，考慮使用 API endpoint 提供搜尋功能，而非將所有資料嵌入頁面

---

### 7. 【可維護性】`_AnimalCard.cshtml` 中的食性分類邏輯硬編碼

**檔案**：`Pages/Aquarium/_AnimalCard.cshtml`，第 42-48 行

```csharp
var dietLower = Model.Diet.En.ToLowerInvariant();
var isCarnivore = dietLower.Contains("carnivore");
var isOmnivore = dietLower.Contains("omnivore");
var dietClass = isCarnivore ? "attribute-diet carnivore" : "attribute-diet";
var dietIcon = isCarnivore ? "🍖" : (isOmnivore ? "🍽️" : "🌿");
```

食性的圖示和 CSS 類別判斷基於英文字串的子字串比對，缺乏可擴展性。同樣的邏輯在 `aquarium.js`（第 623-627 行）中也有一份重複實作。

**建議**：在 Model 層加入食性類型的 enum 和對應的顯示方法，類似 `HabitatZone` 的設計：

```csharp
public enum DietType
{
    Carnivore,    // 肉食性
    Herbivore,    // 草食性
    Omnivore,     // 雜食性
    FilterFeeder  // 濾食性
}
```

---

### 8. 【無障礙】搜尋結果的鍵盤導航缺少 `aria-activedescendant`

**檔案**：`wwwroot/js/aquarium.js`，第 714-757 行

搜尋結果的鍵盤導航（↑↓ 鍵）更新了視覺選取狀態，但未設定 `aria-activedescendant` 屬性，螢幕閱讀器無法知道當前選取了哪個結果。

**建議**：為每個搜尋結果項目加入唯一 ID，並在搜尋框上設定 `aria-activedescendant`：

```javascript
function updateSelectedSearchItem(items) {
    const searchInput = document.getElementById('animal-search-input');
    items.forEach(function (item, idx) {
        item.id = 'search-result-' + idx;
        if (idx === selectedSearchIndex) {
            item.classList.add('selected');
            item.setAttribute('aria-selected', 'true');
            item.scrollIntoView({ block: 'nearest' });
            if (searchInput) {
                searchInput.setAttribute('aria-activedescendant', item.id);
            }
        } else {
            item.classList.remove('selected');
            item.setAttribute('aria-selected', 'false');
        }
    });
}
```

---

### 9. 【正確性】`MutationObserver` 未在頁面離開時斷開

**檔案**：`wwwroot/js/aquarium.js`，第 297-319 行

```javascript
function observeNewImages() {
    const observer = new MutationObserver(function (mutations) { ... });
    observer.observe(document.body, { childList: true, subtree: true });
}
```

`MutationObserver` 被建立後全域監聽 DOM 變更，但從未呼叫 `observer.disconnect()`。在 SPA 環境或頁面長時間存活的情境下可能造成記憶體洩漏。

**建議**：保存 observer 引用並在適當時機斷開：

```javascript
let imageObserver = null;

function observeNewImages() {
    if (imageObserver) imageObserver.disconnect();
    imageObserver = new MutationObserver(function (mutations) { ... });
    imageObserver.observe(document.body, { childList: true, subtree: true });
}
```

---

### 10. 【可維護性】`aquarium.js` 公開 API 宣告位置不一致

**檔案**：`wwwroot/js/aquarium.js`，第 458-469 行

```javascript
window.AquariumApp = {
    getCurrentLanguage: getCurrentLanguage,
    // ...
    performSearch: performSearch,  // 定義在第 546 行
    clearSearch: clearSearch,       // 定義在第 814 行
    openImageLightbox: openImageLightbox,  // 定義在第 914 行
    closeImageLightbox: closeImageLightbox  // 定義在第 952 行
};
```

`window.AquariumApp` 的宣告出現在檔案中間（第 458 行），但引用了在後面才定義的函式（如 `performSearch` 第 546 行、`openImageLightbox` 第 914 行）。這依賴 JavaScript 的 function hoisting 機制才能正常運作。

**建議**：將 `window.AquariumApp` 的宣告移到 IIFE 的最尾端（在 `})();` 之前），提高可讀性且更明確展示模組的公開介面。

---

### 11. 【測試】完全缺少單元測試

整個 Aquarium 功能沒有任何測試檔案。`AquariumService`、`IndexModel`、`AquariumAnimalValidator` 都是可測試的邏輯，應有對應的單元測試。

**建議**：優先為以下場景撰寫測試：

```
1. AquariumService.GetByIndexAsync — 邊界值測試（index = -1, 0, count-1, count）
2. AquariumService.SearchAsync — 中英文搜尋、空關鍵字、特殊字元
3. IndexModel.OnGetAsync — 封面頁、有效索引、超出範圍索引、載入失敗
4. AquariumAnimalValidator — 各種驗證規則的正向和反向測試
5. HabitatZoneExtensions.ParseHabitatZone — 所有有效值和無效值
```

---

### 12. 【正確性】`ParseHabitatZone` 的預設值可能造成資料誤解

**檔案**：`Models/HabitatZone.cs`，第 70-78 行

```csharp
public static HabitatZone ParseHabitatZone(string? value) => value?.ToLowerInvariant() switch
{
    // ...
    _ => HabitatZone.Saltwater // 預設為海水
};
```

當傳入無法識別的區域字串（包括 `null`）時，靜默回傳 `Saltwater`。這可能導致新增的區域類型在未更新此方法時被錯誤歸類。

**建議**：記錄警告或使用明確的 `Unknown` 類型：

```csharp
_ => throw new ArgumentException($"無法識別的 HabitatZone 值：{value}", nameof(value))
// 或者
_ => HabitatZone.Saltwater  // 保留預設，但加上日誌記錄
```

---

## ✅ Good Practices 良好實踐

### 1. ✅ 完善的 XML 文件注釋

所有公開 API（`IAquariumService`、`IndexModel`、Model 類別）都有完整的 XML 文件注釋，包含 `<summary>`、`<param>`、`<returns>` 和 `<example>` 標籤。這大幅降低了新開發者理解程式碼的門檻。

### 2. ✅ 正確使用 nullable reference types

整個 Aquarium 功能正確地使用了 `is null` / `is not null` 進行空值檢查（如 `IndexModel` 第 124 行、`_AnimalCard.cshtml` 第 78 行），並透過 `required` 關鍵字明確標示必要屬性，完全符合 C# 的 nullable 最佳實踐。

### 3. ✅ 結構化日誌（Structured Logging）

Service 層和 PageModel 都使用了結構化日誌參數（如 `_logger.LogInformation("載入水族館介紹頁面，索引：{Index}", pageIndex)`），而非字串插值。這確保了日誌在 Serilog 等結構化日誌系統中可被正確索引和查詢。

### 4. ✅ 防禦性程式設計

- `AquariumService` 建構函式中使用 `?? throw new ArgumentNullException(nameof(...))` 進行參數檢查
- `OnGetAsync` 中對索引越界進行了夾值處理（clamp）
- 前端 `handleImageError` 使用 `dataset.errorHandled` 防止圖片錯誤的無限循環
- JavaScript 導航使用 debounce 機制防止快速連點

### 5. ✅ 良好的關注點分離（Separation of Concerns）

架構清楚地分層：
- **Model 層**：`AquariumAnimal`、`HabitatZone`、`LocalizedText` — 純粹的領域模型
- **Service 層**：`IAquariumService` / `AquariumService` — 資料存取邏輯
- **Presentation 層**：`IndexModel` — 頁面邏輯；`_AnimalCard.cshtml` — 可重用的 Partial View

### 6. ✅ 完整的無障礙功能（Accessibility）

- 搜尋結果使用 `role="listbox"` 和 `role="option"` 語意角色
- `aria-live="polite"` 公告搜尋結果數量給螢幕閱讀器
- Lightbox 圖片設定了 `tabindex="0"` 和 `role="button"` 使其可透過鍵盤操作
- ESC 鍵關閉 Lightbox、搜尋結果支援 ↑↓ 鍵盤導航

### 7. ✅ HabitatZone 的 Switch Expression 設計

`HabitatZone` 的擴充方法使用 switch expression，搭配 `GetDisplayName()` 和 `GetCssClass()` 模式，將顯示邏輯集中管理。這是一個良好的 enum + extension method 設計模式，避免了在多處分散處理顯示邏輯。

### 8. ✅ 前端 XSS 防護

JavaScript 中實作了 `escapeHtml()` 和 `escapeRegExp()` 工具函式，在搜尋結果渲染時正確跳脫使用者輸入，展現了安全意識。

### 9. ✅ 使用 `GeneratedRegex` source generator

`AquariumAnimalValidator` 使用 `[GeneratedRegex]` 編譯時生成正則表達式，比 `new Regex()` 有更好的效能和記憶體效率，是 C# 現代化的良好實踐。

### 10. ✅ 錯誤處理的使用者體驗

`Index.cshtml` 提供了完整的錯誤頁面 UI（第 12-33 行），包含：
- 視覺化的錯誤圖示和說明
- 「重新載入」按鈕
- 「回到首頁」連結
- 多語言支援

這展現了對使用者體驗的良好考量，不會讓使用者看到技術性錯誤訊息。

---

## 📊 Metrics 統計

| 指標 | 數值 |
|------|------|
| 審查檔案數 | 12 個（3 Razor + 6 Models + 2 Services + 1 JS） |
| 🔴 嚴重問題 | 4 |
| 🟡 改進建議 | 12 |
| ✅ 良好實踐 | 10 |
| 程式碼總行數 | ~2,700+ 行 |
| 測試覆蓋率 | 0%（無測試檔案） |
| **判定** | **⚠️ Needs Minor Changes** |

---

## 🎯 優先修正建議（Priority Action Plan）

依照嚴重程度與修正成本排列：

| 優先級 | 項目 | 影響 | 預估工作量 |
|--------|------|------|-----------|
| 🔴 P0 | 修正 `ToList().IndexOf()` O(n²) 問題 | 效能 | 5 分鐘 |
| 🔴 P0 | 移除 `onerror` 行內事件處理器 | 安全性 | 10 分鐘 |
| 🔴 P1 | 減少 `OnGetAsync` 重複資料載入 | 效能 | 15 分鐘 |
| 🟡 P1 | 暴露內部可變集合改為 `IReadOnlyList` | 正確性 | 20 分鐘 |
| 🟡 P1 | 修正 `GetCountAsync` 異常處理 | 正確性 | 5 分鐘 |
| 🟡 P2 | 新增搜尋結果 `aria-activedescendant` | 無障礙 | 15 分鐘 |
| 🟡 P2 | 撰寫核心邏輯的單元測試 | 品質 | 2-4 小時 |
| 🟡 P3 | Model 類別改用 `record` 型別 | 架構 | 30 分鐘 |
| 🟡 P3 | 整合 `AquariumAnimalValidator` | 品質 | 30 分鐘 |

---

## 📝 附錄：審查檔案清單

| 檔案路徑 | 行數 | 審查深度 |
|----------|------|---------|
| `Pages/Aquarium/Index.cshtml` | 235 | 🔍 深度審查 |
| `Pages/Aquarium/Index.cshtml.cs` | 153 | 🔍 深度審查 |
| `Pages/Aquarium/_AnimalCard.cshtml` | 128 | 🔍 深度審查 |
| `Models/AquariumAnimal.cs` | 52 | 🔍 深度審查 |
| `Models/HabitatZone.cs` | 80 | 🔍 深度審查 |
| `Models/AquariumAnimalImages.cs` | 23 | 🔍 深度審查 |
| `Models/AquariumAnimalData.cs` | 22 | 🔍 深度審查 |
| `Models/AquariumAnimalValidator.cs` | 114 | 🔍 深度審查 |
| `Services/IAquariumService.cs` | ~40 | 🔍 深度審查 |
| `Services/AquariumService.cs` | 169 | 🔍 深度審查 |
| `wwwroot/js/aquarium.js` | 968 | 🔍 深度審查 |
| `wwwroot/css/aquarium.css` | 1350 | 👀 快速掃描 |

---

*報告由 Copilot Code Review Skill 生成 — 2026-03-21*
