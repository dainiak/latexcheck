import { useState, useRef, useEffect, useCallback } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import { I18nProvider, useI18n } from './i18n/I18nContext.jsx';
import { checkLatex } from './checker/checkLatex.js';
import Header from './components/Header.jsx';
import Resources from './components/Resources.jsx';
import Editor from './components/Editor.jsx';
import Toolbar from './components/Toolbar.jsx';
import ResultDisplay from './components/ResultDisplay.jsx';

function AppContent() {
    const { i18n } = useI18n();
    const editorRef = useRef(null);
    const [results, setResults] = useState(null);
    const [previewHtml, setPreviewHtml] = useState(null);
    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return window.matchMedia('(prefers-color-scheme: dark)').matches;
        }
        return false;
    });

    useEffect(() => {
        document.body.setAttribute('data-bs-theme', isDark ? 'dark' : 'light');
    }, [isDark]);

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');
        const handler = (e) => setIsDark(e.matches);
        mq.addEventListener('change', handler);
        return () => mq.removeEventListener('change', handler);
    }, []);

    const handleCheck = useCallback(() => {
        if (!editorRef.current) return;
        const text = editorRef.current.editor.getValue();
        const checkResults = checkLatex(text, i18n.errorDescriptions, i18n.strings);
        setResults(checkResults);
        setPreviewHtml(null);
    }, [i18n]);

    const handlePreview = useCallback(() => {
        if (!editorRef.current) return;
        const text = editorRef.current.editor.getValue();
        const html = text
            .replace(/\\begin{task}/g, '((beginTask))')
            .replace(/\\begin{solution}/g, '((beginSolution))')
            .replace(/\\end{(task|solution)}/g, '')
            .replace(/---/g, '\u2014')
            .replace(/--/g, '\u2013')
            .replace(/<</g, '\u00ab')
            .replace(/>>/g, '\u00bb')
            .replace(/``/g, '\u201c')
            .replace(/''/g, '\u201d')
            .replace(/\n\n/g, '\\par ');
        setPreviewHtml(html);
        setResults(null);
    }, []);

    const handleGotoLine = useCallback((line) => {
        if (editorRef.current) {
            editorRef.current.editor.gotoLine(line, 0);
            editorRef.current.editor.focus();
        }
    }, []);

    return (
        <>
            <div className="social-share">
                <div className="ribbon-container">
                    <div className="ribbon">
                        <a href="https://github.com/dainiak/latexcheck" target="_blank" rel="noreferrer">
                            {i18n.strings.githubRibbon}
                        </a>
                    </div>
                </div>
            </div>

            <div className="container py-4">
                <Header />
                <Resources />

                <div className="row mb-4">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <label className="form-label" dangerouslySetInnerHTML={{ __html: i18n.strings.pasteLabel }} />
                                <Editor ref={editorRef} isDark={isDark} />
                                <Toolbar onCheck={handleCheck} onPreview={handlePreview} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    <div className="col">
                        <div className="card">
                            <div className="card-body">
                                <ResultDisplay
                                    results={results}
                                    previewHtml={previewHtml}
                                    onGotoLine={handleGotoLine}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default function App() {
    return (
        <I18nProvider>
            <AppContent />
        </I18nProvider>
    );
}
