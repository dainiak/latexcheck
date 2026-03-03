import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MathJaxContext } from 'better-react-mathjax';
import App from './App.jsx';

const mathJaxConfig = {
    tex: {
        inlineMath: [['$', '$'], ['\\(', '\\)']],
        displayMath: [['$$', '$$'], ['\\[', '\\]']]
    }
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <MathJaxContext config={mathJaxConfig}>
            <App />
        </MathJaxContext>
    </StrictMode>
);
