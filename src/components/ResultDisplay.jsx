import { MathJaxBaseContext } from 'better-react-mathjax';
import { useContext, useEffect, useRef } from 'react';
import { useI18n } from '../i18n/I18nContext.jsx';

export default function ResultDisplay({ results, previewHtml, onGotoLine }) {
    const { i18n } = useI18n();
    const containerRef = useRef(null);
    const mjContext = useContext(MathJaxBaseContext);

    // biome-ignore lint/correctness/useExhaustiveDependencies: re-typeset MathJax when results/locale change
    useEffect(() => {
        if (containerRef.current && mjContext?.promise) {
            mjContext.promise.then((MathJax) => {
                if (MathJax?.typesetPromise) {
                    MathJax.typesetPromise([containerRef.current]).then(() => {
                        if (previewHtml && containerRef.current) {
                            containerRef.current.innerHTML = containerRef.current.innerHTML
                                .replace(/\\par/g, '<br>')
                                .replace(
                                    '((beginTask))',
                                    `<span class="badge bg-secondary">${i18n.strings.task}</span>`,
                                )
                                .replace(
                                    '((beginSolution))',
                                    `<span class="badge bg-secondary">${i18n.strings.solution}</span>`,
                                );
                        }
                    });
                }
            });
        }
    }, [results, previewHtml, mjContext, i18n]);

    if (previewHtml) {
        return <div className="card-text" ref={containerRef} dangerouslySetInnerHTML={{ __html: previewHtml }} />;
    }

    if (results === null) {
        return <div className="card-text">{i18n.strings.resultPlaceholder}</div>;
    }

    if (results.length === 0) {
        return (
            <div className="card-text" ref={containerRef} dangerouslySetInnerHTML={{ __html: i18n.strings.noErrors }} />
        );
    }

    return (
        <div className="card-text result-display-grid" ref={containerRef}>
            {results.map((r) => (
                <div key={r.code} className={`p-2 border severity${r.severity}`} data-severity={r.severity}>
                    <span dangerouslySetInnerHTML={{ __html: r.msg }} />
                    {r.fragments.flatMap((f, fi) => [
                        <br key={`br-${fi}`} />,
                        <span
                            key={`frag-${fi}`}
                            className="badge bg-secondary cursor-pointer"
                            onClick={f.line ? () => onGotoLine(f.line) : undefined}
                            dangerouslySetInnerHTML={{
                                __html:
                                    i18n.strings.wrongFragment.replace('{1}', f.snippet) +
                                    (f.line ? i18n.strings.lineNo.replace('{1}', f.line) : ''),
                            }}
                        />,
                    ])}
                </div>
            ))}
        </div>
    );
}
