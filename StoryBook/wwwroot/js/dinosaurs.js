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

    // ==========================================================================
    // 圖片處理
    // ==========================================================================

    /**
     * 處理圖片載入錯誤
     * @param {Event} event - 錯誤事件
     */
    function handleImageError(event) {
        const img = event.target;
        const placeholder = '/images/placeholder.png';
        
        // 避免無限循環
        if (!img.dataset.errorHandled) {
            img.dataset.errorHandled = 'true';
            img.src = placeholder;
            img.alt = '圖片載入失敗';
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
        handleImageError: handleImageError
    };

})();
