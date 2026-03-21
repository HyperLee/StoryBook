/**
 * Aquarium Storybook JavaScript
 * 水族館動物介紹故事書互動功能
 * 
 * Created: 2025-11-30
 * Feature: 002-aquarium-storybook
 */

(function () {
    'use strict';

    // ==========================================================================
    // 狀態管理
    // ==========================================================================
    
    /** @type {string} 當前語言設定 */
    let currentLanguage = 'zh';
    
    /** @type {boolean} 是否正在導航中（防止快速連續點擊） */
    let isNavigating = false;
    
    /** @type {number|null} Debounce 計時器 */
    let navigationDebounceTimer = null;
    
    /** @const {number} 導航 Debounce 延遲（毫秒） */
    const NAVIGATION_DEBOUNCE_DELAY = 300;

    /** @type {Array} 動物資料陣列（供搜尋使用） */
    let animalsData = [];

    /** @type {number|null} 搜尋 Debounce 計時器 */
    let searchDebounceTimer = null;

    /** @const {number} 搜尋 Debounce 延遲（毫秒）- T035 */
    const SEARCH_DEBOUNCE_DELAY = 300;

    /** @type {number} 當前頁面索引 */
    let currentPageIndex = -1;

    /** @type {MutationObserver|null} 圖片監聽器引用 */
    let imageObserver = null;

    // ==========================================================================
    // 初始化
    // ==========================================================================

    /**
     * 頁面載入完成後初始化
     */
    document.addEventListener('DOMContentLoaded', function () {
        initLanguage();
        initAnimalsData();
        initNavigationButtons();
        initKeyboardNavigation();
        initImageErrorHandling();
        initPageTransition();
        initSearch();
        initImageLightbox();
        initLanguageChangeListener();  // T043: 監聽語言變更
    });

    /**
     * 初始化語言設定
     */
    function initLanguage() {
        const savedLang = localStorage.getItem('storybook-language');
        if (savedLang) {
            currentLanguage = savedLang;
        }
    }

    /**
     * 初始化動物資料（T034: 從頁面載入 JSON 資料）
     */
    function initAnimalsData() {
        const dataScript = document.getElementById('aquarium-animals-data');
        if (dataScript) {
            try {
                animalsData = JSON.parse(dataScript.textContent || '[]');
                // 取得當前頁面索引
                const pageInfo = document.querySelector('.page-number');
                if (pageInfo) {
                    currentPageIndex = parseInt(pageInfo.textContent, 10) - 1;
                }
            } catch (error) {
                console.warn('[AquariumApp] 無法解析動物資料:', error);
                animalsData = [];
            }
        }
    }

    // ==========================================================================
    // 換頁功能（User Story 3）
    // ==========================================================================

    /**
     * 初始化導航按鈕
     * 實作 T028: 換頁按鈕 UI 互動增強
     * 實作 T030: 首頁停用上一頁按鈕、末頁停用下一頁按鈕邏輯
     * 實作 T032: 快速連續點擊的 debounce 邏輯
     */
    function initNavigationButtons() {
        // 取得所有導航按鈕
        const prevButton = document.querySelector('.nav-button-prev');
        const nextButton = document.querySelector('.nav-button-next');
        
        // 為上一頁按鈕加入 debounce 點擊事件
        if (prevButton && !prevButton.classList.contains('disabled')) {
            prevButton.addEventListener('click', function (event) {
                handleNavigationClick(event, 'prev');
            });
        }
        
        // 為下一頁按鈕加入 debounce 點擊事件
        if (nextButton && !nextButton.classList.contains('disabled')) {
            nextButton.addEventListener('click', function (event) {
                handleNavigationClick(event, 'next');
            });
        }

        // 阻止停用按鈕的點擊事件
        const disabledButtons = document.querySelectorAll('.nav-button.disabled');
        disabledButtons.forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                event.stopPropagation();
            });
        });
    }

    /**
     * 處理導航按鈕點擊事件
     * 實作 T032: 處理快速連續點擊換頁按鈕的 debounce 邏輯
     * @param {Event} event - 點擊事件
     * @param {string} direction - 導航方向 ('prev' | 'next')
     */
    function handleNavigationClick(event, direction) {
        // 如果正在導航中，忽略點擊
        if (isNavigating) {
            event.preventDefault();
            return;
        }

        // 清除之前的 debounce 計時器
        if (navigationDebounceTimer) {
            clearTimeout(navigationDebounceTimer);
        }

        // 設定導航狀態
        isNavigating = true;
        
        // 加入頁面轉換動畫
        startPageTransition(direction);

        // 設定 debounce 計時器，在延遲後重置導航狀態
        // 注意：由於頁面會重新載入，這主要用於防止同一頁面上的快速連點
        navigationDebounceTimer = setTimeout(function () {
            isNavigating = false;
        }, NAVIGATION_DEBOUNCE_DELAY);
    }

    /**
     * 初始化鍵盤導航
     * 實作 T029: 換頁 JavaScript 邏輯（左右箭頭鍵換頁）
     */
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function (event) {
            // 如果正在輸入文字，不處理換頁
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            // 如果正在導航中，忽略按鍵
            if (isNavigating) {
                return;
            }

            const prevButton = document.querySelector('.nav-button-prev:not(.disabled)');
            const nextButton = document.querySelector('.nav-button-next:not(.disabled)');

            switch (event.key) {
                case 'ArrowLeft':
                    event.preventDefault();
                    if (prevButton) {
                        triggerNavigation(prevButton, 'prev');
                    }
                    break;
                case 'ArrowRight':
                    event.preventDefault();
                    if (nextButton) {
                        triggerNavigation(nextButton, 'next');
                    }
                    break;
            }
        });
    }

    /**
     * 觸發導航（用於鍵盤導航）
     * @param {HTMLElement} button - 導航按鈕元素
     * @param {string} direction - 導航方向
     */
    function triggerNavigation(button, direction) {
        if (isNavigating) {
            return;
        }

        isNavigating = true;
        startPageTransition(direction);
        
        // 短暫延遲後執行導航，讓動畫開始
        setTimeout(function () {
            if (button.href) {
                window.location.href = button.href;
            }
        }, 150);
    }

    // ==========================================================================
    // 頁面轉換動畫（User Story 3）
    // ==========================================================================

    /**
     * 初始化頁面轉換效果
     * 實作 T031: 實作換頁動畫效果（流暢切換，< 1 秒）
     */
    function initPageTransition() {
        // 頁面載入時加入淡入動畫
        const pageContent = document.querySelector('.aquarium-page');
        if (pageContent) {
            pageContent.classList.add('page-enter');
            
            // 觸發 reflow 以啟動動畫
            pageContent.offsetHeight;
            
            pageContent.classList.add('page-enter-active');
        }

        // 監聽頁面顯示事件（用於瀏覽器返回按鈕）
        window.addEventListener('pageshow', function (event) {
            if (event.persisted) {
                // 從快取還原頁面時重置導航狀態
                isNavigating = false;
                if (pageContent) {
                    pageContent.classList.remove('page-exit', 'page-exit-active');
                    pageContent.classList.add('page-enter', 'page-enter-active');
                }
            }
        });
    }

    /**
     * 開始頁面轉換動畫
     * @param {string} direction - 轉換方向 ('prev' | 'next')
     */
    function startPageTransition(direction) {
        const pageContent = document.querySelector('.aquarium-page');
        if (!pageContent) {
            return;
        }

        // 移除進入動畫類別
        pageContent.classList.remove('page-enter', 'page-enter-active');
        
        // 加入離開動畫類別
        pageContent.classList.add('page-exit');
        pageContent.classList.add(direction === 'prev' ? 'page-exit-left' : 'page-exit-right');
        
        // 觸發 reflow
        pageContent.offsetHeight;
        
        pageContent.classList.add('page-exit-active');
    }

    // ==========================================================================
    // 圖片處理
    // ==========================================================================

    /**
     * 初始化圖片錯誤處理
     */
    function initImageErrorHandling() {
        // 處理所有水族館相關圖片
        const images = document.querySelectorAll('.animal-image, .story-image, .aquarium-animal-card img');
        images.forEach(function (img) {
            img.addEventListener('error', handleImageError);
            // 設定 loading 屬性以優化載入
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });

        // 監聽動態新增的圖片
        observeNewImages();
    }

    /**
     * 監聽動態新增的圖片元素
     */
    function observeNewImages() {
        if (imageObserver) imageObserver.disconnect();
        imageObserver = new MutationObserver(function (mutations) {
            mutations.forEach(function (mutation) {
                mutation.addedNodes.forEach(function (node) {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const images = node.querySelectorAll
                            ? node.querySelectorAll('.animal-image, .story-image, .aquarium-animal-card img')
                            : [];
                        images.forEach(function (img) {
                            img.addEventListener('error', handleImageError);
                        });
                        // 如果節點本身是圖片
                        if (node.tagName === 'IMG' && 
                            (node.classList.contains('animal-image') || 
                             node.classList.contains('story-image'))) {
                            node.addEventListener('error', handleImageError);
                        }
                    }
                });
            });
        });

        imageObserver.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * 處理圖片載入錯誤
     * @param {Event} event - 錯誤事件
     */
    function handleImageError(event) {
        const img = event.target;
        const placeholder = '/images/aquarium/placeholder.svg';
        
        // 避免無限循環
        if (!img.dataset.errorHandled) {
            img.dataset.errorHandled = 'true';
            img.src = placeholder;
            
            // 根據語言設定替代文字
            const lang = getCurrentLanguage();
            img.alt = lang === 'zh' ? '圖片載入失敗' : 'Image failed to load';
            
            // 添加視覺提示樣式
            img.classList.add('image-error');
            
            // 記錄錯誤（開發模式）
            if (window.location.hostname === 'localhost') {
                console.warn('[AquariumApp] 圖片載入失敗:', event.target.dataset.originalSrc || '未知來源');
            }
        }
    }

    // ==========================================================================
    // 工具函式
    // ==========================================================================

    /**
     * 取得當前語言
     * @returns {string} 語言代碼
     */
    function getCurrentLanguage() {
        return localStorage.getItem('storybook-language') || 'zh';
    }

    /**
     * 設定語言
     * @param {string} lang - 語言代碼
     */
    function setLanguage(lang) {
        localStorage.setItem('storybook-language', lang);
        currentLanguage = lang;
    }

    /**
     * 導航到指定索引的動物
     * @param {number} index - 動物索引
     */
    function navigateToIndex(index) {
        if (index < 0 || isNavigating) {
            return;
        }
        isNavigating = true;
        window.location.href = '/Aquarium/' + index;
    }

    /**
     * 導航到上一隻動物
     */
    function navigateToPrevious() {
        const prevButton = document.querySelector('.nav-button-prev:not(.disabled)');
        if (prevButton && !isNavigating) {
            triggerNavigation(prevButton, 'prev');
        }
    }

    /**
     * 導航到下一隻動物
     */
    function navigateToNext() {
        const nextButton = document.querySelector('.nav-button-next:not(.disabled)');
        if (nextButton && !isNavigating) {
            triggerNavigation(nextButton, 'next');
        }
    }

    // ==========================================================================
    // 多語言切換功能（User Story 6）
    // T042, T043, T044, T045, T046
    // ==========================================================================

    /**
     * 初始化語言變更監聽器
     * T043: 監聽語言變更事件並更新動態內容
     */
    function initLanguageChangeListener() {
        document.addEventListener('languageChanged', function (event) {
            const lang = event.detail.language;
            currentLanguage = lang;
            
            // 更新水族館頁面的動態內容
            updateAquariumPageLanguage(lang);
        });
    }

    /**
     * 更新水族館頁面的語言相關內容
     * T043: 實作水族館頁面多語言內容切換 JavaScript 邏輯
     * @param {string} lang - 語言代碼
     */
    function updateAquariumPageLanguage(lang) {
        // 更新搜尋框 placeholder
        updateSearchPlaceholder();
        
        // 更新圖片的 aria-label
        updateImageAriaLabels(lang);
        
        // 如果有搜尋結果顯示中，更新搜尋結果
        const searchInput = document.getElementById('animal-search-input');
        if (searchInput && searchInput.value.trim()) {
            performSearch(searchInput.value);
        }
    }

    /**
     * 更新圖片的 aria-label 屬性
     * T043: 確保圖片的無障礙屬性隨語言更新
     * @param {string} lang - 語言代碼
     */
    function updateImageAriaLabels(lang) {
        const images = document.querySelectorAll('.animal-image[data-aria-label-zh][data-aria-label-en]');
        images.forEach(function (img) {
            const zhLabel = img.getAttribute('data-aria-label-zh');
            const enLabel = img.getAttribute('data-aria-label-en');
            img.setAttribute('aria-label', lang === 'en' ? enLabel : zhLabel);
        });
    }

    // ==========================================================================
    // 搜尋狀態
    // ==========================================================================

    /** @type {number} 搜尋結果選取索引 */
    let selectedSearchIndex = -1;

    // ==========================================================================
    // 搜尋功能（User Story 4）
    // T033, T034, T035, T036, T037
    // ==========================================================================

    /**
     * 初始化搜尋功能
     * T033: 初始化搜尋框 UI 互動
     */
    function initSearch() {
        const searchInput = document.getElementById('animal-search-input');
        const clearButton = document.getElementById('clear-search-btn');

        if (!searchInput) {
            return; // 封面頁沒有搜尋框
        }

        // 監聯輸入事件（含 Debounce）
        searchInput.addEventListener('input', function (event) {
            const query = event.target.value.trim();

            // 顯示/隱藏清除按鈕
            if (clearButton) {
                clearButton.style.display = query.length > 0 ? 'flex' : 'none';
            }

            // Debounce 搜尋（300ms）
            if (searchDebounceTimer) {
                clearTimeout(searchDebounceTimer);
            }

            searchDebounceTimer = setTimeout(function () {
                if (query.length > 0) {
                    performSearch(query);
                } else {
                    hideSearchResults();
                }
            }, SEARCH_DEBOUNCE_DELAY);
        });

        // 搜尋框獲得焦點時，如果有輸入內容就顯示結果
        searchInput.addEventListener('focus', function () {
            const query = searchInput.value.trim();
            var searchResults = document.getElementById('searchResults');
            if (query.length > 0 && searchResults && searchResults.children.length > 0) {
                searchResults.classList.add('active');
            }
        });

        // 清除按鈕事件
        if (clearButton) {
            clearButton.addEventListener('click', clearSearch);
        }

        // 搜尋框鍵盤導航
        searchInput.addEventListener('keydown', handleSearchKeydown);

        // 點擊外部關閉搜尋結果
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.aquarium-search-container')) {
                hideSearchResults();
            }
        });

        // 設定語言相關的 placeholder
        updateSearchPlaceholder();
    }

    /**
     * 執行搜尋
     * @param {string} query - 搜尋關鍵字
     */
    function performSearch(query) {
        const trimmedQuery = query.trim();
        if (!trimmedQuery || !animalsData || animalsData.length === 0) {
            hideSearchResults();
            return;
        }

        var searchResults = document.getElementById('searchResults');
        if (!searchResults) {
            return;
        }

        const lowerQuery = trimmedQuery.toLowerCase();
        const lang = getCurrentLanguage();

        // 搜尋動物（含名稱、棲息地、食性、分佈地點、區域、介紹）
        const results = animalsData.filter(function (animal) {
            const searchFields = [
                animal.nameZh,
                animal.nameEn,
                lang === 'en' ? animal.habitatEn : animal.habitatZh,
                lang === 'en' ? animal.dietEn : animal.dietZh,
                lang === 'en' ? animal.locationEn : animal.locationZh,
                lang === 'en' ? animal.habitatZoneEn : animal.habitatZoneZh,
                lang === 'en' ? animal.descriptionEn : animal.descriptionZh
            ];

            return searchFields.some(function (field) {
                return field && field.toLowerCase().includes(lowerQuery);
            });
        });

        // 重設選取索引
        selectedSearchIndex = -1;

        // 顯示搜尋結果
        if (results.length > 0) {
            renderSearchResults(results, trimmedQuery, lang);
        } else {
            renderNoResults(trimmedQuery, lang);
        }

        searchResults.classList.add('active');

        // 公告搜尋結果給螢幕閱讀器
        announceSearchResults(results.length, trimmedQuery, lang);
    }

    /**
     * 渲染搜尋結果（Dropdown 模式，與恐龍一致）
     * @param {Array} results - 搜尋結果
     * @param {string} query - 搜尋關鍵字
     * @param {string} lang - 當前語言
     */
    function renderSearchResults(results, query, lang) {
        var searchResults = document.getElementById('searchResults');
        if (!searchResults) {
            return;
        }

        // 結果計數
        var countText = lang === 'en'
            ? 'Found ' + results.length + ' animal' + (results.length > 1 ? 's' : '')
            : '找到 ' + results.length + ' 隻動物';

        var html = '<div class="search-results-count">' + escapeHtml(countText) + '</div>';
        results.forEach(function (animal, idx) {
            var nameZh = animal.nameZh || '';
            var nameEn = animal.nameEn || '';
            var displayName = lang === 'en' ? (nameEn || nameZh) : (nameZh || nameEn);
            var subName = lang === 'en' ? nameZh : nameEn;
            var habitat = lang === 'en' ? (animal.habitatEn || animal.habitatZh) : (animal.habitatZh || animal.habitatEn);
            var diet = lang === 'en' ? (animal.dietEn || animal.dietZh) : (animal.dietZh || animal.dietEn);
            var zone = lang === 'en' ? (animal.habitatZoneEn || animal.habitatZoneZh) : (animal.habitatZoneZh || animal.habitatZoneEn);
            var image = animal.mainImage || '/images/aquarium/placeholder.svg';

            // 安全性：驗證索引為整數
            var safeIndex = parseInt(animal.index, 10);
            if (isNaN(safeIndex)) safeIndex = 0;

            // 安全性：驗證圖片 URL 協議（僅允許相對路徑、http、https）
            if (image && /^javascript:/i.test(image)) {
                image = '/images/aquarium/placeholder.svg';
            }

            // 食性圖示
            var dietLower = (diet || '').toLowerCase();
            var dietIcon = '🍽️';
            if (dietLower.includes('肉') || dietLower.includes('carniv')) { dietIcon = '🍖'; }
            else if (dietLower.includes('草') || dietLower.includes('herbiv') || dietLower.includes('植') || dietLower.includes('藻')) { dietIcon = '🌿'; }
            else if (dietLower.includes('雜') || dietLower.includes('omniv')) { dietIcon = '🍽️'; }

            html += '<a class="search-result-item" href="/Aquarium/' + safeIndex + '" ' +
                    'role="option" id="search-result-' + idx + '" data-index="' + idx + '" tabindex="-1" aria-selected="false">' +
                    '<img class="search-result-thumb" src="' + escapeHtml(image) + '" alt="' + escapeHtml(displayName) + '">' +
                    '<div class="search-result-info">' +
                    '<div class="search-result-name">' + highlightText(displayName, query) + '</div>' +
                    (subName ? '<div class="search-result-subname">' + highlightText(subName, query) + '</div>' : '') +
                    '<div class="search-result-tags">' +
                    '<span class="search-tag">🌊 ' + highlightText(zone, query) + '</span>' +
                    '<span class="search-tag">' + dietIcon + ' ' + highlightText(diet, query) + '</span>' +
                    (habitat ? '<span class="search-tag">🏠 ' + highlightText(habitat, query) + '</span>' : '') +
                    '</div>' +
                    '</div>' +
                    '</a>';
        });

        searchResults.innerHTML = html;
    }

    /**
     * 渲染找不到結果的提示
     * @param {string} query - 搜尋關鍵字
     * @param {string} lang - 當前語言
     */
    function renderNoResults(query, lang) {
        var searchResults = document.getElementById('searchResults');
        if (!searchResults) {
            return;
        }

        var noResultsText = lang === 'en'
            ? 'No animals found'
            : '找不到動物';
        var hintText = lang === 'en'
            ? 'Try searching for: clownfish, coral reef, herbivore...'
            : '試試搜尋：小丑魚、珊瑚礁、草食性...';

        searchResults.innerHTML =
            '<div class="search-no-results">' +
            '<span class="search-no-results-icon">🐙</span>' +
            '<div class="search-no-results-text">' + escapeHtml(noResultsText) + '</div>' +
            '<div class="search-no-results-hint">' + escapeHtml(hintText) + '</div>' +
            '</div>';
    }

    /**
     * 隱藏搜尋結果
     */
    function hideSearchResults() {
        var searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.classList.remove('active');
        }
        selectedSearchIndex = -1;

        // 清除 aria-activedescendant
        var searchInput = document.getElementById('animal-search-input');
        if (searchInput) {
            searchInput.removeAttribute('aria-activedescendant');
        }
    }

    /**
     * 公告搜尋結果給螢幕閱讀器
     * @param {number} count - 結果數量
     * @param {string} query - 搜尋關鍵字
     * @param {string} lang - 當前語言
     */
    function announceSearchResults(count, query, lang) {
        var announcer = document.getElementById('searchAnnouncer');
        if (!announcer) {
            return;
        }

        var message;
        if (count === 0) {
            message = lang === 'en'
                ? 'No animals found for "' + query + '"'
                : '找不到「' + query + '」的搜尋結果';
        } else {
            message = lang === 'en'
                ? count + ' animal' + (count > 1 ? 's' : '') + ' found for "' + query + '"'
                : '找到 ' + count + ' 隻符合「' + query + '」的動物';
        }

        announcer.textContent = message;
    }

    /**
     * 處理搜尋框鍵盤事件（↑↓ Enter Esc）
     * @param {KeyboardEvent} event - 鍵盤事件
     */
    function handleSearchKeydown(event) {
        var searchResults = document.getElementById('searchResults');
        if (!searchResults || !searchResults.classList.contains('active')) {
            // Enter 在沒有結果時觸發即時搜尋
            if (event.key === 'Enter') {
                event.preventDefault();
                if (searchDebounceTimer) {
                    clearTimeout(searchDebounceTimer);
                }
                performSearch(event.target.value);
            }
            return;
        }

        var items = searchResults.querySelectorAll('.search-result-item');
        if (items.length === 0) {
            return;
        }

        switch (event.key) {
            case 'ArrowDown':
                event.preventDefault();
                selectedSearchIndex = Math.min(selectedSearchIndex + 1, items.length - 1);
                updateSelectedSearchItem(items);
                break;

            case 'ArrowUp':
                event.preventDefault();
                selectedSearchIndex = Math.max(selectedSearchIndex - 1, 0);
                updateSelectedSearchItem(items);
                break;

            case 'Enter':
                event.preventDefault();
                if (selectedSearchIndex >= 0 && selectedSearchIndex < items.length) {
                    items[selectedSearchIndex].click();
                }
                break;

            case 'Escape':
                hideSearchResults();
                break;
        }
    }

    /**
     * 更新選取的搜尋結果項目
     * @param {NodeList} items - 搜尋結果項目列表
     */
    function updateSelectedSearchItem(items) {
        var searchInput = document.getElementById('animal-search-input');
        items.forEach(function (item, idx) {
            if (idx === selectedSearchIndex) {
                item.classList.add('selected');
                item.setAttribute('aria-selected', 'true');
                item.scrollIntoView({ block: 'nearest' });
                if (searchInput && item.id) {
                    searchInput.setAttribute('aria-activedescendant', item.id);
                }
            } else {
                item.classList.remove('selected');
                item.setAttribute('aria-selected', 'false');
            }
        });
    }

    /**
     * 高亮顯示搜尋關鍵字
     * @param {string} text - 原始文字
     * @param {string} query - 搜尋關鍵字
     * @returns {string} 包含高亮標記的 HTML
     */
    function highlightText(text, query) {
        if (!query || !text) return escapeHtml(text);
        
        const regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
        return escapeHtml(text).replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * 轉義正則表達式特殊字元
     * @param {string} string - 原始字串
     * @returns {string} 轉義後的字串
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    /**
     * 跳脫 HTML 特殊字元
     * @param {string} text - 原始文字
     * @returns {string} 跳脫後的文字
     */
    function escapeHtml(text) {
        if (!text) {
            return '';
        }
        var div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 清除搜尋
     * T037: 實作清空搜尋框恢復顯示所有動物邏輯
     */
    function clearSearch() {
        const searchInput = document.getElementById('animal-search-input');
        const clearButton = document.getElementById('clear-search-btn');

        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }

        if (clearButton) {
            clearButton.style.display = 'none';
        }

        hideSearchResults();
    }

    /**
     * 清除搜尋結果顯示
     */
    function clearSearchResults() {
        hideSearchResults();
        var searchBox = document.querySelector('.search-box');
        if (searchBox) searchBox.classList.remove('searching');
    }

    /**
     * 更新搜尋框 placeholder 的語言
     */
    function updateSearchPlaceholder() {
        const searchInput = document.getElementById('animal-search-input');
        if (searchInput) {
            const lang = getCurrentLanguage();
            const placeholderZh = searchInput.getAttribute('data-placeholder-zh');
            const placeholderEn = searchInput.getAttribute('data-placeholder-en');
            searchInput.placeholder = lang === 'en' ? placeholderEn : placeholderZh;
        }
    }

    // ==========================================================================
    // 圖片大圖 Lightbox 功能（User Story 5）
    // T038, T039, T040, T041
    // ==========================================================================

    /**
     * 初始化圖片大圖 Lightbox
     * T040: 實作 Lightbox 開啟/關閉 JavaScript 邏輯
     */
    function initImageLightbox() {
        const lightbox = document.getElementById('imageLightbox');
        if (!lightbox) {
            return;
        }

        // 為所有動物圖片綁定點擊事件
        const animalImages = document.querySelectorAll('.animal-image');
        animalImages.forEach(function (img) {
            img.addEventListener('click', function () {
                openImageLightbox(img.src, img.alt);
            });

            // 支援鍵盤操作（無障礙功能）
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            
            // 根據語言設定 aria-label
            const lang = getCurrentLanguage();
            const ariaLabelZh = '點擊查看大圖：' + img.alt;
            const ariaLabelEn = 'Click to view larger image: ' + img.alt;
            img.setAttribute('aria-label', lang === 'en' ? ariaLabelEn : ariaLabelZh);
            img.setAttribute('data-aria-label-zh', ariaLabelZh);
            img.setAttribute('data-aria-label-en', ariaLabelEn);

            img.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openImageLightbox(img.src, img.alt);
                }
            });
        });

        // T041: 為關閉按鈕和遮罩層綁定關閉事件
        const closeElements = lightbox.querySelectorAll('[data-action="close-lightbox"]');
        closeElements.forEach(function (element) {
            element.addEventListener('click', closeImageLightbox);
        });

        // T041: ESC 鍵關閉 Lightbox
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && lightbox.classList.contains('active')) {
                closeImageLightbox();
            }
        });
    }

    /**
     * 開啟圖片大圖 Lightbox
     * T040: 實作 Lightbox 開啟邏輯
     * @param {string} imageSrc - 圖片來源
     * @param {string} imageAlt - 圖片替代文字
     */
    function openImageLightbox(imageSrc, imageAlt) {
        const lightbox = document.getElementById('imageLightbox');
        const lightboxImage = document.getElementById('lightboxImage');
        const lightboxCaption = document.getElementById('lightboxCaption');

        if (!lightbox || !lightboxImage) {
            return;
        }

        // 設定圖片錯誤處理 - T049: 圖片載入失敗時顯示預設佔位圖片
        lightboxImage.onerror = function() {
            this.onerror = null; // 防止無限迴圈
            this.src = '/images/aquarium/placeholder.svg';
            console.warn('[Lightbox] 圖片載入失敗:', imageSrc);
        };

        // 設定圖片和說明文字
        lightboxImage.src = imageSrc;
        lightboxImage.alt = imageAlt;
        if (lightboxCaption) {
            lightboxCaption.textContent = imageAlt;
        }

        // 顯示 Lightbox
        lightbox.classList.add('active');
        document.body.classList.add('lightbox-open');

        // 將焦點移到關閉按鈕（無障礙功能）
        const closeButton = lightbox.querySelector('.lightbox-close');
        if (closeButton) {
            closeButton.focus();
        }
    }

    /**
     * 關閉圖片大圖 Lightbox
     * T040, T041: 實作 Lightbox 關閉邏輯
     */
    function closeImageLightbox() {
        const lightbox = document.getElementById('imageLightbox');
        if (!lightbox) {
            return;
        }

        lightbox.classList.remove('active');
        document.body.classList.remove('lightbox-open');

        // 將焦點返回到圖片（無障礙功能）
        const animalImage = document.querySelector('.animal-image');
        if (animalImage) {
            animalImage.focus();
        }
    }

    // ==========================================================================
    // 匯出公開 API
    // ==========================================================================

    window.AquariumApp = {
        getCurrentLanguage: getCurrentLanguage,
        setLanguage: setLanguage,
        handleImageError: handleImageError,
        navigateToIndex: navigateToIndex,
        navigateToPrevious: navigateToPrevious,
        navigateToNext: navigateToNext,
        performSearch: performSearch,
        clearSearch: clearSearch,
        openImageLightbox: openImageLightbox,
        closeImageLightbox: closeImageLightbox
    };

})();
