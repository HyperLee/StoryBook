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
        const observer = new MutationObserver(function (mutations) {
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

        observer.observe(document.body, { childList: true, subtree: true });
    }

    /**
     * 處理圖片載入錯誤
     * @param {Event} event - 錯誤事件
     */
    function handleImageError(event) {
        const img = event.target;
        const placeholder = '/images/placeholder.svg';
        
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
    // 匯出公開 API
    // ==========================================================================

    window.AquariumApp = {
        getCurrentLanguage: getCurrentLanguage,
        setLanguage: setLanguage,
        handleImageError: handleImageError,
        navigateToIndex: navigateToIndex,
        navigateToPrevious: navigateToPrevious,
        navigateToNext: navigateToNext,
        searchAnimals: searchAnimals,
        clearSearch: clearSearch
    };

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

        // 監聽輸入事件（T034, T035）
        searchInput.addEventListener('input', function (event) {
            handleSearchInput(event.target.value);
        });

        // 監聽 Enter 鍵
        searchInput.addEventListener('keydown', function (event) {
            if (event.key === 'Enter') {
                event.preventDefault();
                // 立即執行搜尋（取消 debounce）
                if (searchDebounceTimer) {
                    clearTimeout(searchDebounceTimer);
                }
                performSearch(event.target.value);
            }
            // ESC 鍵清除搜尋
            if (event.key === 'Escape') {
                clearSearch();
            }
        });

        // 清除按鈕事件（T037）
        if (clearButton) {
            clearButton.addEventListener('click', clearSearch);
        }

        // 設定語言相關的 placeholder
        updateSearchPlaceholder();
    }

    /**
     * 處理搜尋輸入
     * T035: 實作搜尋 debounce 防止過度觸發（300ms）
     * @param {string} query - 搜尋關鍵字
     */
    function handleSearchInput(query) {
        const clearButton = document.getElementById('clear-search-btn');
        const searchBox = document.querySelector('.search-box');

        // 顯示/隱藏清除按鈕
        if (clearButton) {
            clearButton.style.display = query.length > 0 ? 'block' : 'none';
        }

        // 清除先前的 debounce 計時器
        if (searchDebounceTimer) {
            clearTimeout(searchDebounceTimer);
        }

        // 如果輸入為空，清除搜尋結果
        if (!query.trim()) {
            clearSearchResults();
            return;
        }

        // 顯示載入狀態
        if (searchBox) {
            searchBox.classList.add('searching');
        }

        // 設定 debounce 計時器（T035: 300ms）
        searchDebounceTimer = setTimeout(function () {
            performSearch(query);
            if (searchBox) {
                searchBox.classList.remove('searching');
            }
        }, SEARCH_DEBOUNCE_DELAY);
    }

    /**
     * 執行搜尋
     * T034: 實作前端即時搜尋過濾邏輯（比對名稱、生活環境、食性）
     * @param {string} query - 搜尋關鍵字
     */
    function performSearch(query) {
        const trimmedQuery = query.trim().toLowerCase();
        
        if (!trimmedQuery) {
            clearSearchResults();
            return;
        }

        const lang = getCurrentLanguage();
        const results = searchAnimals(trimmedQuery, lang);

        displaySearchResults(results, trimmedQuery);
    }

    /**
     * 搜尋動物
     * T034: 比對名稱、生活環境、食性、發現地點、區域分類
     * @param {string} query - 搜尋關鍵字（已轉小寫）
     * @param {string} lang - 語言代碼
     * @returns {Array} 符合條件的動物列表
     */
    function searchAnimals(query, lang) {
        if (!animalsData || animalsData.length === 0) {
            return [];
        }

        return animalsData.filter(function (animal) {
            // 根據語言取得對應欄位
            const name = lang === 'en' ? animal.nameEn : animal.nameZh;
            const habitat = lang === 'en' ? animal.habitatEn : animal.habitatZh;
            const diet = lang === 'en' ? animal.dietEn : animal.dietZh;
            const location = lang === 'en' ? animal.locationEn : animal.locationZh;
            const zone = lang === 'en' ? animal.habitatZoneEn : animal.habitatZoneZh;

            // 搜尋比對（不分大小寫）
            const searchFields = [
                name,
                habitat,
                diet,
                location,
                zone,
                animal.nameZh, // 總是搜尋中文名
                animal.nameEn  // 總是搜尋英文名
            ];

            return searchFields.some(function (field) {
                return field && field.toLowerCase().includes(query);
            });
        });
    }

    /**
     * 顯示搜尋結果
     * T034, T036: 顯示搜尋結果或無結果提示
     * @param {Array} results - 搜尋結果
     * @param {string} query - 搜尋關鍵字
     */
    function displaySearchResults(results, query) {
        const resultsInfo = document.getElementById('search-results-info');
        const noResults = document.getElementById('no-results-message');
        const quickNav = document.getElementById('search-quick-nav');
        const quickNavList = document.getElementById('search-quick-nav-list');
        const lang = getCurrentLanguage();

        // T036: 無結果提示
        if (results.length === 0) {
            if (resultsInfo) resultsInfo.style.display = 'none';
            if (quickNav) quickNav.style.display = 'none';
            if (noResults) {
                noResults.style.display = 'block';
                // 更新多語言文字
                const text = noResults.querySelector('.no-results-text');
                if (text) {
                    text.textContent = lang === 'en' 
                        ? text.getAttribute('data-lang-en') 
                        : text.getAttribute('data-lang-zh');
                }
            }
            return;
        }

        // 有結果時隱藏無結果提示
        if (noResults) noResults.style.display = 'none';

        // 顯示搜尋結果資訊
        if (resultsInfo) {
            resultsInfo.style.display = 'block';
            const countSpan = resultsInfo.querySelector('.results-count');
            const textSpan = resultsInfo.querySelector('.results-text');
            if (countSpan) countSpan.textContent = results.length;
            if (textSpan) {
                textSpan.textContent = lang === 'en' 
                    ? ` animals found` 
                    : ` 隻動物符合搜尋條件`;
            }
        }

        // 顯示快速導航列表
        if (quickNav && quickNavList) {
            quickNav.style.display = 'block';
            quickNavList.innerHTML = results.map(function (animal) {
                const name = lang === 'en' ? animal.nameEn : animal.nameZh;
                const isActive = animal.index === currentPageIndex ? 'active' : '';
                return `
                    <a href="/Aquarium/${animal.index}" class="quick-nav-item ${isActive}" title="${name}">
                        <img src="${animal.mainImage}" alt="${name}" class="quick-nav-item-image" 
                             onerror="this.src='/images/placeholder.svg'">
                        <span class="quick-nav-item-name">${highlightText(name, query)}</span>
                        <span class="quick-nav-item-index">#${animal.index + 1}</span>
                    </a>
                `;
            }).join('');

            // 更新標題多語言
            const title = quickNav.querySelector('.quick-nav-title span[data-lang-zh]');
            if (title) {
                title.textContent = lang === 'en' 
                    ? title.getAttribute('data-lang-en') 
                    : title.getAttribute('data-lang-zh');
            }
        }
    }

    /**
     * 高亮顯示搜尋關鍵字
     * @param {string} text - 原始文字
     * @param {string} query - 搜尋關鍵字
     * @returns {string} 包含高亮標記的 HTML
     */
    function highlightText(text, query) {
        if (!query || !text) return text;
        
        const regex = new RegExp(`(${escapeRegExp(query)})`, 'gi');
        return text.replace(regex, '<span class="search-highlight">$1</span>');
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

        clearSearchResults();
    }

    /**
     * 清除搜尋結果顯示
     */
    function clearSearchResults() {
        const resultsInfo = document.getElementById('search-results-info');
        const noResults = document.getElementById('no-results-message');
        const quickNav = document.getElementById('search-quick-nav');
        const searchBox = document.querySelector('.search-box');

        if (resultsInfo) resultsInfo.style.display = 'none';
        if (noResults) noResults.style.display = 'none';
        if (quickNav) quickNav.style.display = 'none';
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

})();
