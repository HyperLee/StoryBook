# 研究文件：恐龍故事書系統

**功能分支**: `001-dinosaur-storybook`  
**日期**: 2025-11-30  
**狀態**: 完成

## 研究摘要

本文件記錄恐龍故事書系統開發前的技術研究，解決所有需要澄清的問題並確立最佳實踐。

---

## 1. JSON 資料存取最佳實踐

### Decision: 使用 `System.Text.Json` 搭配服務層封裝

### Rationale

- **效能**: `System.Text.Json` 是 .NET 內建的高效能 JSON 序列化程式庫
- **簡潔性**: 無需額外相依套件（如 Newtonsoft.Json）
- **可測試性**: 透過服務介面封裝，便於單元測試時 Mock
- **快取策略**: JSON 檔案在應用程式啟動時載入並快取於記憶體，避免重複讀取

### Implementation Pattern

```csharp
// 服務介面
public interface IDinosaurService
{
    Task<IEnumerable<Dinosaur>> GetAllAsync();
    Task<Dinosaur?> GetByIdAsync(string id);
    Task<IEnumerable<Dinosaur>> SearchAsync(string keyword, string language);
}

// 註冊為 Singleton（資料不會變動）
builder.Services.AddSingleton<IDinosaurService, DinosaurService>();
```

### Alternatives Considered

| 方案 | 優點 | 缺點 | 結論 |
|------|------|------|------|
| 直接在 PageModel 讀取 JSON | 簡單 | 重複程式碼、難測試 | ❌ 不採用 |
| Newtonsoft.Json | 功能豐富 | 額外相依、效能略差 | ❌ 不採用 |
| **System.Text.Json + Service** | 內建、高效、可測試 | - | ✅ 採用 |

---

## 2. 多語言 (i18n) 實作方式

### Decision: JSON 內嵌多語言 + JavaScript localStorage

### Rationale

- **簡單性**: 恐龍資料本身包含中英文，無需複雜的 i18n 框架
- **效能**: 語言切換在前端處理，無需 Server Round-trip
- **持久化**: 使用 `localStorage` 保存語言偏好，符合規格需求

### Implementation Pattern

```json
// dinosaurs.json 結構
{
  "name": {
    "zh": "暴龍",
    "en": "Tyrannosaurus Rex"
  }
}
```

```javascript
// 前端語言切換
const currentLang = localStorage.getItem('language') || 'zh';
document.querySelectorAll('[data-lang-zh]').forEach(el => {
    el.textContent = el.dataset[`lang${currentLang.charAt(0).toUpperCase() + currentLang.slice(1)}`];
});
```

### UI 文字處理

對於 UI 固定文字（按鈕、標籤等），採用以下方式：

- 在 Razor 頁面使用 `data-lang-zh` 和 `data-lang-en` 屬性
- JavaScript 根據當前語言顯示對應文字
- 無需後端 Resource 檔案，保持專案簡潔

### Alternatives Considered

| 方案 | 優點 | 缺點 | 結論 |
|------|------|------|------|
| ASP.NET Core Localization | 功能完整 | 對練習專案過於複雜 | ❌ 不採用 |
| 分離的語言 JSON 檔案 | 檔案整潔 | 管理多份檔案、不一致風險 | ❌ 不採用 |
| **內嵌多語言 + localStorage** | 簡單、前端處理 | 資料稍冗餘 | ✅ 採用 |

---

## 3. 圖片大圖檢視 (Lightbox) 實作

### Decision: 使用原生 JavaScript + CSS Modal

### Rationale

- **零相依**: 無需額外函式庫（如 Lightbox2、Fancybox）
- **可控性**: 完全掌控樣式和行為
- **效能**: 輕量，載入快速
- **學習價值**: 練習專案，適合學習原生實作

### Implementation Pattern

```html
<!-- Modal 結構 -->
<div id="imageModal" class="modal" onclick="closeModal()">
    <img id="modalImage" src="" alt="">
    <span class="close">&times;</span>
</div>
```

```javascript
function openModal(imageSrc) {
    document.getElementById('modalImage').src = imageSrc;
    document.getElementById('imageModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}
```

### Alternatives Considered

| 方案 | 優點 | 缺點 | 結論 |
|------|------|------|------|
| Lightbox2 | 功能豐富、動畫效果 | 額外相依、需 jQuery 插件 | ❌ 不採用 |
| Bootstrap Modal | 已有 Bootstrap | 不專為圖片設計 | ❌ 不採用 |
| **原生 JS + CSS** | 零相依、可控、輕量 | 需自行實作動畫 | ✅ 採用 |

---

## 4. 即時搜尋 (Real-time Search) 實作

### Decision: 前端過濾 + Debounce

### Rationale

- **效能**: 資料量小（5-8 隻恐龍），前端過濾即可
- **即時性**: 無 Server Round-trip 延遲
- **Debounce**: 避免每次按鍵都觸發過濾，提升效能

### Implementation Pattern

```javascript
let debounceTimer;
const searchInput = document.getElementById('searchInput');

searchInput.addEventListener('input', function() {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
        filterDinosaurs(this.value);
    }, 300); // 300ms debounce
});

function filterDinosaurs(keyword) {
    const lang = localStorage.getItem('language') || 'zh';
    // 過濾邏輯：比對名稱和介紹
}
```

### Alternatives Considered

| 方案 | 優點 | 缺點 | 結論 |
|------|------|------|------|
| 後端 API 搜尋 | 支援大量資料 | 此專案資料量小、增加延遲 | ❌ 不採用 |
| **前端過濾 + Debounce** | 即時、無延遲 | 僅適合小資料量 | ✅ 採用 |

---

## 5. 換頁瀏覽實作

### Decision: 單頁應用式換頁 (SPA-like)

### Rationale

- **使用者體驗**: 無頁面重新載入，切換流暢
- **簡單性**: 所有資料已載入前端，JavaScript 控制顯示
- **動畫效果**: 便於加入淡入淡出動畫

### Implementation Pattern

```javascript
let currentIndex = 0;
const dinosaurs = [...]; // 從 JSON 載入

function showDinosaur(index) {
    if (index < 0 || index >= dinosaurs.length) return;
    currentIndex = index;
    updateDisplay(dinosaurs[currentIndex]);
    updateNavigationButtons();
}

function nextDinosaur() {
    showDinosaur(currentIndex + 1);
}

function prevDinosaur() {
    showDinosaur(currentIndex - 1);
}
```

### 按鈕狀態管理

- 第一隻恐龍：「上一頁」按鈕 disabled
- 最後一隻恐龍：「下一頁」按鈕 disabled
- 按鈕尺寸：使用 Bootstrap `btn-lg` 類別，適合兒童點擊

---

## 6. 兒童友善 UI 設計模式

### Decision: Bootstrap 5 + 自訂 CSS 主題

### Rationale

- **基礎框架**: Bootstrap 5 提供響應式網格和基本元件
- **客製化**: 覆蓋 Bootstrap 變數實現可愛風格
- **無障礙**: Bootstrap 元件內建 ARIA 屬性

### Design Guidelines

```css
/* 可愛風格主題 */
:root {
    --primary-color: #4ECDC4;      /* 青色 - 友善 */
    --secondary-color: #FF6B6B;    /* 粉紅 - 活潑 */
    --background-color: #FFF9E6;   /* 米色 - 溫暖 */
    --text-color: #2C3E50;         /* 深藍灰 - 易讀 */
    --border-radius: 20px;         /* 圓角 - 可愛 */
}

/* 大按鈕 - 兒童友善 */
.btn-dinosaur {
    padding: 15px 40px;
    font-size: 1.5rem;
    border-radius: var(--border-radius);
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}
```

### 字體建議

- 主標題：`'Comic Sans MS'`, `cursive` 或 Google Fonts 的可愛字體
- 內文：系統預設字體，確保中文顯示正確

---

## 7. 測試策略

### Decision: xUnit + Moq + WebApplicationFactory

### Unit Tests (單元測試)

```csharp
// DinosaurServiceTests.cs
public class DinosaurServiceTests
{
    [Fact]
    public async Task GetAllAsync_ReturnsAllDinosaurs()
    {
        // Arrange
        var mockJsonService = new Mock<IJsonDataService>();
        mockJsonService.Setup(s => s.LoadDinosaursAsync())
            .ReturnsAsync(TestData.GetSampleDinosaurs());
        
        var service = new DinosaurService(mockJsonService.Object);
        
        // Act
        var result = await service.GetAllAsync();
        
        // Assert
        Assert.Equal(3, result.Count());
    }
}
```

### Integration Tests (整合測試)

```csharp
// DinosaurPagesTests.cs
public class DinosaurPagesTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public DinosaurPagesTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task HomePage_ContainsDinosaurButton()
    {
        var response = await _client.GetAsync("/");
        response.EnsureSuccessStatusCode();
        
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("恐龍介紹", content);
    }
}
```

### 測試覆蓋目標

| 層級 | 覆蓋目標 | 測試類型 |
|------|----------|----------|
| Models | 100% | 單元測試 |
| Services | 100% | 單元測試 + Mock |
| Pages | 關鍵路徑 | 整合測試 |
| JavaScript | 手動測試 | 瀏覽器測試 |

---

## 8. 圖片素材策略

### Decision: AI 繪圖 + 佔位圖備案

### Rationale

- **風格一致**: AI 繪圖可確保所有恐龍圖片風格統一
- **版權安全**: AI 產生的圖片無版權問題
- **備案**: 開發期間使用 placeholder 圖片

### 圖片規格

| 類型 | 尺寸 | 格式 | 說明 |
|------|------|------|------|
| 主圖 | 800x600 | PNG/WebP | 恐龍介紹頁面 |
| 故事插圖 | 600x400 | PNG/WebP | 小故事配圖 |
| 縮圖 | 200x150 | PNG/WebP | 搜尋結果列表 |
| 佔位圖 | 800x600 | PNG | 載入失敗備用 |

### AI 繪圖提示詞範例

```text
Cute cartoon dinosaur illustration for children's book, 
[dinosaur name], friendly expression, soft colors, 
digital art style similar to Animal Crossing, 
white background, high quality, 800x600 pixels
```

---

## 9. 錯誤處理策略

### Decision: 使用者友善訊息 + 日誌記錄

### 前端錯誤處理

```javascript
// 圖片載入失敗
img.onerror = function() {
    this.src = '/images/placeholder.png';
    this.alt = '圖片載入失敗';
};

// 搜尋無結果
if (results.length === 0) {
    showMessage('找不到符合的恐龍，試試其他關鍵字吧！🦕');
}
```

### 後端錯誤處理

```csharp
// JSON 載入失敗
try
{
    var json = await File.ReadAllTextAsync(jsonPath);
    return JsonSerializer.Deserialize<DinosaurData>(json);
}
catch (FileNotFoundException ex)
{
    _logger.LogError(ex, "恐龍資料檔案遺失: {Path}", jsonPath);
    throw new DataNotFoundException("恐龍資料暫時無法使用，請稍後再試");
}
```

---

## 10. 效能最佳化

### 實施項目

| 項目 | 實作方式 | 預期效果 |
|------|----------|----------|
| JSON 快取 | Singleton 服務 | 啟動後不再讀取檔案 |
| 圖片延遲載入 | `loading="lazy"` | 減少初始載入時間 |
| CSS/JS 最小化 | 生產環境 bundling | 減少檔案大小 |
| 靜態檔案快取 | 設定 Cache-Control | 減少重複請求 |

---

## 結論

所有技術決策已確定，無待澄清項目。可進入 Phase 1 設計階段。

| 項目 | 狀態 |
|------|------|
| JSON 資料存取 | ✅ 已決定 |
| 多語言實作 | ✅ 已決定 |
| 圖片大圖檢視 | ✅ 已決定 |
| 即時搜尋 | ✅ 已決定 |
| 換頁瀏覽 | ✅ 已決定 |
| UI 設計模式 | ✅ 已決定 |
| 測試策略 | ✅ 已決定 |
| 圖片素材 | ✅ 已決定 |
| 錯誤處理 | ✅ 已決定 |
| 效能最佳化 | ✅ 已決定 |
