import { MathJaxContext } from 'better-react-mathjax';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';

const mathJaxConfig = {
    tex: {
        inlineMath: [
            ['$', '$'],
            ['\\(', '\\)'],
        ],
        displayMath: [
            ['$$', '$$'],
            ['\\[', '\\]'],
        ],
    },
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MathJaxContext
            version={4}
            src="https://cdn.jsdelivr.net/npm/mathjax@4.1.1/tex-mml-chtml.js"
            config={mathJaxConfig}
        >
            <App />
        </MathJaxContext>
    </StrictMode>,
);
