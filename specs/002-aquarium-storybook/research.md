# 研究文件：水族館動物介紹故事書

**功能分支**: `002-aquarium-storybook`  
**日期**: 2025-11-30  
**狀態**: 完成

## 研究摘要

本文件記錄水族館動物介紹故事書系統開發前的技術研究，解決所有需要澄清的問題並確立最佳實踐。系統參照現有恐龍故事書 (001) 架構，確保一致性和程式碼重用。

---

## 1. 架構重用策略

### Decision: 參照恐龍故事書架構，建立平行結構

### Rationale

- **一致性**: 兩個故事書功能使用相同架構，降低維護複雜度
- **程式碼重用**: 共用 `LocalizedText` 模型和 `IJsonDataService` 介面
- **學習曲線**: 開發者熟悉恐龍故事書後，可快速上手水族館功能
- **測試策略**: 相同的測試模式，減少測試程式碼重複

### 共用元件

| 元件 | 類型 | 說明 |
|------|------|------|
| `LocalizedText` | Model | 中英文多語言文字 |
| `IJsonDataService` | Interface | JSON 資料載入服務介面 |
| `_Layout.cshtml` | View | 共用版面配置 |
| `_LanguageSwitcher.cshtml` | Partial | 語言切換元件 |

### 新增元件

| 元件 | 類型 | 說明 |
|------|------|------|
| `AquariumAnimal` | Model | 水族館動物實體 |
| `IAquariumService` | Interface | 水族館動物服務介面 |
| `AquariumService` | Service | 水族館動物服務實作 |
| `/Pages/Aquarium/` | Pages | 水族館相關頁面 |

### Alternatives Considered

| 方案 | 優點 | 缺點 | 結論 |
|------|------|------|------|
| 合併恐龍和水族館為單一模組 | 程式碼共用更多 | 耦合度高、難以獨立測試 | ❌ 不採用 |
| 完全獨立實作 | 解耦、彈性高 | 重複程式碼多、不一致風險 | ❌ 不採用 |
| **平行結構 + 共用基礎** | 一致性、適度重用 | 需維護兩套類似程式碼 | ✅ 採用 |

---

## 2. 生活區域分類實作

### Decision: 使用 enum 搭配 LocalizedText 顯示名稱

### Rationale

- **類型安全**: enum 確保分類值的正確性
- **可擴充**: 未來可輕鬆新增其他區域
- **多語言**: 分類名稱支援中英文顯示

### Implementation Pattern

```csharp
/// <summary>
/// 水族館動物生活區域分類
/// </summary>
public enum HabitatZone
{
    /// <summary>淡水區域</summary>
    Freshwater,
    
    /// <summary>海水區域</summary>
    Saltwater,
    
    /// <summary>深海區域</summary>
    DeepSea,
    
    /// <summary>珊瑚礁區域</summary>
    CoralReef,
    
    /// <summary>極地區域</summary>
    Polar
}

/// <summary>
/// 區域分類擴充方法
/// </summary>
public static class HabitatZoneExtensions
{
    public static LocalizedText GetDisplayName(this HabitatZone zone) => zone switch
    {
        HabitatZone.Freshwater => new LocalizedText { Zh = "淡水", En = "Freshwater" },
        HabitatZone.Saltwater => new LocalizedText { Zh = "海水", En = "Saltwater" },
        HabitatZone.DeepSea => new LocalizedText { Zh = "深海", En = "Deep Sea" },
        HabitatZone.CoralReef => new LocalizedText { Zh = "珊瑚礁", En = "Coral Reef" },
        HabitatZone.Polar => new LocalizedText { Zh = "極地", En = "Polar" },
        _ => new LocalizedText { Zh = "未知", En = "Unknown" }
    };
}
```

### JSON 儲存方式

```json
{
  "habitatZone": "saltwater"
}
```

### Alternatives Considered

| 方案 | 優點 | 缺點 | 結論 |
|------|------|------|------|
| 純字串分類 | 簡單、彈性 | 無類型檢查、拼字錯誤風險 | ❌ 不採用 |
| 獨立 HabitatZone 實體表 | 完整正規化 | 過度設計、增加複雜度 | ❌ 不採用 |
| **enum + 擴充方法** | 類型安全、可擴充、簡潔 | 新增分類需修改程式碼 | ✅ 採用 |

---

## 3. 動物小故事設計

### Decision: 每個動物包含 100-150 字的小故事，儲存於同一 JSON 物件

### Rationale

- **規格需求**: FR-005 和 FR-019 明確要求每個動物有一個相關小故事（100-150 字）
- **簡單性**: 故事與動物資料儲存在同一 JSON 物件，減少資料關聯複雜度
- **可讀性**: 故事內容適合孩童閱讀，使用簡單詞彙和有趣情節

### Story 設計原則

1. **字數限制**: 中文 100-150 字、英文對應翻譯
2. **角色設定**: 為動物取一個可愛的名字（如：小丑魚尼尼、海龜慢慢）
3. **故事結構**: 簡單的起承轉合，傳達動物特性或有趣知識
4. **正向訊息**: 包含友善、勇敢、好奇等正面價值觀

### JSON 結構

```json
{
  "story": {
    "zh": "小丑魚尼尼住在一個漂亮的海葵裡...",
    "en": "Nini the clownfish lives in a beautiful anemone..."
  }
}
```

---

## 4. 搜尋功能實作

### Decision: 前端過濾 + Debounce（與恐龍故事書相同）

### Rationale

- **一致性**: 與恐龍故事書使用相同實作方式
- **效能**: 15 隻動物的資料量小，前端過濾即可
- **即時性**: 無 Server Round-trip 延遲
- **搜尋範圍**: 比對名稱、生活環境、食性（符合規格 FR-009）

### 搜尋欄位

| 欄位 | 中文 | 英文 | 說明 |
|------|------|------|------|
| `name` | ✅ | ✅ | 動物名稱 |
| `habitat` | ✅ | ✅ | 生活環境描述 |
| `diet` | ✅ | ✅ | 食性 |

### Implementation Pattern

```javascript
function filterAnimals(keyword) {
    const lang = localStorage.getItem('language') || 'zh';
    const lowerKeyword = keyword.toLowerCase();
    
    return allAnimals.filter(animal => {
        const name = animal.name[lang].toLowerCase();
        const habitat = animal.habitat[lang].toLowerCase();
        const diet = animal.diet[lang].toLowerCase();
        
        return name.includes(lowerKeyword) || 
               habitat.includes(lowerKeyword) || 
               diet.includes(lowerKeyword);
    });
}
```

---

## 5. 換頁瀏覽實作

### Decision: 童書翻頁模式 + SPA-like 換頁（與恐龍故事書相同）

### Rationale

- **規格需求**: FR-003、FR-020 明確要求童書翻頁模式，每頁只顯示單一動物
- **使用者體驗**: 無頁面重新載入，切換流暢
- **簡單性**: 所有資料已載入前端，JavaScript 控制顯示

### 換頁行為

- 第一隻動物：「上一頁」按鈕 disabled（FR-008）
- 最後一隻動物：「下一頁」按鈕 disabled（FR-008）
- 按鈕尺寸：大且明顯，方便孩童點擊（FR-007）

### Implementation Pattern

```javascript
let currentIndex = 0;
const animals = [...]; // 從 JSON 載入

function showAnimal(index) {
    if (index < 0 || index >= animals.length) return;
    currentIndex = index;
    updateDisplay(animals[currentIndex]);
    updateNavigationButtons();
}

function updateNavigationButtons() {
    document.getElementById('prevBtn').disabled = (currentIndex === 0);
    document.getElementById('nextBtn').disabled = (currentIndex === animals.length - 1);
}

function nextAnimal() {
    showAnimal(currentIndex + 1);
}

function prevAnimal() {
    showAnimal(currentIndex - 1);
}
```

---

## 6. 多語言實作

### Decision: JSON 內嵌多語言 + Cookie 持久化（與恐龍故事書相同）

### Rationale

- **規格需求**: FR-011、FR-018 要求支援中英文切換並使用 Cookie 保存偏好
- **一致性**: 與恐龍故事書相同實作方式
- **簡單性**: 語言切換在前端處理，無需 Server Round-trip

### Cookie 設定

```javascript
function setLanguage(lang) {
    // 設定 Cookie，有效期 365 天
    document.cookie = `language=${lang};path=/;max-age=${365*24*60*60}`;
    localStorage.setItem('language', lang);
    updatePageLanguage();
}

function getLanguage() {
    // 優先從 Cookie 讀取，次之 localStorage，預設中文
    const cookieMatch = document.cookie.match(/language=(\w+)/);
    if (cookieMatch) return cookieMatch[1];
    return localStorage.getItem('language') || 'zh';
}
```

---

## 7. Lightbox 圖片檢視

### Decision: 使用原生 JavaScript + CSS Modal（與恐龍故事書相同）

### Rationale

- **規格需求**: FR-010 要求支援點擊圖片查看大圖
- **零相依**: 無需額外函式庫
- **一致性**: 與恐龍故事書相同實作方式

### Implementation Pattern

```html
<!-- Modal 結構 -->
<div id="imageModal" class="modal" onclick="closeModal()">
    <img id="modalImage" src="" alt="">
    <span class="close">&times;</span>
</div>
```

```javascript
function openModal(imageSrc, altText) {
    const modal = document.getElementById('imageModal');
    const modalImg = document.getElementById('modalImage');
    modalImg.src = imageSrc;
    modalImg.alt = altText;
    modal.style.display = 'flex';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

// ESC 鍵關閉
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});
```

---

## 8. UI 設計模式

### Decision: Bootstrap 5 + 自訂 CSS 主題（海洋風格）

### Rationale

- **一致性**: 與恐龍故事書相同基礎框架
- **特色**: 使用海洋色系區分水族館和恐龍主題
- **兒童友善**: 大按鈕、圓角、可愛圖示

### 海洋風格色系

```css
/* 水族館主題 */
:root {
    --aquarium-primary: #0077B6;     /* 海洋藍 */
    --aquarium-secondary: #00B4D8;   /* 淺藍 */
    --aquarium-accent: #48CAE4;      /* 青色 */
    --aquarium-light: #CAF0F8;       /* 淡藍 */
    --aquarium-dark: #03045E;        /* 深藍 */
    --aquarium-coral: #FF6B6B;       /* 珊瑚紅（點綴色） */
    --aquarium-sand: #F9F3E3;        /* 沙灘色（背景） */
    --border-radius: 20px;           /* 圓角 - 可愛 */
}

/* 大按鈕 - 兒童友善 */
.btn-aquarium {
    padding: 15px 40px;
    font-size: 1.5rem;
    border-radius: var(--border-radius);
    background-color: var(--aquarium-primary);
    color: white;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.btn-aquarium:hover {
    background-color: var(--aquarium-secondary);
    transform: translateY(-2px);
}
```

### 區域分類標籤樣式

```css
.zone-badge {
    padding: 5px 15px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: bold;
}

.zone-freshwater { background-color: #81C784; color: white; }
.zone-saltwater { background-color: #64B5F6; color: white; }
.zone-deepsea { background-color: #5C6BC0; color: white; }
.zone-coralreef { background-color: #FF8A65; color: white; }
.zone-polar { background-color: #90CAF9; color: #1565C0; }
```

---

## 9. 測試策略

### Decision: xUnit + Moq + WebApplicationFactory（與恐龍故事書相同）

### 單元測試

```csharp
// AquariumServiceTests.cs
public class AquariumServiceTests
{
    [Fact]
    public async Task GetAllAsync_ReturnsAllAnimals()
    {
        // Arrange
        var mockJsonService = new Mock<IJsonDataService>();
        mockJsonService.Setup(s => s.LoadAquariumAnimalsAsync())
            .ReturnsAsync(TestData.GetSampleAquariumAnimals());
        
        var service = new AquariumService(mockJsonService.Object);
        
        // Act
        var result = await service.GetAllAsync();
        
        // Assert
        Assert.Equal(15, result.Count());
    }
    
    [Theory]
    [InlineData("clownfish")]
    [InlineData("dolphin")]
    public async Task GetByIdAsync_ExistingId_ReturnsAnimal(string id)
    {
        // Arrange
        var service = CreateService();
        
        // Act
        var result = await service.GetByIdAsync(id);
        
        // Assert
        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
    }
    
    [Fact]
    public async Task SearchAsync_MatchingKeyword_ReturnsFilteredResults()
    {
        // Arrange
        var service = CreateService();
        
        // Act
        var result = await service.SearchAsync("珊瑚", "zh");
        
        // Assert
        Assert.All(result, animal => 
            Assert.True(
                animal.Name.Zh.Contains("珊瑚") ||
                animal.Habitat.Zh.Contains("珊瑚") ||
                animal.Diet.Zh.Contains("珊瑚")
            ));
    }
    
    [Fact]
    public async Task GetByHabitatZoneAsync_ValidZone_ReturnsFilteredResults()
    {
        // Arrange
        var service = CreateService();
        
        // Act
        var result = await service.GetByHabitatZoneAsync(HabitatZone.CoralReef);
        
        // Assert
        Assert.All(result, animal => 
            Assert.Equal(HabitatZone.CoralReef, animal.HabitatZone));
    }
}
```

### 整合測試

```csharp
// AquariumPagesTests.cs
public class AquariumPagesTests : IClassFixture<WebApplicationFactory<Program>>
{
    private readonly HttpClient _client;

    public AquariumPagesTests(WebApplicationFactory<Program> factory)
    {
        _client = factory.CreateClient();
    }

    [Fact]
    public async Task AquariumIndex_ReturnsSuccessAndCorrectContent()
    {
        var response = await _client.GetAsync("/Aquarium");
        
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("水族館", content);
    }
    
    [Fact]
    public async Task HomePage_ContainsAquariumButton()
    {
        var response = await _client.GetAsync("/");
        
        response.EnsureSuccessStatusCode();
        var content = await response.Content.ReadAsStringAsync();
        Assert.Contains("水族館動物介紹", content);
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

## 10. 水族館動物資料規劃

### Decision: 15 種動物，涵蓋五大區域

### 動物清單

| ID | 中文名稱 | 英文名稱 | 區域 |
|----|----------|----------|------|
| clownfish | 小丑魚 | Clownfish | 珊瑚礁 |
| sea-turtle | 海龜 | Sea Turtle | 海水 |
| dolphin | 海豚 | Dolphin | 海水 |
| jellyfish | 水母 | Jellyfish | 海水 |
| seahorse | 海馬 | Seahorse | 珊瑚礁 |
| octopus | 章魚 | Octopus | 海水 |
| penguin | 企鵝 | Penguin | 極地 |
| seal | 海豹 | Seal | 極地 |
| goldfish | 金魚 | Goldfish | 淡水 |
| koi | 錦鯉 | Koi | 淡水 |
| anglerfish | 鮟鱇魚 | Anglerfish | 深海 |
| giant-squid | 大王烏賊 | Giant Squid | 深海 |
| shark | 鯊魚 | Shark | 海水 |
| manta-ray | 鬼蝠魟 | Manta Ray | 海水 |
| starfish | 海星 | Starfish | 珊瑚礁 |

### 區域分佈

| 區域 | 動物數量 |
|------|----------|
| 海水 (Saltwater) | 5 |
| 珊瑚礁 (Coral Reef) | 3 |
| 淡水 (Freshwater) | 2 |
| 深海 (Deep Sea) | 2 |
| 極地 (Polar) | 3 |

---

## 11. 圖片素材策略

### Decision: AI 繪圖 + 佔位圖備案（與恐龍故事書相同）

### 圖片規格

| 類型 | 尺寸 | 格式 | 說明 |
|------|------|------|------|
| 主圖 | 800x600 | PNG/WebP | 動物介紹頁面 |
| 故事插圖 | 600x400 | PNG/WebP | 小故事配圖 |
| 縮圖 | 200x150 | PNG/WebP | 搜尋結果列表 |
| 佔位圖 | 800x600 | PNG | 載入失敗備用 |

### AI 繪圖提示詞範例

```text
Cute cartoon aquarium animal illustration for children's book,
[animal name], friendly expression, soft ocean colors,
digital art style similar to Animal Crossing,
white background, high quality, 800x600 pixels
```

---

## 12. 錯誤處理策略

### Decision: 使用者友善訊息 + 日誌記錄（與恐龍故事書相同）

### 前端錯誤處理

```javascript
// 圖片載入失敗
img.onerror = function() {
    this.src = '/images/aquarium/placeholder.png';
    this.alt = '圖片載入失敗';
};

// 搜尋無結果
if (results.length === 0) {
    showMessage('找不到符合的水族館動物，試試其他關鍵字吧！🐠');
}
```

### 後端錯誤處理

```csharp
try
{
    var json = await File.ReadAllTextAsync(jsonPath);
    return JsonSerializer.Deserialize<AquariumAnimalData>(json);
}
catch (FileNotFoundException ex)
{
    _logger.LogError(ex, "水族館動物資料檔案遺失: {Path}", jsonPath);
    throw new DataNotFoundException("水族館動物資料暫時無法使用，請稍後再試");
}
```

---

## 13. 效能最佳化

### 實施項目

| 項目 | 實作方式 | 預期效果 |
|------|----------|----------|
| JSON 快取 | Singleton 服務 | 啟動後不再讀取檔案 |
| 圖片延遲載入 | `loading="lazy"` | 減少初始載入時間 |
| CSS/JS 最小化 | 生產環境 bundling | 減少檔案大小 |
| 靜態檔案快取 | 設定 Cache-Control | 減少重複請求 |

---

## 14. 日誌策略 (Serilog)

### Decision: 使用 Serilog 結構化日誌（與恐龍故事書相同）

### 日誌層級使用

| 層級 | 使用場景 |
|------|----------|
| Debug | 詳細開發資訊、方法進入/離開 |
| Information | 重要業務事件（如：成功載入資料） |
| Warning | 非預期但可恢復的情況 |
| Error | 錯誤但不影響系統運作 |
| Critical | 系統無法繼續運作的錯誤 |

### 日誌範例

```csharp
_logger.LogInformation("載入水族館動物資料完成，共 {Count} 筆", animals.Count);
_logger.LogDebug("搜尋水族館動物：關鍵字={Keyword}, 語言={Language}", keyword, language);
_logger.LogWarning("找不到水族館動物：{Id}", id);
_logger.LogError(ex, "讀取水族館動物 JSON 檔案失敗：{Path}", path);
```
