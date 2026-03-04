/**
 * Pure LaTeX style checker function.
 * @param {string} latexString - The LaTeX source code to check
 * @param {Object} errorDescriptions - Map of error codes to {msg, severity}
 * @param {Object} strings - UI strings (mmDoubleOpen, mmWrongClose, wrongFragment, lineNo, noErrors)
 * @returns {Array<{code: string, severity: number, msg: string, fragments: Array<{snippet: string, line: number|null}>}>}
 */
export function checkLatex(latexString, errorDescriptions, strings) {
    let fragments = null;
    const textFragments = [];
    const mathFragments = [];
    const mathFragmentTypes = [];

    const results = [];
    const usedErrorCodes = {};

    const capCyrLetters = 'АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';
    const smallCyrLetters = 'абвгдеёжзиклмнопрстуфхцчшщьыъэюя';
    function isCyrLetter(letter) {
        return capCyrLetters.includes(letter) || smallCyrLetters.includes(letter);
    }
    function isWordSymbol(letter) {
        return /\w/.test(letter) || isCyrLetter(letter);
    }

    function extractSnippet(fragment, position, radius) {
        if (position === null || position === undefined) {
            return fragment;
        }
        radius = radius ? radius : 5;
        let left = Math.max(0, position - radius);
        let right = Math.min(fragment.length - 1, position + radius);
        if (isWordSymbol(fragment.substring(left, left + 1))) {
            while (left > 0 && isWordSymbol(fragment.substring(left - 1, left))) {
                --left;
            }
        } else {
            while (left > 0 && !isWordSymbol(fragment.substring(left - 1, left))) {
                --left;
            }
        }
        if (isWordSymbol(fragment.substring(right, right + 1))) {
            while (right < fragment.length - 1 && isWordSymbol(fragment.substring(right + 1, right + 2))) {
                ++right;
            }
        } else {
            while (right < fragment.length - 1 && !isWordSymbol(fragment.substring(right + 1, right + 2))) {
                ++right;
            }
        }
        return fragment.substring(left, right + 1);
    }

    function findLine(fragmentType, fragmentIndex, positionInFragment) {
        if (fragmentIndex === undefined) {
            return latexString.substring(0, fragmentType).split('\n').length;
        }
        let numLinesSkipped = 0;
        for (let i = 0; i < fragmentIndex; ++i) {
            numLinesSkipped += mathFragments[i].split('\n').length - 1;
            numLinesSkipped += textFragments[i].split('\n').length - 1;
        }
        if (fragmentType === 'math') {
            numLinesSkipped += textFragments[fragmentIndex].split('\n').length - 1;
            numLinesSkipped += mathFragments[fragmentIndex].substring(0, positionInFragment).split('\n').length - 1;
        } else {
            numLinesSkipped += textFragments[fragmentIndex].substring(0, positionInFragment).split('\n').length - 1;
        }
        return numLinesSkipped + 1;
    }

    function addWarning(errorCode, extraInfo, codeFragment, lineNumber) {
        if (!errorDescriptions[errorCode] || !errorDescriptions[errorCode].msg) {
            return;
        }

        if (!usedErrorCodes[errorCode]) {
            const entry = {
                code: errorCode,
                severity: errorDescriptions[errorCode].severity,
                msg: extraInfo || errorDescriptions[errorCode].msg,
                fragments: [],
            };
            usedErrorCodes[errorCode] = entry;
            results.push(entry);
        }

        if (codeFragment) {
            usedErrorCodes[errorCode].fragments.push({
                snippet: codeFragment,
                line: lineNumber || null,
            });
        }
    }

    function addTypicalWarning(errorCode, fragmentType, fragmentIndex, positionInFragment) {
        return addWarning(
            errorCode,
            null,
            extractSnippet(
                (fragmentType === 'math' ? mathFragments : textFragments)[fragmentIndex],
                positionInFragment,
            ),
            findLine(fragmentType, fragmentIndex, positionInFragment),
        );
    }

    function addWarningQuick(fragmentType, badness, errorCode, mathFragmentType) {
        if (fragmentType === 'math' || fragmentType === 'any') {
            for (let i = 0; i < mathFragments.length; ++i) {
                if (mathFragmentType && mathFragmentType !== mathFragmentTypes[i]) {
                    continue;
                }
                const badPos = mathFragments[i].search(badness);
                if (badPos >= 0) {
                    addTypicalWarning(errorCode, 'math', i, badPos);
                }
            }
        }
        if (fragmentType === 'text' || fragmentType === 'any') {
            for (let i = 0; i < textFragments.length; ++i) {
                const badPos = textFragments[i].search(badness);
                if (badPos >= 0) {
                    addTypicalWarning(errorCode, 'text', i, badPos);
                }
            }
        }
    }

    /* STAGE: Check math delimiters */
    let badPos = latexString.search(/\${2}/);
    if (badPos >= 0) {
        addWarning('DOUBLE_DOLLARS', null, '$$', latexString.substring(0, badPos).split('\n').length - 1);
    }

    let i = 0;
    let currentlyInMathMode = false;
    let lastSeenBrace = '';
    while (i < latexString.length) {
        const nextTwoSymbols = latexString.substring(i, i + 2);
        const nextSymbol = latexString.substring(i, i + 1);
        if (nextTwoSymbols === '$$') {
            if (currentlyInMathMode) {
                if (lastSeenBrace !== '$$') {
                    addWarning(
                        'MISMATCHED_MATH_DELIMITERS',
                        strings.mmDoubleOpen.replace('{1}', nextTwoSymbols).replace('{2}', lastSeenBrace),
                    );
                    break;
                }
                currentlyInMathMode = false;
                lastSeenBrace = '';
            } else {
                currentlyInMathMode = true;
                lastSeenBrace = '$$';
            }
            i += 2;
        } else if (['\\[', '\\('].includes(nextTwoSymbols)) {
            if (currentlyInMathMode) {
                addWarning(
                    'MISMATCHED_MATH_DELIMITERS',
                    strings.mmDoubleOpen.replace('{1}', nextTwoSymbols).replace('{2}', lastSeenBrace),
                );
                break;
            }
            lastSeenBrace = nextTwoSymbols;
            currentlyInMathMode = true;
            i += 2;
        } else if (['\\]', '\\)'].includes(nextTwoSymbols)) {
            if (!currentlyInMathMode) {
                addWarning('MISMATCHED_MATH_DELIMITERS', strings.mmWrongClose.replace('{1}', nextTwoSymbols));
                break;
            }
            if (
                (nextTwoSymbols === '\\]' && lastSeenBrace !== '\\[') ||
                (nextTwoSymbols === '\\)' && lastSeenBrace !== '\\(')
            ) {
                addWarning(
                    'MISMATCHED_MATH_DELIMITERS',
                    strings.mmDoubleOpen.replace('{1}', nextTwoSymbols).replace('{2}', lastSeenBrace),
                );
                break;
            }
            lastSeenBrace = '';
            currentlyInMathMode = false;
            i += 2;
        } else if (nextTwoSymbols === '\\') {
            i += 2;
        } else if (nextSymbol === '$') {
            if (currentlyInMathMode && lastSeenBrace !== '$') {
                addWarning(
                    'MISMATCHED_MATH_DELIMITERS',
                    strings.mmDoubleOpen.replace('{1}', '$').replace('{2}', lastSeenBrace),
                );
                break;
            }
            if (!currentlyInMathMode) {
                currentlyInMathMode = true;
                lastSeenBrace = '$';
            } else {
                currentlyInMathMode = false;
                lastSeenBrace = '';
            }
            i += 1;
        } else {
            i += 1;
        }
    }

    /* STAGE: check for unnecessary paragraph break before display math formula */
    badPos = latexString.search(/\s*\n+\s*\n+\s*(\\\[|\\begin{(equation|multline|align|gather|flalign)\*?})/);
    if (badPos >= 0) {
        addWarning(
            'PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA',
            null,
            extractSnippet(latexString, badPos, 10),
            findLine(badPos),
        );
    }

    /* STAGE: check if math formulae are not split without necessity */
    badPos = latexString.search(/(\$|\\\))\s*[-+/,=]?\s*(\$|\\\()/);
    if (badPos >= 0) {
        addWarning('UNNECESSARY_FORMULA_BREAK', null, extractSnippet(latexString, badPos, 10), findLine(badPos));
    }

    /* STAGE: check for low-level font commands */
    badPos = latexString.search(/\\it[^a-z0-9]|\\bf[^a-z0-9]/);
    if (badPos >= 0) {
        addWarning('LOW_LEVEL_FONT_COMMANDS', null, extractSnippet(latexString, badPos), findLine(badPos));
    }

    badPos = latexString.search(/\\textit/);
    if (badPos >= 0) {
        addWarning('ITALIC_INSTEAD_OF_EMPH', null, extractSnippet(latexString, badPos), findLine(badPos));
    }

    badPos = latexString.search(/\\](\s|[^a-zабвгдеёжзиклмнопрстуфхцчшщьыъэюя])*\\\[/i);
    if (badPos >= 0) {
        addWarning('CONSECUTIVE_DISPLAY_FORMULAE', null, extractSnippet(latexString, badPos), findLine(badPos + 3));
    }

    /* STAGE: eqnarray environment used */
    badPos = latexString.search(/eqnarray/);
    if (badPos >= 0) {
        addWarning('EQNARRAY_USED', null, extractSnippet(latexString, badPos), findLine(badPos + 3));
    }

    /* STAGE: Check for \mbox and \hbox */
    badPos = latexString.search(/\\[mh]box/);
    if (badPos >= 0) {
        addWarning('REPLACE_MBOX_WITH_TEXT', null, extractSnippet(latexString, badPos));
    }

    /* STAGE: check if paragraph starts with a formula */
    badPos = latexString.search(/(\n\s*\n|\\par)\s*(\$|\\\()/);
    if (badPos >= 0) {
        addWarning('PARAGRAPH_STARTS_WITH_FORMULA', null, extractSnippet(latexString, badPos), findLine(badPos));
    }

    /* STAGE: check if ordinals are properly abbreviated */
    badPos = latexString.search(
        /(\\\)|\$)?\s*-{1,3}\s*(ый|ого|о|тому|ому|ему|ом|ая|ой|ую|ые|ыми|и|ым|тым|той|им|его|того|тых|ых|том|ем|ём|ех|ёх|ух)([^абвгдеёжзиклмнопрстуфхцчшщьыъэюя]|$)/i,
    );
    if (badPos >= 0) {
        addWarning('RU_ORDINAL_ABBREVIATION', null, extractSnippet(latexString, badPos), findLine(badPos));
    }

    badPos = latexString.search(/(([2-9]|11)\\?[a-z]*-*{?st)|((11|12|13)\\?[a-z]*-*{?(st|nd|rd))/i);
    if (badPos >= 0) {
        addWarning('EN_ORDINAL_ABBREVIATION', null, extractSnippet(latexString, badPos), findLine(badPos));
    }

    /* STAGE: check if letters are defined before they are used */
    badPos = latexString.search(/,(\\]|\$)?\s+где([^абвгдеёжзиклмнопрстуфхцчшщьыъэюя]|$)/i);
    if (badPos >= 0) {
        addWarning('LATE_DEFINITION', null, extractSnippet(latexString, badPos), findLine(badPos));
    }

    /* STAGE: check for math environment verbosity */
    badPos = latexString.search(/\\begin{math}/);
    if (badPos >= 0) {
        addWarning(
            'MATH_ENVIRONMENT_VERBOSITY_WARNING',
            null,
            extractSnippet(latexString, badPos + 7),
            findLine(badPos),
        );
    }

    /* STAGE: split into text and math blocks */
    fragments = latexString.split(
        /(\$\$|\\\[|\\]|\\\(|\\\)|\$|\\(?:begin|end){(?:displaymath|alignat|flalign|equation|align|gather|eqnarray|multline|math)\*?})/,
    );

    for (let i = 0; i < fragments.length; ++i) {
        if (i % 4 === 0) {
            textFragments.push(fragments[i]);
        } else if (i % 4 === 2) {
            mathFragments.push(fragments[i]);
            mathFragmentTypes.push(
                fragments[i - 1] === '\\(' || fragments[i - 1] === '$' || fragments[i - 1] === '\\begin{math}'
                    ? 'inline'
                    : 'display',
            );
        }
    }

    /* STAGE: check for neighbouring formulas */
    for (let i = 1; i < textFragments.length - 1; ++i) {
        if (textFragments[i].match(/^\s*$/)) {
            addWarning(
                'UNNECESSARY_FORMULA_BREAK',
                'Формулы <code>' +
                    mathFragments[i - 1] +
                    '</code> и <code>' +
                    mathFragments[i] +
                    '</code> не разделены текстом. ' +
                    'Возможно, следует объединить эти две формулы в одну, либо вставить вводное слово перед второй формулой. ',
                textFragments[i],
                findLine('text', i, 0),
            );
        }
    }

    for (let i = 0; i < textFragments.length; ++i) {
        const badPos = textFragments[i].search(/[?!.,;:]$/);
        if (badPos >= 0 && i < mathFragmentTypes.length && mathFragmentTypes[i] === 'inline') {
            addTypicalWarning('SPACE_AFTER_PUNCTUATION_MARK', 'text', i, badPos);
        }
    }

    addWarningQuick(
        'text',
        /\\[a-zA-Z]+[АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯабвгдеёжзиклмнопрстуфхцчшщьыъэюя]/,
        'NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC',
    );

    addWarningQuick(
        'text',
        /[?!.,;:][АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯабвгдеёжзиклмнопрстуфхцчшщьыъэюя]/,
        'SPACE_AFTER_PUNCTUATION_MARK',
    );

    /* STAGE: check for capitals after punctuation */
    addWarningQuick('text', /[,;:]\s*[АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ]/, 'CAPITALIZATION_AFTER_PUNCTUATION_MARK');

    /* STAGE: check for capital letter after period */
    addWarningQuick('text', /\.\s*[абвгдеёжзиклмнопрстуфхцчшщьыъэюя]/, 'CAPITALIZATION_AFTER_PERIOD');

    /* STAGE: check for period before new sentence */
    for (let i = 0; i < textFragments.length; ++i) {
        if (
            i > 0 &&
            capCyrLetters.includes(textFragments[i].trim().substring(0, 1)) &&
            !mathFragments[i - 1].trim().match(/\.(\s*}*)*$/)
        ) {
            addWarning(
                'PERIOD_BEFORE_NEXT_SENTENCE',
                null,
                extractSnippet(mathFragments[i - 1] + textFragments[i], mathFragments[i - 1].length),
            );
        }
    }

    /* STAGE: check for \left-\right commands */
    for (let i = 0; i < mathFragments.length; ++i) {
        if (mathFragmentTypes[i] !== 'display' && !mathFragments[i].match(/\\displaystyle/)) {
            continue;
        }

        let modifiedMathFragment = mathFragments[i];
        for (let j = 0, k = 0; j < modifiedMathFragment.length; ++j) {
            if (modifiedMathFragment.substring(j, j + 1) === '|') {
                ++k;
                modifiedMathFragment =
                    modifiedMathFragment.substring(0, j) +
                    (k % 2 ? '¹' : '²') +
                    modifiedMathFragment.substring(j + 1, j + 1 + modifiedMathFragment.length);
            }
        }
        const largeFormula = '(\\\\(frac|binom|over|underline|sum|prod|choose)|((\\)|\\\\}|])[_^]))';
        const delimiters = [
            '¹[^|]*?  [^|]*?²',
            '[(][^)]*  [^)]*[)]',
            '\\\\[{].*?  .*?\\\\[}]',
            '\\\\lfloor.*?  .*?\\\\rfloor',
            '\\\\lceil.*?  .*?\\\\rceil',
            '\\\\lvert.*?  .*?\\\\rvert',
        ];

        for (let j = 0; j < delimiters.length; ++j) {
            const [ldelim, rdelim] = delimiters[j].split('  ');

            const re = new RegExp(ldelim + largeFormula + rdelim);
            const badMatch = modifiedMathFragment.match(re);
            if (badMatch && badMatch[0].search(/\\(right|bigr|biggr)/) < 0) {
                addWarning('LEFT_RIGHT_RECOMMENDED', null, badMatch[0].replace(/[¹²]/g, '|'), findLine('math', i, 0));
                break;
            }
        }
    }

    /* STAGE: bar used instead of \mid in set comprehension */
    for (let i = 0; i < mathFragments.length; ++i) {
        const badMatch = mathFragments[i].match(/\\{.*?\|.*?\\}/);
        if (badMatch && !badMatch[0].includes('\\mid')) {
            addWarning('MID_IN_SET_COMPREHENSION', null, badMatch[0]);
        }
    }

    /* STAGE: \mid used instead of bar */
    for (let i = 0; i < mathFragments.length; ++i) {
        const badMatch = mathFragments[i].match(/\\mid.*?\\mid/);
        if (badMatch && !badMatch[0].includes('\\}')) {
            addWarning('MID_IN_SET_COMPREHENSION', null, badMatch[0]);
        }
    }

    /* STAGE: problems with symbolic links */
    for (let i = 0; i < textFragments.length; ++i) {
        let badPos = textFragments[i].search(
            /(рис(унок|унка|унке|\.)|формул(а|е|ой|у|ы)|(равенств|тождеств)(о|а|е|у|ами|ах)|(соотношени|выражени)(е|ю|и|я|ями|ях|ям))\s+\(?\d\)?/i,
        );
        if (badPos < 0) {
            badPos = textFragments[i].search(/(\s|~)\(\d\)(\.|,?\s+[абвгдеёжзиклмнопрстуфхцчшщьыъэюя]*\W)/);
        }
        if (badPos >= 0) {
            addTypicalWarning('SYMBOLIC_LINKS', 'text', i, badPos);
        }
    }

    addWarningQuick('math', /^\s*(\(\d+|\*)\)\s*$/, 'SYMBOLIC_LINKS');

    addWarningQuick('text', /\(\\ref{[^}]*}\)/, 'EQREF_INSTEAD_OF_REF');

    addWarningQuick('text', /\S\s+\\(eqref|ref){[^}]*}/, 'NONBREAKABLE_SPACE_BEFORE_REF');

    /* STAGE: Trivially named symbolic link */
    addWarningQuick(
        'any',
        /\\label{\s*(eq|equation|eqn|th|thm|lemma|theorem|lem|fig|figure)?:?[^a-z}]}/i,
        'TRIVIAL_LABEL',
    );

    /* STAGE: ordinal abbreviation in math mode */
    addWarningQuick('math', /\^{(th|st|nd|rd)}/, 'EN_ORDINAL_ABBREVIATION_IN_MATH');

    /* STAGE: Ellipsis */
    addWarningQuick('math', /\.{3}/, 'ELLIPSIS_LDOTS');

    /* STAGE: Text in math mode */
    for (let i = 0; i < mathFragments.length; ++i) {
        let badPos = mathFragments[i].search(new RegExp(`[${smallCyrLetters}${capCyrLetters}]`));
        if (badPos < 0) {
            badPos = mathFragments[i].search(/([^a-z\\]|^)[a-z]{4,}/i);
        }
        if (
            badPos >= 0 &&
            mathFragments[i].search(/\\(text|mbox|hbox)/) < 0 &&
            mathFragments[i].substring(0, badPos).search(/\\label/) < 0
        ) {
            addTypicalWarning('TEXT_IN_MATH_MODE', 'math', i, badPos);
        }
    }

    /* STAGE: checking if there is a decent conclusion */
    const lastTextFragment = textFragments[textFragments.length - 1].trim();
    if (
        (lastTextFragment.length === 0 ||
            lastTextFragment.match(/\\end{(figure|enumerate|itemize|tabular)}\s*\\end{solution}$/)) &&
        textFragments[textFragments.length - 2].search(/Ответ/i) < 0
    ) {
        addWarning('NO_CONCLUSION');
    }

    /* STAGE: check if there are sentences starting with formula */
    for (let i = 0; i < mathFragments.length; ++i) {
        if (textFragments[i].trim().endsWith('.')) {
            addTypicalWarning('SENTENCE_STARTS_WITH_FORMULA', 'math', i, 0);
        }
    }

    /* STAGE: check if there's no punctuation marks right after display math */
    for (let i = 0; i < textFragments.length; ++i) {
        const badPos = textFragments[i].search(/^\s*[,.!?:;]/);
        if (badPos >= 0 && i > 0 && mathFragmentTypes[i - 1] === 'display') {
            addTypicalWarning('PUNCTUATION_AFTER_DISPLAY_MATH', 'text', i, badPos);
        }
    }

    /* STAGE: check if there are shortcuts for \not command */
    addWarningQuick('math', /\\not\s*(=|\\in)/, 'INCORPORATE_NOT');

    /* STAGE: check if there are unicode symbols used instead of proper LaTeX commands */
    addWarningQuick('any', '√', 'UNICODE_SQRT');

    /* STAGE: check for includegraphics in math mode */
    addWarningQuick('math', /\\includegraphics/, 'GRAPHICS_IN_MATH_MODE');

    addWarningQuick('text', /[.?!]\s+[0-9]+/, 'SENTENCE_STARTS_WITH_NUMBER');

    /* STAGE: check quotation marks */
    addWarningQuick('text', /"/, 'WRONG_QUOTES');
    addWarningQuick('math', /"/, 'QUOTES_IN_MATH');
    addWarningQuick('text', /(''[^']+'')|('[^']+')|(``[^']+``)|(`[^']+`)|(''[^']+``)/, 'WRONG_SAME_QUOTES');

    /* STAGE: check for suggested new paragraph */
    addWarningQuick('text', /([^\\]\\(\\|newline)[^\\])/, 'SUGGESTED_NEW_PARAGRAPH');

    /* STAGE: check latin letters outside math mode */
    addWarningQuick('text', /(^|[,. ~])[a-zA-Z]($|[,.:!? ~-])/, 'LATIN_LETTER_OUTSIDE_MATH_RU');
    addWarningQuick('text', /(^|[,. ~])[b-zA-HJ-Z]($|[,.:!? ~-])/, 'LATIN_LETTER_OUTSIDE_MATH_EN');

    /* STAGE: check typical math commands outside math mode */
    addWarningQuick(
        'text',
        /(\\(infty|cdot|sum))|([0-9 \n]+ *[=+*^])|([+*^] *[0-9 \n]+)/,
        'MATH_SEMANTICS_OUTSIDE_MATH',
    );

    /* STAGE: check if latin letter c accidentally used instead of cyrillic с and vice versa */
    addWarningQuick(
        'text',
        /[абвгдеёжзиклмнопрстуфхцчшщьыъэюя ]\s+c\s+[абвгдеёжзиклмнопрстуфхцчшщьыъэюя ]/i,
        'LATIN_LETTER_C_MISUSED',
    );
    addWarningQuick(
        'math',
        /(^|[^ абвгдеёжзиклмнопрстуфхцчшщьыъэюя])[аесх]($|[^ абвгдеёжзиклмнопрстуфхцчшщьыъэюя])/i,
        'CYRILLIC_LETTER_C_MISUSED',
    );

    addWarningQuick('math', /-$/, 'DASH_IN_MATH_MODE');

    /* STAGE: check if hyphen is used where dash should be */
    addWarningQuick('text', ' - ', 'DASH_HYPHEN');

    /* STAGE: check if standard colloquial abbreviations have space in them */
    addWarningQuick('text', /ч\. ?т\.|т\. ?н\.|т\. ?ч\.|т\. ?к\./, 'ABBREVIATIONS_WITH_SPACE');

    /* STAGE: check if dash is surrounded with spaces */
    addWarningQuick('text', /--[^- ~\n]|[^- ~\n]--/, 'DASH_SURROUND_WITH_SPACES');

    /* STAGE: check for correct floor function notation */
    addWarningQuick('math', /\[[^[\],;]+]/, 'FLOOR_FUNCTION_NOTATION');

    /* STAGE: check for incorrect multiplication sign */
    addWarningQuick('any', /[^{^_]\*[^}]/, 'MULTIPLICATION_SIGN');

    /* STAGE: check for spaces around commas and periods */
    addWarningQuick('text', /\s+[?!.,;:]/, 'SPACE_BEFORE_PUNCTUATION_MARK');

    /* STAGE: check for spaces before parentheses */
    addWarningQuick('text', /[^()[\]{}\n\t-\\/+]\(/, 'SPACE_BEFORE_PARENTHESIS');

    /* STAGE: check if there are symbols that do not meet the Russian typographic tradition */
    addWarningQuick('math', /\\(epsilon|phi|emptyset)/, 'RUSSIAN_TYPOGRAPHY_PECULIARITIES');

    /* STAGE: check if there are invisible braces */
    addWarningQuick('math', /(^|=|\\cup|\\cap|\||\\lvert)\s*{/, 'INVISIBLE_BRACES');

    /* STAGE: check if low-level \over and \choose commands are used */
    addWarningQuick('math', /\\over[^a-zA-Z]/, 'OVER_VS_FRAC');
    addWarningQuick('math', /\\choose[^a-zA-Z]/, 'CHOOSE_VS_BINOM');

    /* STAGE: check if standard sets are typed correctly */
    addWarningQuick('math', /\\in\s*{?\s*[NRZQC]([^A-Za-z]|$)/, 'SETS_IN_BBFONT');

    /* STAGE: check if all lists are made using appropriate commands */
    addWarningQuick('text', /^\s*(\\par\s*)?\(?(\d+|[a-cA-C])[).]/m, 'MANUAL_LISTS');

    /* STAGE: check that \bmod command is used instead of plain mod */
    addWarningQuick('math', /[^\\pb]mod\W/, 'MOD_NOT_A_COMMAND');

    /* STAGE: check if tilde is not surrounded with spaces */
    addWarningQuick('text', /\s+~|~\s+/, 'TILDE_INEFFECTIVE_AS_NBSP');

    /* STAGE: check if spaces are used for indentation */
    addWarningQuick('any', /(~|\\:|\\ |\\,|\\!|\\>|\\space|\{ }){2,}/, 'INDENTATION_WITH_SPACES');

    /* STAGE: check that \le is used instead of <= */
    addWarningQuick('math', /<=|>=/, 'LE_AS_SINGLE_COMMAND');

    /* STAGE: recommend explicit \cdot for readability */
    addWarningQuick('math', /\d\s*\\(frac|binom|sum|prod)/, 'CDOT_FOR_READABILITY');

    /* STAGE: check sin, cos, lim, min etc. are prepended by backslash */
    addWarningQuick(
        'math',
        /([^\\]|^)(cos|csc|exp|ker|limsup|max|min|sinh|arcsin|cosh|deg|gcd|lg|ln|Pr|sup|arctan|cot|det|hom|lim|log|sec|tan|arg|coth|dim|liminf|sin|tanh)[^a-z]/,
        'BACKSLASH_NEEDED',
    );

    /* STAGE: check if math mode is necessary */
    addWarningQuick('math', /^\s*[^0-9a-zA-Z]+\s*$/, 'UNNECESSARY_MATH_MODE');

    /* STAGE: check if math symbol be better replaced with plain text */
    addWarningQuick('math', /^\s*([><=]|\\(le|ge|sim|lesssim)(\W|\d|$))/, 'BETTER_TO_USE_WORDS_THEN_MATH');

    /* STAGE: check if text-mode modifiers are used in math mode */
    addWarningQuick('math', /\\textit|\\textbf|\\emph/, 'TEXT_COMMANDS_IN_MATH_MODE');

    /* STAGE: advise to consider replacing small numbers with text */
    addWarningQuick('text', /\s+\d\s+/, 'NUMERALS_AS_WORDS');
    addWarningQuick('math', /^\d$/, 'NUMERALS_AS_WORDS');

    /* Check if \limits command is used in display math */
    addWarningQuick('math', /\\limits/, 'LIMITS_UNNECESSARY_IN_DISPLAY_MODE', 'display');

    /* Check if \vdots command is used for divisibility */
    addWarningQuick('math', /\\vdots\s*[^&\\]/, 'USE_DIVIDES_INSTEAD_OF_VDOTS');

    /* Check if reference is immediately after or before math */
    addWarningQuick('text', /(\\(eq)?ref{[^}]+}\s*$)|(^\s*\\(eq)?ref{[^}]+})/, 'FORMULA_NEIGHBOURING_REFERENCE');

    /* Suggest making a long formula display */
    addWarningQuick('math', /.{110,}/, 'MAKE_LONG_FORMULA_DISPLAY', 'inline');

    /* Space after parenthesis */
    addWarningQuick('text', /\( /, 'SPACE_AFTER_PARENTHESIS');

    return results;
}
