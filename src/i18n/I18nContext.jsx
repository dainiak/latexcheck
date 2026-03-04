import { createContext, useCallback, useContext, useState } from 'react';
import en from './en.js';
import ru from './ru.js';

const locales = { en, ru };
const I18nContext = createContext();

export function I18nProvider({ children }) {
    const [lang, setLang] = useState(() => {
        try {
            return localStorage.getItem('latexcheck-lang') || 'en';
        } catch {
            return 'en';
        }
    });

    const toggleLang = useCallback(() => {
        setLang((prev) => {
            const next = prev === 'en' ? 'ru' : 'en';
            try {
                localStorage.setItem('latexcheck-lang', next);
            } catch {}
            return next;
        });
    }, []);

    const i18n = locales[lang];

    return <I18nContext.Provider value={{ lang, i18n, toggleLang }}>{children}</I18nContext.Provider>;
}

export function useI18n() {
    return useContext(I18nContext);
}
