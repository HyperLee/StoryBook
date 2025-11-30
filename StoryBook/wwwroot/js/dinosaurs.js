/**
 * 恐龍故事書 - 恐龍頁面功能腳本
 * 提供換頁、搜尋、大圖檢視等功能
 */

(function () {
    'use strict';

    // ==========================================================================
    // 狀態管理
    // ==========================================================================
    
    let dinosaurs = [];
    let currentIndex = 0;
    let currentLanguage = 'zh';
    let searchDebounceTimer = null;
    let selectedSearchIndex = -1;

    // ==========================================================================
    // 初始化
    // ==========================================================================

    /**
     * 頁面載入完成後初始化
     */
    document.addEventListener('DOMContentLoaded', function () {
        initLanguage();
        initDinosaurData();
        initImageErrorHandling();
        initNavigationButtons();
        initKeyboardNavigation();
        initImageModal();
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
     * 初始化恐龍資料（從頁面取得）
     */
    function initDinosaurData() {
        if (window.dinosaurData && Array.isArray(window.dinosaurData)) {
            dinosaurs = window.dinosaurData;
        }
    }

    /**
     * 初始化圖片錯誤處理
     */
    function initImageErrorHandling() {
        // 處理所有恐龍相關圖片
        const images = document.querySelectorAll('.dinosaur-image, .story-image, .dinosaur-card img');
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
                            ? node.querySelectorAll('.dinosaur-image, .story-image, .dinosaur-card img')
                            : [];
                        images.forEach(function (img) {
                            img.addEventListener('error', handleImageError);
                        });
                        // 如果節點本身是圖片
                        if (node.tagName === 'IMG' && 
                            (node.classList.contains('dinosaur-image') || 
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
     * 初始化導航按鈕
     */
    function initNavigationButtons() {
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
     * 初始化鍵盤導航（左右箭頭鍵換頁）
     */
    function initKeyboardNavigation() {
        document.addEventListener('keydown', function (event) {
            // 如果正在輸入文字，不處理換頁
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }

            const prevButton = document.querySelector('.nav-button-prev:not(.disabled)');
            const nextButton = document.querySelector('.nav-button-next:not(.disabled)');

            switch (event.key) {
                case 'ArrowLeft':
                    if (prevButton) {
                        prevButton.click();
                    }
                    break;
                case 'ArrowRight':
                    if (nextButton) {
                        nextButton.click();
                    }
                    break;
            }
        });
    }

    // ==========================================================================
    // 圖片處理
    // ==========================================================================

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
                console.warn('[DinosaurApp] 圖片載入失敗:', event.target.dataset.originalSrc || '未知來源');
            }
        }
    }

    /**
     * 預載入圖片
     * @param {string} src - 圖片來源
     * @returns {Promise<HTMLImageElement>} 圖片元素
     */
    function preloadImage(src) {
        return new Promise(function (resolve, reject) {
            const img = new Image();
            img.onload = function () { resolve(img); };
            img.onerror = function () { reject(new Error('圖片載入失敗: ' + src)); };
            img.src = src;
        });
    }

    /**
     * 批次預載入恐龍圖片
     * @param {Array} dinosaurList - 恐龍資料陣列
     */
    function preloadDinosaurImages(dinosaurList) {
        if (!Array.isArray(dinosaurList)) {
            return;
        }

        dinosaurList.forEach(function (dino) {
            if (dino.images && dino.images.main) {
                preloadImage(dino.images.main).catch(function () {
                    // 靜默處理預載入失敗
                });
            }
        });
    }

    // ==========================================================================
    // 圖片大圖 Modal 功能
    // ==========================================================================

    /**
     * 初始化圖片大圖 Modal
     */
    function initImageModal() {
        const modal = document.getElementById('imageModal');
        if (!modal) {
            return;
        }

        // 為所有恐龍圖片綁定點擊事件
        const dinosaurImages = document.querySelectorAll('.dinosaur-image');
        dinosaurImages.forEach(function (img) {
            img.addEventListener('click', function () {
                openImageModal(img.src, img.alt);
            });
            // 支援鍵盤操作（無障礙功能）
            img.setAttribute('tabindex', '0');
            img.setAttribute('role', 'button');
            img.setAttribute('aria-label', '點擊查看大圖：' + img.alt);
            img.addEventListener('keydown', function (event) {
                if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    openImageModal(img.src, img.alt);
                }
            });
        });

        // 為關閉按鈕和遮罩層綁定關閉事件
        const closeElements = modal.querySelectorAll('[data-action="close-modal"]');
        closeElements.forEach(function (element) {
            element.addEventListener('click', closeImageModal);
        });

        // ESC 鍵關閉 Modal
        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && modal.classList.contains('active')) {
                closeImageModal();
            }
        });
    }

    /**
     * 開啟圖片大圖 Modal
     * @param {string} imageSrc - 圖片來源
     * @param {string} imageAlt - 圖片替代文字
     */
    function openImageModal(imageSrc, imageAlt) {
        const modal = document.getElementById('imageModal');
        const modalImage = document.getElementById('modalImage');
        const modalCaption = document.getElementById('modalImageCaption');

        if (!modal || !modalImage) {
            return;
        }

        // 設定圖片和說明文字
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt;
        if (modalCaption) {
            modalCaption.textContent = imageAlt;
        }

        // 顯示 Modal
        modal.classList.add('active');
        document.body.classList.add('modal-open');

        // 將焦點移到關閉按鈕（無障礙功能）
        const closeButton = modal.querySelector('.image-modal-close');
        if (closeButton) {
            closeButton.focus();
        }
    }

    /**
     * 關閉圖片大圖 Modal
     */
    function closeImageModal() {
        const modal = document.getElementById('imageModal');
        if (!modal) {
            return;
        }

        modal.classList.remove('active');
        document.body.classList.remove('modal-open');

        // 將焦點返回到圖片（無障礙功能）
        const dinosaurImage = document.querySelector('.dinosaur-image');
        if (dinosaurImage) {
            dinosaurImage.focus();
        }
    }

    // ==========================================================================
    // 換頁功能
    // ==========================================================================

    /**
     * 導航到指定索引的恐龍
     * @param {number} index - 恐龍索引
     */
    function navigateToIndex(index) {
        if (index < 0) {
            return;
        }
        window.location.href = '/Dinosaurs/' + index;
    }

    /**
     * 導航到上一隻恐龍
     */
    function navigateToPrevious() {
        const prevButton = document.querySelector('.nav-button-prev:not(.disabled)');
        if (prevButton) {
            prevButton.click();
        }
    }

    /**
     * 導航到下一隻恐龍
     */
    function navigateToNext() {
        const nextButton = document.querySelector('.nav-button-next:not(.disabled)');
        if (nextButton) {
            nextButton.click();
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

    // ==========================================================================
    // 匯出公開 API
    // ==========================================================================

    window.DinosaurApp = {
        getCurrentLanguage: getCurrentLanguage,
        setLanguage: setLanguage,
        handleImageError: handleImageError,
        navigateToIndex: navigateToIndex,
        navigateToPrevious: navigateToPrevious,
        navigateToNext: navigateToNext,
        openImageModal: openImageModal,
        closeImageModal: closeImageModal,
        searchDinosaurs: searchDinosaurs,
        clearSearch: clearSearch
    };

    // ==========================================================================
    // 搜尋功能
    // ==========================================================================

    /**
     * 初始化搜尋功能
     */
    function initSearch() {
        const searchInput = document.getElementById('dinosaurSearch');
        const clearBtn = document.getElementById('clearSearch');
        const searchResults = document.getElementById('searchResults');

        if (!searchInput) {
            return;
        }

        // 搜尋輸入事件（含 Debounce）
        searchInput.addEventListener('input', function (event) {
            const query = event.target.value.trim();
            
            // 顯示/隱藏清除按鈕
            if (clearBtn) {
                clearBtn.style.display = query.length > 0 ? 'flex' : 'none';
            }

            // Debounce 搜尋（300ms）
            if (searchDebounceTimer) {
                clearTimeout(searchDebounceTimer);
            }

            searchDebounceTimer = setTimeout(function () {
                if (query.length > 0) {
                    searchDinosaurs(query);
                } else {
                    hideSearchResults();
                }
            }, 300);
        });

        // 搜尋框獲得焦點時，如果有輸入內容就顯示結果
        searchInput.addEventListener('focus', function () {
            const query = searchInput.value.trim();
            if (query.length > 0 && searchResults.children.length > 0) {
                searchResults.classList.add('active');
            }
        });

        // 清除按鈕點擊事件
        if (clearBtn) {
            clearBtn.addEventListener('click', clearSearch);
        }

        // 搜尋框鍵盤導航
        searchInput.addEventListener('keydown', handleSearchKeydown);

        // 點擊外部關閉搜尋結果
        document.addEventListener('click', function (event) {
            if (!event.target.closest('.dinosaur-search-container')) {
                hideSearchResults();
            }
        });
    }

    /**
     * 搜尋恐龍
     * @param {string} query - 搜尋關鍵字
     */
    function searchDinosaurs(query) {
        if (!query || dinosaurs.length === 0) {
            hideSearchResults();
            return;
        }

        const searchResults = document.getElementById('searchResults');
        if (!searchResults) {
            return;
        }

        const lowerQuery = query.toLowerCase();
        const lang = getCurrentLanguage();

        // 搜尋符合的恐龍
        const results = [];
        dinosaurs.forEach(function (dino, index) {
            const nameZh = dino.name && dino.name.zh ? dino.name.zh.toLowerCase() : '';
            const nameEn = dino.name && dino.name.en ? dino.name.en.toLowerCase() : '';
            const periodZh = dino.period && dino.period.zh ? dino.period.zh.toLowerCase() : '';
            const periodEn = dino.period && dino.period.en ? dino.period.en.toLowerCase() : '';
            const dietZh = dino.diet && dino.diet.zh ? dino.diet.zh.toLowerCase() : '';
            const dietEn = dino.diet && dino.diet.en ? dino.diet.en.toLowerCase() : '';
            const locationZh = dino.location && dino.location.zh ? dino.location.zh.toLowerCase() : '';
            const locationEn = dino.location && dino.location.en ? dino.location.en.toLowerCase() : '';

            if (nameZh.includes(lowerQuery) || 
                nameEn.includes(lowerQuery) ||
                periodZh.includes(lowerQuery) ||
                periodEn.includes(lowerQuery) ||
                dietZh.includes(lowerQuery) ||
                dietEn.includes(lowerQuery) ||
                locationZh.includes(lowerQuery) ||
                locationEn.includes(lowerQuery)) {
                results.push({ dinosaur: dino, index: index });
            }
        });

        // 重設選取索引
        selectedSearchIndex = -1;

        // 顯示搜尋結果
        if (results.length > 0) {
            renderSearchResults(results, query, lang);
        } else {
            renderNoResults(query, lang);
        }

        searchResults.classList.add('active');
    }

    /**
     * 渲染搜尋結果
     * @param {Array} results - 搜尋結果陣列
     * @param {string} query - 搜尋關鍵字
     * @param {string} lang - 當前語言
     */
    function renderSearchResults(results, query, lang) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) {
            return;
        }

        let html = '';
        results.forEach(function (result, idx) {
            const dino = result.dinosaur;
            const index = result.index;
            const name = lang === 'en' && dino.name.en ? dino.name.en : dino.name.zh;
            const detail = lang === 'en' && dino.period.en ? dino.period.en : dino.period.zh;
            const image = dino.images && dino.images.main ? dino.images.main : '/images/placeholder.svg';

            // 高亮關鍵字
            const highlightedName = highlightText(name, query);
            const highlightedDetail = highlightText(detail, query);

            html += '<a class="search-result-item" href="/Dinosaurs/' + index + '" ' +
                    'role="option" data-index="' + idx + '" tabindex="-1">' +
                    '<img class="search-result-thumb" src="' + escapeHtml(image) + '" alt="' + escapeHtml(name) + '" onerror="this.src=\'/images/placeholder.svg\'">' +
                    '<div class="search-result-info">' +
                    '<div class="search-result-name">' + highlightedName + '</div>' +
                    '<div class="search-result-detail">' + highlightedDetail + '</div>' +
                    '</div>' +
                    '</a>';
        });

        searchResults.innerHTML = html;

        // 綁定點擊事件
        const items = searchResults.querySelectorAll('.search-result-item');
        items.forEach(function (item) {
            item.addEventListener('click', function (event) {
                // 讓連結正常跳轉
            });
        });
    }

    /**
     * 渲染找不到結果的提示
     * @param {string} query - 搜尋關鍵字
     * @param {string} lang - 當前語言
     */
    function renderNoResults(query, lang) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults) {
            return;
        }

        const noResultsText = lang === 'en' 
            ? 'No dinosaurs found' 
            : '找不到恐龍';
        const hintText = lang === 'en'
            ? 'Try searching for: T-Rex, Triceratops, Stegosaurus...'
            : '試試搜尋：暴龍、三角龍、劍龍...';

        searchResults.innerHTML = 
            '<div class="search-no-results">' +
            '<span class="search-no-results-icon">🦕</span>' +
            '<div class="search-no-results-text">' + escapeHtml(noResultsText) + '</div>' +
            '<div class="search-no-results-hint">' + escapeHtml(hintText) + '</div>' +
            '</div>';
    }

    /**
     * 高亮文字中的關鍵字
     * @param {string} text - 原始文字
     * @param {string} query - 搜尋關鍵字
     * @returns {string} 高亮後的 HTML
     */
    function highlightText(text, query) {
        if (!query) {
            return escapeHtml(text);
        }

        const regex = new RegExp('(' + escapeRegExp(query) + ')', 'gi');
        return escapeHtml(text).replace(regex, '<span class="search-highlight">$1</span>');
    }

    /**
     * 隱藏搜尋結果
     */
    function hideSearchResults() {
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.classList.remove('active');
        }
        selectedSearchIndex = -1;
    }

    /**
     * 清除搜尋
     */
    function clearSearch() {
        const searchInput = document.getElementById('dinosaurSearch');
        const clearBtn = document.getElementById('clearSearch');

        if (searchInput) {
            searchInput.value = '';
            searchInput.focus();
        }

        if (clearBtn) {
            clearBtn.style.display = 'none';
        }

        hideSearchResults();
    }

    /**
     * 處理搜尋框鍵盤事件
     * @param {KeyboardEvent} event - 鍵盤事件
     */
    function handleSearchKeydown(event) {
        const searchResults = document.getElementById('searchResults');
        if (!searchResults || !searchResults.classList.contains('active')) {
            return;
        }

        const items = searchResults.querySelectorAll('.search-result-item');
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
        items.forEach(function (item, idx) {
            if (idx === selectedSearchIndex) {
                item.classList.add('selected');
                item.scrollIntoView({ block: 'nearest' });
            } else {
                item.classList.remove('selected');
            }
        });
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
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    /**
     * 跳脫正規表達式特殊字元
     * @param {string} string - 原始字串
     * @returns {string} 跳脫後的字串
     */
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

})();
