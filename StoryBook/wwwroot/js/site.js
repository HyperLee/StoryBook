/**
 * 恐龍故事書 - 全站功能腳本
 * 提供語言切換、主題設定等全站功能
 */

(function () {
    'use strict';

    // ==========================================================================
    // 常數設定
    // ==========================================================================
    
    const STORAGE_KEY_LANGUAGE = 'storybook-language';
    const DEFAULT_LANGUAGE = 'zh';
    const SUPPORTED_LANGUAGES = ['zh', 'en'];

    // ==========================================================================
    // 狀態管理
    // ==========================================================================
    
    let currentLanguage = DEFAULT_LANGUAGE;

    // ==========================================================================
    // 初始化
    // ==========================================================================

    /**
     * 頁面載入完成後初始化
     */
    document.addEventListener('DOMContentLoaded', function () {
        initLanguage();
        initLanguageSwitcher();
    });

    /**
     * 初始化語言設定
     * 從 localStorage 讀取並套用使用者偏好的語言
     */
    function initLanguage() {
        const savedLang = localStorage.getItem(STORAGE_KEY_LANGUAGE);
        
        if (savedLang && SUPPORTED_LANGUAGES.includes(savedLang)) {
            currentLanguage = savedLang;
        } else {
            // 嘗試從瀏覽器語言設定偵測
            const browserLang = navigator.language || navigator.userLanguage;
            if (browserLang && browserLang.toLowerCase().startsWith('en')) {
                currentLanguage = 'en';
            } else {
                currentLanguage = DEFAULT_LANGUAGE;
            }
        }

        // 套用語言設定
        applyLanguage(currentLanguage);
    }

    /**
     * 初始化語言切換元件
     */
    function initLanguageSwitcher() {
        const languageButtons = document.querySelectorAll('.language-btn');
        
        languageButtons.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const lang = this.getAttribute('data-lang');
                if (lang && SUPPORTED_LANGUAGES.includes(lang)) {
                    setLanguage(lang);
                }
            });
        });

        // 更新按鈕狀態
        updateLanguageButtonState();
    }

    // ==========================================================================
    // 語言切換功能
    // ==========================================================================

    /**
     * 設定語言
     * @param {string} lang - 語言代碼 ('zh' 或 'en')
     */
    function setLanguage(lang) {
        if (!SUPPORTED_LANGUAGES.includes(lang)) {
            console.warn('Unsupported language:', lang);
            return;
        }

        currentLanguage = lang;
        localStorage.setItem(STORAGE_KEY_LANGUAGE, lang);
        applyLanguage(lang);
        updateLanguageButtonState();

        // 觸發自訂事件，讓其他腳本可以監聽語言變更
        document.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language: lang }
        }));
    }

    /**
     * 取得當前語言
     * @returns {string} 語言代碼
     */
    function getLanguage() {
        return currentLanguage;
    }

    /**
     * 套用語言設定到頁面
     * @param {string} lang - 語言代碼
     */
    function applyLanguage(lang) {
        // 更新 HTML lang 屬性
        document.documentElement.setAttribute('lang', lang === 'zh' ? 'zh-TW' : 'en');
        document.documentElement.setAttribute('data-lang', lang);

        // 更新所有有 data-lang-* 屬性的元素
        updateTextContent(lang);
        updatePlaceholders(lang);
        updateTitles(lang);
    }

    /**
     * 更新文字內容
     * @param {string} lang - 語言代碼
     */
    function updateTextContent(lang) {
        const elements = document.querySelectorAll('[data-lang-zh][data-lang-en]');
        
        elements.forEach(function (el) {
            const zhText = el.getAttribute('data-lang-zh');
            const enText = el.getAttribute('data-lang-en');
            
            if (lang === 'en' && enText) {
                el.textContent = enText;
            } else if (zhText) {
                el.textContent = zhText;
            }
        });
    }

    /**
     * 更新 placeholder 屬性
     * @param {string} lang - 語言代碼
     */
    function updatePlaceholders(lang) {
        const inputs = document.querySelectorAll('[data-lang-placeholder-zh][data-lang-placeholder-en]');
        
        inputs.forEach(function (input) {
            const zhPlaceholder = input.getAttribute('data-lang-placeholder-zh');
            const enPlaceholder = input.getAttribute('data-lang-placeholder-en');
            
            if (lang === 'en' && enPlaceholder) {
                input.setAttribute('placeholder', enPlaceholder);
            } else if (zhPlaceholder) {
                input.setAttribute('placeholder', zhPlaceholder);
            }
        });
    }

    /**
     * 更新 title 屬性
     * @param {string} lang - 語言代碼
     */
    function updateTitles(lang) {
        const elements = document.querySelectorAll('[data-lang-title-zh][data-lang-title-en]');
        
        elements.forEach(function (el) {
            const zhTitle = el.getAttribute('data-lang-title-zh');
            const enTitle = el.getAttribute('data-lang-title-en');
            
            if (lang === 'en' && enTitle) {
                el.setAttribute('title', enTitle);
            } else if (zhTitle) {
                el.setAttribute('title', zhTitle);
            }
        });
    }

    /**
     * 更新語言按鈕狀態
     */
    function updateLanguageButtonState() {
        const languageButtons = document.querySelectorAll('.language-btn');
        
        languageButtons.forEach(function (btn) {
            const btnLang = btn.getAttribute('data-lang');
            
            if (btnLang === currentLanguage) {
                btn.classList.add('active');
                btn.setAttribute('aria-pressed', 'true');
            } else {
                btn.classList.remove('active');
                btn.setAttribute('aria-pressed', 'false');
            }
        });
    }

    // ==========================================================================
    // 多語言文字取得
    // ==========================================================================

    /**
     * 取得多語言文字
     * @param {Object} textObj - 包含 zh 和 en 屬性的物件
     * @param {string} [lang] - 語言代碼，預設為當前語言
     * @returns {string} 對應語言的文字
     */
    function getText(textObj, lang) {
        if (!textObj) {
            return '';
        }

        const targetLang = lang || currentLanguage;
        
        if (targetLang === 'en' && textObj.en) {
            return textObj.en;
        }
        
        return textObj.zh || textObj.en || '';
    }

    // ==========================================================================
    // 匯出公開 API
    // ==========================================================================

    window.StoryBookApp = {
        // 語言功能
        setLanguage: setLanguage,
        getLanguage: getLanguage,
        getText: getText,
        
        // 常數
        SUPPORTED_LANGUAGES: SUPPORTED_LANGUAGES,
        DEFAULT_LANGUAGE: DEFAULT_LANGUAGE
    };

})();
