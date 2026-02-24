import { useI18n } from '../context/I18nContext'

export default function LanguageToggle({ compact = false }) {
    const { language, setLanguage, t } = useI18n()

    return (
        <div className="flex items-center gap-1">
            {!compact && <span className="text-xs text-slate-400 mr-1">{t('common.language')}</span>}
            <button
                type="button"
                className={language === 'es' ? 'btn-primary text-xs px-2 py-1' : 'btn-secondary text-xs px-2 py-1'}
                onClick={() => setLanguage('es')}
            >
                ES
            </button>
            <button
                type="button"
                className={language === 'en' ? 'btn-primary text-xs px-2 py-1' : 'btn-secondary text-xs px-2 py-1'}
                onClick={() => setLanguage('en')}
            >
                EN
            </button>
        </div>
    )
}
