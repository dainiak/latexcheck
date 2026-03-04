import { useI18n } from '../i18n/I18nContext.jsx';

export default function Header({ onToggleResources }) {
    const { i18n } = useI18n();

    return (
        <div className="row mb-4">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        <p className="mb-2" dangerouslySetInnerHTML={{ __html: i18n.strings.headerDesc }} />
                        <p className="mb-0">
                            <a className="text-decoration-none cursor-pointer" role="button" onClick={onToggleResources}>
                                {i18n.strings.resourcesToggle}
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
