import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import {
    DEFAULT_LANGUAGE,
    LOCALES_BY_LANGUAGE,
    SUPPORTED_LANGUAGES,
    translations,
} from '../i18n/translations'

const STORAGE_KEY = 'devtrack_lang'

const I18nContext = createContext(null)

function getInitialLanguage() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY)
        if (saved && SUPPORTED_LANGUAGES.includes(saved)) {
            return saved
        }
    } catch {
        return DEFAULT_LANGUAGE
    }
    return DEFAULT_LANGUAGE
}

function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => (acc && acc[part] !== undefined ? acc[part] : undefined), obj)
}

function formatTemplate(text, params) {
    if (!params) return text
    return text.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ''))
}

export function I18nProvider({ children }) {
    const [language, setLanguageState] = useState(getInitialLanguage)

    const locale = LOCALES_BY_LANGUAGE[language] || LOCALES_BY_LANGUAGE[DEFAULT_LANGUAGE]

    useEffect(() => {
        document.documentElement.lang = locale
    }, [locale])

    const setLanguage = (nextLanguage) => {
        if (!SUPPORTED_LANGUAGES.includes(nextLanguage)) return
        setLanguageState(nextLanguage)
        try {
            localStorage.setItem(STORAGE_KEY, nextLanguage)
        } catch {
            // Ignore localStorage write failures.
        }
    }

    const t = (key, params) => {
        const languagePack = translations[language] || translations[DEFAULT_LANGUAGE]
        const fallbackPack = translations[DEFAULT_LANGUAGE]
        const value = getNestedValue(languagePack, key) ?? getNestedValue(fallbackPack, key) ?? key
        return formatTemplate(String(value), params)
    }

    const value = useMemo(() => ({
        language,
        locale,
        setLanguage,
        t,
    }), [language, locale])

    return (
        <I18nContext.Provider value={value}>
            {children}
        </I18nContext.Provider>
    )
}

export function useI18n() {
    const context = useContext(I18nContext)
    if (!context) {
        throw new Error('useI18n must be used inside I18nProvider')
    }
    return context
}
