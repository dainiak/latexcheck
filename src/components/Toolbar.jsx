import { useI18n } from '../i18n/I18nContext.jsx';

export default function Toolbar({ onCheck, onPreview }) {
    const { i18n, toggleLang } = useI18n();

    return (
        <div className="btn-group my-3" role="group">
            <button className="btn btn-primary" onClick={onCheck}>
                {i18n.strings.checkBtn}
            </button>
            <button className="btn btn-primary" onClick={onPreview}>
                {i18n.strings.previewBtn}
            </button>
            <a className="btn btn-primary" role="button"
               href="https://goo.gl/forms/bsCb6TxkEA49vof52" target="_blank" rel="noreferrer">
                {i18n.strings.reportBugBtn}
            </a>
            <button className="btn btn-outline-secondary" onClick={toggleLang}>
                {i18n.strings.langLabel}
            </button>
        </div>
    );
}
