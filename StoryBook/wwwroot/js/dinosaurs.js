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

    // ==========================================================================
    // 初始化
    // ==========================================================================

    /**
     * 頁面載入完成後初始化
     */
    document.addEventListener('DOMContentLoaded', function () {
        initLanguage();
        initImageErrorHandling();
        initNavigationButtons();
        initKeyboardNavigation();
        initImageModal();
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
     * 初始化圖片錯誤處理
     */
    function initImageErrorHandling() {
        const images = document.querySelectorAll('.dinosaur-image');
        images.forEach(function (img) {
            img.addEventListener('error', handleImageError);
        });
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
            img.alt = '圖片載入失敗';
        }
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
        closeImageModal: closeImageModal
    };

})();
