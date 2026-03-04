import { useI18n } from '../i18n/I18nContext.jsx';

export default function Resources({ visible }) {
    const { i18n } = useI18n();

    if (!visible) return null;

    return (
        <div className="row mb-4">
            <div className="col">
                <div className="card">
                    <div className="card-body">
                        {i18n.resources.map((section, si) => (
                            <div key={si}>
                                <h5 className="card-title">{section.title}</h5>
                                <ul className={si < i18n.resources.length - 1 ? 'mb-4' : 'mb-0'}>
                                    {section.items.map((item, ii) => (
                                        <li key={ii}>
                                            {item.url ? (
                                                <a
                                                    href={item.url}
                                                    target="_blank"
                                                    rel="noreferrer"
                                                    dangerouslySetInnerHTML={{ __html: item.text }}
                                                />
                                            ) : (
                                                <span dangerouslySetInnerHTML={{ __html: item.text }} />
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
