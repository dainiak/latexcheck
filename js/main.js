let inBrowser = typeof window !== "undefined";
function initialize() {
    let editor;

    function hlAceLine(n) {
        editor.gotoLine(n, 0);
        editor.focus();
    }

    if (inBrowser) { window.hlAceLine = hlAceLine; }

    function checkLatexCode(latexString, addWarningCustom) {
        if (addWarningCustom !== undefined && typeof addWarningCustom !== 'function') {
            throw new Error('addWarningCustom must be a function');
        }
        let capCyrLetters = 'АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ';
        let smallCyrLetters = 'абвгдеёжзиклмнопрстуфхцчшщьыъэюя';
        function isCyrLetter(letter){ return capCyrLetters.includes(letter) || smallCyrLetters.includes(letter) }
        function isWordSymbol(letter){ return /\w/.test(letter) || isCyrLetter(letter) }

        console.assert(!!window.i18n);
        let errors = this.errors = window.i18n.errorDescriptions;
        let strings = window.i18n.strings;
        let rda = document.querySelector('#result_display_area');

        let usedErrorCodes = {};
        if (!addWarningCustom) {
            rda.innerHTML = '';
        }

        function extractSnippet(fragment, position, radius) {
            if(position === null || position === undefined){
                return fragment;
            }
            radius = radius ? radius : 5;
            let left = Math.max(0, position-radius);
            let right = Math.min(fragment.length-1, position+radius);
            if (isWordSymbol(fragment.substr(left, 1))) {
                while (left > 0 && isWordSymbol(fragment.substr(left-1, 1))) {
                    --left;
                }
            }
            else {
                while (left > 0 && !isWordSymbol(fragment.substr(left-1, 1))) {
                    --left;
                }
            }
            if (isWordSymbol(fragment.substr(right, 1))) {
                while (right < fragment.length - 1 && isWordSymbol(fragment.substr(right+1, 1))) {
                    ++right;
                }
            }
            else {
                while (right < fragment.length - 1 && !isWordSymbol(fragment.substr(right+1, 1))) {
                    ++right;
                }
            }
            return fragment.substring(left, right+1);
        }

        function findLine(fragmentType, fragmentIndex, positionInFragment) {
            if(fragmentIndex === undefined){
                return latexString.substring(0, fragmentType).split('\n').length;
            }

            let numLinesSkipped = 0;
            for (let i = 0; i < fragmentIndex; ++i){
                numLinesSkipped += mathFragments[i].split('\n').length - 1;
                numLinesSkipped += textFragments[i].split('\n').length - 1;
            }
            if(fragmentType === 'math'){
                numLinesSkipped += textFragments[fragmentIndex].split('\n').length - 1;
                numLinesSkipped += mathFragments[fragmentIndex].substring(0,positionInFragment).split('\n').length - 1;
            }
            else{
                numLinesSkipped += textFragments[fragmentIndex].substring(0,positionInFragment).split('\n').length - 1;
            }
            return numLinesSkipped + 1;
        }

        function addWarning(errorCode, extraInfo, codeFragment, lineNumber){
            if(!errors[errorCode] || !errors[errorCode].msg) {
                return;
            }

            if (codeFragment){
                codeFragment = '<br><span class="badge bg-light bg-gradient text-dark"'
                    + (lineNumber ? ' onclick="hlAceLine(' + lineNumber + ')"': '')
                    +'>Подозрительный фрагмент: <code>…' + codeFragment + '…</code>'
                    + (lineNumber ? ' (строка ' + lineNumber + ' в редакторе)' : '')
                    + '</span>';
            }

            if(!usedErrorCodes[errorCode]) {
                let severity = errors[errorCode].severity.toString();
                rda.innerHTML +=
                    '<div class="p-2 border severity' + severity + '" id="' + errorCode + '" data-severity="' + severity +'">'
                    + (extraInfo ? extraInfo : errors[errorCode].msg)
                    + '</div>';
                usedErrorCodes[errorCode] = document.querySelector('#' + errorCode);
            }
            let errorMessage = usedErrorCodes[errorCode];

            if (codeFragment) {
                errorMessage.innerHTML += codeFragment;
            }
        }

        if (addWarningCustom !== undefined) {
            addWarning = addWarningCustom;
        }

        function addTypicalWarning(errorCode, fragmentType, fragmentIndex, positionInFragment){
            return addWarning(
                errorCode,
                null,
                extractSnippet(
                    (fragmentType === 'math' ? mathFragments : textFragments)[fragmentIndex],
                    positionInFragment
                ),
                findLine(
                    fragmentType,
                    fragmentIndex,
                    positionInFragment
                )
            );
        }

        function addWarningQuick(fragmentType, badness, errorCode, mathFragmentType) {
            if(fragmentType === 'math' || fragmentType === 'any') {
                for (let i = 0; i < mathFragments.length; ++i) {
                    if( mathFragmentType && mathFragmentType !== mathFragmentTypes[i] ) {
                        continue;
                    }
                    let badPos = mathFragments[i].search(badness);
                    if (badPos >= 0){
                        addTypicalWarning(errorCode, 'math', i, badPos);
                    }
                }
            }

            if(fragmentType === 'text' || fragmentType === 'any') {
                for (let i = 0; i < textFragments.length; ++i) {
                    let badPos = textFragments[i].search(badness);
                    if (badPos >= 0){
                        addTypicalWarning(errorCode, 'text', i, badPos);
                    }
                }
            }
        }


        /* STAGE: Check math delimiters */
        let badPos = latexString.search(/\${2}/);
        if (badPos >= 0){
            addWarning('DOUBLE_DOLLARS', null, '$$', latexString.substring(0,badPos).split('\n').length-1);
        }

        let i = 0;
        let currentlyInMathMode = false;
        let lastSeenBrace = '';
        while (i < latexString.length){
            let nextTwoSymbols = latexString.substr(i,2);
            let nextSymbol = latexString.substr(i,1);
            if (nextTwoSymbols === '$$'){
                if (currentlyInMathMode){
                    if (lastSeenBrace !== '$$'){
                        addWarning(
                            'MISMATCHED_MATH_DELIMITERS',
                            strings.mmDoubleOpen.replace('{1}', nextTwoSymbols).replace('{2}', lastSeenBrace)
                        );
                        break;
                    }
                    currentlyInMathMode = false;
                    lastSeenBrace = '';
                }
                else {
                    currentlyInMathMode = true;
                    lastSeenBrace ='$$';
                }
                i += 2;
            }
            else if (['\\[', '\\('].includes(nextTwoSymbols)){
                if (currentlyInMathMode){
                    addWarning(
                        'MISMATCHED_MATH_DELIMITERS',
                        strings.mmDoubleOpen.replace('{1}', nextTwoSymbols).replace('{2}', lastSeenBrace)
                    );
                    break;
                }
                lastSeenBrace = nextTwoSymbols;
                currentlyInMathMode = true;
                i += 2;
            }
            else if (['\\]', '\\)'].includes(nextTwoSymbols)){
                if (!currentlyInMathMode){
                    addWarning(
                        'MISMATCHED_MATH_DELIMITERS',
                        strings.mmWrongClose.replace('{1}', nextTwoSymbols)
                    );
                    break;
                }
                if (nextTwoSymbols === '\\]' && lastSeenBrace !== '\\[' || nextTwoSymbols === '\\)' && lastSeenBrace !== '\\(' ) {
                    addWarning(
                        'MISMATCHED_MATH_DELIMITERS',
                        strings.mmDoubleOpen.replace('{1}', nextTwoSymbols).replace('{2}', lastSeenBrace)
                    );
                    break;
                }
                lastSeenBrace = '';
                currentlyInMathMode = false;
                i += 2;
            }
            else if (nextTwoSymbols === '\\') {
                i += 2;
            }
            else if (nextSymbol === '$'){
                if(currentlyInMathMode && lastSeenBrace !== '$') {
                    addWarning(
                        'MISMATCHED_MATH_DELIMITERS',
                        strings.mmDoubleOpen.replace('{1}', '$').replace('{2}', lastSeenBrace)
                    );
                    break;
                }
                if(!currentlyInMathMode){
                    currentlyInMathMode = true;
                    lastSeenBrace = '$';
                }
                else {
                    currentlyInMathMode = false;
                    lastSeenBrace = '';
                }
                i += 1;
            }
            else{
                i += 1;
            }
        }

        /* STAGE: check for unnecessary paragraph break before display math formula */
        badPos = latexString.search(/\s*\n+\s*\n+\s*(\\\[|\\begin{(equation|multline|align|gather|flalign)\*?})/);
        if ( badPos >= 0) {
            addWarning('PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA', null, extractSnippet(latexString, badPos, 10), findLine(badPos));
        }

        /* STAGE: check if math formulae are not split without necessity */
        badPos = latexString.search(/(\$|\\\))\s*[-+/,=]?\s*(\$|\\\()/);
        if ( badPos >= 0) {
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

        badPos = latexString.search(/\\](\s|[^абвгдеёжзиклмнопрстуфхцчшщьыъэюя])*\\\[/i);
        if (badPos >= 0) {
            addWarning('CONSECUTIVE_DISPLAY_FORMULAE', null, extractSnippet(latexString, badPos), findLine(badPos+3));
        }

        /* STAGE: eqnarray environment used */
        badPos = latexString.search(/eqnarray/);
        if (badPos >= 0) {
            addWarning('EQNARRAY_USED', null, extractSnippet(latexString, badPos), findLine(badPos+3));
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
        badPos = latexString.search(/(\\\)|\$)?\s*-{1,3}\s*(ый|ого|о|тому|ому|ему|ом|ая|ой|ую|ые|ыми|и|ым|тым|той|им|его|того|тых|ых|том|ем|ём|ех|ёх|ух)([^абвгдеёжзиклмнопрстуфхцчшщьыъэюя]|$)/i);
        if (badPos >= 0) {
            addWarning('RU_ORDINAL_ABBREVIATION', null, extractSnippet(latexString, badPos), findLine(badPos));
        }

        badPos = latexString.search(/(([2-9]|11)\\?[a-z]*[-]*{?st)|((11|12|13)\\?[a-z]*[-]*{?(st|nd|rd))/i);
        if (badPos >= 0) {
            addWarning('EN_ORDINAL_ABBREVIATION', null, extractSnippet(latexString, badPos), findLine(badPos));
        }
        addWarningQuick('math', /\^{(th|st|nd|rd)}/, 'EN_ORDINAL_ABBREVIATION_IN_MATH');


        /* STAGE: check if letters are defined before they are used */
        badPos = latexString.search(/,(\\]|\$)?\s+где([^абвгдеёжзиклмнопрстуфхцчшщьыъэюя]|$)/i);
        if (badPos >= 0) {
            addWarning('LATE_DEFINITION', null, extractSnippet(latexString, badPos), findLine(badPos));
        }

        /* STAGE: check if letters are defined before they are used */
        badPos = latexString.search(/\\begin{math}/);
        if (badPos >= 0) {
            addWarning('MATH_ENVIRONMENT_VERBOSITY_WARNING', null, extractSnippet(latexString, badPos+7), findLine(badPos));
        }

        /* STAGE: split into text and math blocks */
        let fragments = latexString.split(/(\$\$|\\\[|\\]|\\\(|\\\)|\$|\\(?:begin|end){(?:equation|align|gather|eqnarray|multline|flalign|alignat|math)\*?})/);
        let textFragments = [];
        let mathFragments = [];
        let mathFragmentTypes = [];
        for (let i = 0; i < fragments.length; ++i){
            if (i % 4 === 0){
                textFragments.push(fragments[i]);
            }
            else if (i % 4 === 2) {
                mathFragments.push(fragments[i]);
                mathFragmentTypes.push(fragments[i-1] === '\\(' || fragments[i-1] === '$' || fragments[i-1] === '\\begin{math}' ? 'inline' : 'display' );
            }
        }


        /* STAGE: check for neighbouring formulas */
        for (let i = 1; i < textFragments.length-1; ++i) {
            if (textFragments[i].match(/^\s*$/)) {
                addWarning(
                    'UNNECESSARY_FORMULA_BREAK',
                    'Формулы <code>' + mathFragments[i-1] + '</code> и <code>' + mathFragments[i] + '</code> не разделены текстом. '
                    + 'Возможно, следует объединить эти две формулы в одну, либо вставить вводное слово перед второй формулой. ', textFragments[i], findLine('text',i,0));
            }
        }


        for (let i = 0; i < textFragments.length; ++i) {
            let badPos = textFragments[i].search(/[?!.,;:]$/);
            if (badPos >= 0 && i < mathFragmentTypes.length && mathFragmentTypes[i] === 'inline'){
                addTypicalWarning('SPACE_AFTER_PUNCTUATION_MARK', 'text', i, badPos);
            }
        }

        addWarningQuick('text', /\\[a-zA-Z]+[АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯабвгдеёжзиклмнопрстуфхцчшщьыъэюя]/, 'NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC');

        addWarningQuick('text', /[?!.,;:][АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯабвгдеёжзиклмнопрстуфхцчшщьыъэюя]/, 'SPACE_AFTER_PUNCTUATION_MARK');

        /* STAGE: check for capitals after punctuation */
        addWarningQuick('text', /[,;:]\s*[АБВГДЕЁЖЗИКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯ]/, 'CAPITALIZATION_AFTER_PUNCTUATION_MARK');


        /* STAGE: check for capital letter after period */
        addWarningQuick('text', /\.\s*[абвгдеёжзиклмнопрстуфхцчшщьыъэюя]/, 'CAPITALIZATION_AFTER_PERIOD');


        /* STAGE: check for period before new sentence */
        for (let i = 0; i < textFragments.length; ++i) {
            if (i > 0 && capCyrLetters.includes(textFragments[i].trim().substr(0,1)) && !mathFragments[i-1].trim().match(/\.(\s*}*)*$/)){
                addWarning('PERIOD_BEFORE_NEXT_SENTENCE', null, extractSnippet(mathFragments[i-1] + textFragments[i], mathFragments[i-1].length));
            }
        }

        /* STAGE: check for \left-\right commands */
        for (let i = 0; i < mathFragments.length; ++i) {
            if(mathFragmentTypes[i] !== 'display' && !mathFragments[i].match(/\\displaystyle/)){
                continue;
            }

            let modifiedMathFragment = mathFragments[i];
            for (let j = 0, k = 0; j < modifiedMathFragment.length; ++j){
                if (modifiedMathFragment.substr(j,1) === '|'){
                    ++k;
                    modifiedMathFragment = modifiedMathFragment.substr(0,j) + (k % 2 ? '¹' : '²') + modifiedMathFragment.substr(j+1,modifiedMathFragment.length)
                }
            }
            let largeFormula = '(\\\\(frac|binom|over|underline|sum|prod|choose)|((\\)|\\\\}|])[_^]))';
            let delimiters = [
                '¹[^|]*?  [^|]*?²',
                '[(][^)]*  [^)]*[)]',
                '\\\\[{].*?  .*?\\\\[}]',
                '\\\\lfloor.*?  .*?\\\\rfloor',
                '\\\\lceil.*?  .*?\\\\rceil',
                '\\\\lvert.*?  .*?\\\\rvert'];

            for (let j = 0; j < delimiters.length; ++j) {
                let ldelim, rdelim;
                ldelim = delimiters[j].split('  ')[0];
                rdelim = delimiters[j].split('  ')[1];

                let re = new RegExp(ldelim + largeFormula + rdelim);
                let badMatch = modifiedMathFragment.match(re);
                if (badMatch && badMatch[0].search(/\\(right|bigr|biggr)/) < 0 ){
                    addWarning('LEFT_RIGHT_RECOMMENDED', null, badMatch[0].replace(/[¹²]/g,'|'), findLine('math', i, 0));
                    break;
                }
            }
        }

        /* STAGE: bar used instead of \mid in set comprehension */
        for (let i = 0; i < mathFragments.length; ++i) {
            let badMatch = mathFragments[i].match(/\\{.*?\|.*?\\}/);
            if (badMatch && !badMatch[0].includes('\\mid')){
                addWarning('MID_IN_SET_COMPREHENSION', null, badMatch[0]);
            }
        }

        /* STAGE: \mid used instead of bar */
        for (let i = 0; i < mathFragments.length; ++i) {
            let badMatch = mathFragments[i].match(/\\mid.*?\\mid/);
            if (badMatch && !badMatch[0].includes('\\}')){
                addWarning('MID_IN_SET_COMPREHENSION', null, badMatch[0]);
            }
        }

        /* STAGE: problems with symbolic links */
        for (let i = 0; i < textFragments.length; ++i) {
            let badPos = textFragments[i].search(/(рис(унок|унка|унке|\.)|формул(а|е|ой|у|ы)|(равенств|тождеств)(о|а|е|у|ами|ах)|(соотношени|выражени)(е|ю|и|я|ями|ях|ям))\s+\(?\d\)?/i);
            if (badPos < 0) {
                badPos = textFragments[i].search(/(\s|~)\(\d\)(\.|,?\s+[абвгдеёжзиклмнопрстуфхцчшщьыъэюя]*\W)/);
            }
            if(badPos >= 0) {
                addTypicalWarning('SYMBOLIC_LINKS', 'text', i, badPos);
            }
        }

        addWarningQuick('math', /^\s*(\(\d+|\*)\)\s*$/, 'SYMBOLIC_LINKS');

        addWarningQuick('text', /\(\\ref{[^}]*}\)/, 'EQREF_INSTEAD_OF_REF');

        addWarningQuick('text', /\S\s+\\(eqref|ref){[^}]*}/, 'NONBREAKABLE_SPACE_BEFORE_REF');


        /* STAGE: Trivially named symbolic link */
        addWarningQuick('math', /\\label{\s*(eq|equation|eqn|th|thm|lemma|theorem|lem|fig|figure)?:?[^a-z}]}/i, 'TRIVIAL_LABEL');
        addWarningQuick('text', /\\label{\s*(eq|equation|eqn|th|thm|lemma|theorem|lem|fig|figure)?:?[^a-z}]}/i, 'TRIVIAL_LABEL');

        /* STAGE: Ellipsis */
        addWarningQuick('math', /\.{3}/, 'ELLIPSIS_LDOTS');

        /* STAGE: Text in math mode */
        for (let i = 0; i < mathFragments.length; ++i) {
            let badPos = mathFragments[i].search(new RegExp('[' + smallCyrLetters + capCyrLetters + ']'));
            if (badPos < 0){
                badPos = mathFragments[i].search(/([^a-z\\]|^)[a-z]{4,}/i);
            }
            if (badPos >= 0 && mathFragments[i].search(/\\(text|mbox|hbox)/) < 0 && mathFragments[i].substr(0, badPos).search(/\\label/) < 0) {
                addTypicalWarning('TEXT_IN_MATH_MODE', 'math', i, badPos);
            }
        }

        /* STAGE: checking if there is a decent conclusion*/
        let lastTextFragment = textFragments[textFragments.length-1].trim();
        if ((lastTextFragment.length === 0 || lastTextFragment.match(/\\end{(figure|enumerate|itemize|tabular)}\s*\\end{solution}$/)) && textFragments[textFragments.length-2].search(/Ответ/i) < 0){
            addWarning('NO_CONCLUSION');
        }


        /* STAGE: check if there are sentences starting with formula */
        for (let i = 0; i < mathFragments.length; ++i) {
            if (textFragments[i].trim().endsWith('.')) {
                addTypicalWarning('SENTENCE_STARTS_WITH_FORMULA', 'math', i, badPos);
            }
        }


        /* STAGE: check if there's no punctuation marks right after display math */
        for (let i = 0; i < textFragments.length; ++i) {
            let badPos = textFragments[i].search(/^\s*[,.!?:;]/);
            if (badPos >= 0 && i > 0 && mathFragmentTypes[i-1] === 'display') {
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

        /* STAGE: check latin letters outside math mode */
        addWarningQuick('text', /([^\\]\\(\\|newline)[^\\])/, 'SUGGESTED_NEW_PARAGRAPH');

        /* STAGE: check latin letters outside math mode */
        addWarningQuick('text', /(^|[,. ~])[a-zA-Z]($|[,.:!? ~-])/, 'LATIN_LETTER_OUTSIDE_MATH_RU');
        addWarningQuick('text', /(^|[,. ~])[b-zA-HJ-Z]($|[,.:!? ~-])/, 'LATIN_LETTER_OUTSIDE_MATH_EN');

        /* STAGE: check typical math commands outside math mode */
        addWarningQuick('text', /(\\(infty|cdot|sum))|([0-9 \n]+ *[=+*^])|([+*^] *[0-9 \n]+)/, 'MATH_SEMANTICS_OUTSIDE_MATH');

        /* STAGE: check if latin letter c accidentially used instead of cyrillic letter с and vice versa*/
        addWarningQuick('text', /[абвгдеёжзиклмнопрстуфхцчшщьыъэюя ]\s+c\s+[абвгдеёжзиклмнопрстуфхцчшщьыъэюя ]/i, 'LATIN_LETTER_C_MISUSED');
        addWarningQuick('math', /(^|[^ абвгдеёжзиклмнопрстуфхцчшщьыъэюя])[аесх]($|[^ абвгдеёжзиклмнопрстуфхцчшщьыъэюя])/i, 'CYRILLIC_LETTER_C_MISUSED');

        addWarningQuick('math', /-$/, 'DASH_IN_MATH_MODE');

        /* STAGE: check if hyphen is used where dash should be */
        addWarningQuick('text', ' - ', 'DASH_HYPHEN');

        /* STAGE: check if standard colloquial abbreviations have space in them */
        addWarningQuick('text', /ч\. ?т\.|т\. ?н\.|т\. ?ч\.|т\. ?к\./, 'ABBREVIATIONS_WITH_SPACE');

        /* STAGE: check if dash is surrounded with spaces */
        addWarningQuick('text', /--[^- ~\n]|[^- ~\n]--/, 'DASH_SURROUND_WITH_SPACES');


        /* STAGE: check for correct floor function notation */
        addWarningQuick('math', /\[[^\[\],;]+]/, 'FLOOR_FUNCTION_NOTATION');


        /* STAGE: check for incorrect multiplication sign */
        addWarningQuick('any', /[^{^_]\*[^}]/, 'MULTIPLICATION_SIGN');


        /* STAGE: check for spaces around commas and periods */
        addWarningQuick('text', /\s+[?!.,;:]/, 'SPACE_BEFORE_PUNCTUATION_MARK');


        /* STAGE: check for spaces before parentheses */
        addWarningQuick('text', /[^()\[\]{}\n\t-\\/+]\(/, 'SPACE_BEFORE_PARENTHESES');


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
        addWarningQuick('text', /^\s*(\\par\s+)?\d+[).]/m, 'MANUAL_LISTS');


        /* STAGE: check that \bmod command is used instead of plain mod */
        addWarningQuick('math', /[^\\pb]mod\W/, 'MOD_NOT_A_COMMAND');


        /* STAGE: check if tilde is not surrounded with spaces */
        addWarningQuick('text', /\s+~|~\s+/, 'TILDE_INEFFECTIVE_AS_NBSP');

        /* STAGE: check if spaces are used for indentation */
        addWarningQuick('any', /(~|\\:|\\ |\\,|\\!|\\>|\\space|{ }){2,}/, 'INDENTATION_WITH_SPACES');


        /* STAGE: check that \le is used instead of <= */
        addWarningQuick('math', /<=|>=/, 'LE_AS_SINGLE_COMMAND');


        /* STAGE: recommend explicit \cdot for readability */
        addWarningQuick('math', /\d\s*\\(frac|binom|sum|prod)/, 'CDOT_FOR_READABILITY');


        /* STAGE: check sin, cos, lim, min etc. are prepended by backslash */
        addWarningQuick('math', /([^\\]|^)(cos|csc|exp|ker|limsup|max|min|sinh|arcsin|cosh|deg|gcd|lg|ln|Pr|sup|arctan|cot|det|hom|lim|log|sec|tan|arg|coth|dim|liminf|sin|tanh)[^a-z]/, 'BACKSLASH_NEEDED');


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
        addWarningQuick('math', /\\limits/, 'LIMITS_UNNECESSARY_IN_DISPLAY_MODE', 'display')


        /* Check if \vdots command is used for divisibility */
        addWarningQuick('math', /\\vdots\s*[^&\\]/, 'USE_DIVIDES_INSTEAD_OF_VDOTS');


        /* Check if reference is immediately after or before math */
        addWarningQuick('text', /(\\(eq)?ref{[^}]+}\s*$)|(^\s*\\(eq)?ref{[^}]+})/, 'FORMULA_NEIGHBOURING_REFERENCE');


        /* Suggest making a long formula display */
        addWarningQuick('math', /.{110,}/, 'MAKE_LONG_FORMULA_DISPLAY', 'inline');


        /* Space after parenthesis */
        addWarningQuick('text', /\( /, 'SPACE_AFTER_PARENTHESIS');


        if (addWarningCustom === undefined && rda.innerHTML === '') {
            rda.innerHTML = strings.noErrors;
        }
    }

    function checkLatexCodeExport(latexString) {
        let usedErrorCodes = {};
        function addWarning(errorCode, extraInfo, codeFragment, lineNumber) {
            if (!usedErrorCodes[errorCode]) {
                usedErrorCodes[errorCode] = {
                    severity: this.errors[errorCode].severity,
                    extraInfo: (extraInfo ? extraInfo : this.errors[errorCode].msg),
                    codeFragments: []
                };
            }
            usedErrorCodes[errorCode].codeFragments.push({code: codeFragment, line: lineNumber});
        }
        checkLatexCode(latexString, addWarning);
        return usedErrorCodes;
    }

    if (!inBrowser) {
        exports.checkLatexCode = checkLatexCodeExport;
        return;
    }

    editor = ace.edit(document.querySelector('#user_input_area'));
    editor.$blockScrolling = Infinity; // To disable annoying ACE warning
    editor.setOptions({
        theme: 'ace/theme/chrome',
        mode: 'ace/mode/latex',
        minLines: 3,
        maxLines: Infinity,
        wrap: true,
        showGutter: true,
        fadeFoldWidgets: false,
        showPrintMargin: false
    });
    editor.commands.removeCommands(["gotoline", "find"]);
    editor.resize();
    editor.focus();
    editor.gotoLine(1);
    let rda = document.querySelector('#result_display_area');

    document.querySelector('#btn_check').addEventListener('click', function(){
        rda.classList.add('flex');
        checkLatexCode(editor.getValue());
        MathJax.typeset([rda]);
    });

    function typesetWithProcessing(){
        let v = editor.getValue();
        v = v
            .replace(/\\begin{task}/g,'((beginTask))')
            .replace(/\\begin{solution}/g,'((beginSolution))')
            .replace(/\\end{(task|solution)}/g,'');

        v = v
            .replace(/---/g, '—')
            .replace(/--/g, '–')
            .replace(/<</g, '«')
            .replace(/>>/g, '»')
            .replace(/``/g,'“')
            .replace(/''/g, '”')
            .replace(/\n\n/g, '\\par');

        rda.innerHTML = v;
        MathJax.typesetPromise([rda]).then(() => {
            let v = rda.innerHTML;
            v = v
                .replace(/\\par/g, '<br>')
                .replace('((beginTask))', '<span class="badge">' + window.i18n.strings.task + '</span>')
                .replace('((beginSolution))', '<span class="badge">' + window.i18n.strings.solution + '</span>');
            rda.innerHTML = v;
        });
    }

    document.querySelector('#btn_try_typeset').addEventListener('click', function(){
        rda.classList.remove('flex');
        typesetWithProcessing();
    });
}

if (inBrowser) {
    document.addEventListener('readystatechange', initialize);
} else {
    initiate();
}
