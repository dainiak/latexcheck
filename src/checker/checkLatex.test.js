import { describe, expect, it } from 'vitest';
import en from '../i18n/en.js';
import ru from '../i18n/ru.js';
import { checkLatex } from './checkLatex.js';

function createChecker(lang = 'en') {
    const i18n = lang === 'en' ? en : ru;
    return function check(latexString) {
        const results = checkLatex(latexString, i18n.errorDescriptions, i18n.strings);
        const errors = results.map((r) => r.code);
        return {
            errors,
            results,
            hasError(code) {
                return errors.includes(code);
            },
            hasNoErrors() {
                return errors.length === 0;
            },
            errorCount() {
                return errors.length;
            },
            getSeverity(code) {
                const r = results.find((x) => x.code === code);
                return r ? r.severity : null;
            },
        };
    };
}

const checkEN = createChecker('en');
const checkRU = createChecker('ru');

function expectError(result, code) {
    expect(result.hasError(code), `Expected error ${code} but got: [${result.errors.join(', ')}]`).toBe(true);
}

function expectNoError(result, code) {
    expect(
        result.hasError(code),
        `Did not expect error ${code} but it was found among: [${result.errors.join(', ')}]`,
    ).toBe(false);
}

// ============================================================
// MATH DELIMITERS
// ============================================================
describe('DOUBLE_DOLLARS', () => {
    it('detects $$ usage', () => {
        expectError(checkEN('$$x^2$$'), 'DOUBLE_DOLLARS');
    });

    it('does not flag \\[...\\]', () => {
        expectNoError(checkEN('\\[x^2\\]'), 'DOUBLE_DOLLARS');
    });

    it('does not flag single $', () => {
        expectNoError(checkEN('$x^2$'), 'DOUBLE_DOLLARS');
    });
});

describe('MISMATCHED_MATH_DELIMITERS', () => {
    it('detects $ opened then \\) closed', () => {
        expectError(checkEN('$x\\)'), 'MISMATCHED_MATH_DELIMITERS');
    });

    it('detects \\( opened then $ closed', () => {
        expectError(checkEN('\\(x$'), 'MISMATCHED_MATH_DELIMITERS');
    });

    it('detects \\[ opened then \\) closed', () => {
        expectError(checkEN('\\[x\\)'), 'MISMATCHED_MATH_DELIMITERS');
    });

    it('detects closing \\] without opening', () => {
        expectError(checkEN('text \\]'), 'MISMATCHED_MATH_DELIMITERS');
    });

    it('detects closing \\) without opening', () => {
        expectError(checkEN('text \\)'), 'MISMATCHED_MATH_DELIMITERS');
    });

    it('detects double opening \\[ then \\(', () => {
        expectError(checkEN('\\[x \\(y\\)\\]'), 'MISMATCHED_MATH_DELIMITERS');
    });

    it('does not flag properly paired $...$', () => {
        expectNoError(checkEN('$x$ and $y$.'), 'MISMATCHED_MATH_DELIMITERS');
    });

    it('does not flag properly paired \\(...\\)', () => {
        expectNoError(checkEN('\\(x\\) and \\(y\\).'), 'MISMATCHED_MATH_DELIMITERS');
    });

    it('does not flag properly paired \\[...\\]', () => {
        expectNoError(checkEN('\\[x^2\\]'), 'MISMATCHED_MATH_DELIMITERS');
    });
});

// ============================================================
// FORMULA STRUCTURE
// ============================================================
describe('PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA', () => {
    it('detects empty line before \\[', () => {
        expectError(checkEN('Text here.\n\n\\[x^2\\]'), 'PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA');
    });

    it('detects empty line before \\begin{equation}', () => {
        expectError(
            checkEN('Text here.\n\n\\begin{equation}x\\end{equation}'),
            'PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA',
        );
    });

    it('does not flag when no empty line before display math', () => {
        expectNoError(checkEN('Text here.\n\\[x^2\\]'), 'PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA');
    });
});

describe('UNNECESSARY_FORMULA_BREAK', () => {
    it('detects $x$ $y$ pattern', () => {
        expectError(checkEN('Consider $x$ $y$ in the set.'), 'UNNECESSARY_FORMULA_BREAK');
    });

    it('detects $x$ + $y$ pattern', () => {
        expectError(checkEN('We have $a$ + $b$ here.'), 'UNNECESSARY_FORMULA_BREAK');
    });

    it('detects \\) \\( pattern', () => {
        expectError(checkEN('We have \\(a\\) \\(b\\) here.'), 'UNNECESSARY_FORMULA_BREAK');
    });

    it('does not flag formulas separated by text', () => {
        expectNoError(checkEN('Let $x$ be positive and $y$ be negative.'), 'UNNECESSARY_FORMULA_BREAK');
    });
});

describe('CONSECUTIVE_DISPLAY_FORMULAE', () => {
    it('detects two consecutive \\[...\\] blocks', () => {
        expectError(checkEN('\\[x=1\\] \\[y=2\\]'), 'CONSECUTIVE_DISPLAY_FORMULAE');
    });

    it('does not flag display formulas separated by Cyrillic text', () => {
        expectNoError(checkEN('\\[x=1\\]\nОтсюда получаем\n\\[y=2\\]'), 'CONSECUTIVE_DISPLAY_FORMULAE');
    });

    it('does not flag display formulas separated by Latin text', () => {
        expectNoError(checkEN('\\[x=1\\]\nThus we get\n\\[y=2\\]'), 'CONSECUTIVE_DISPLAY_FORMULAE');
    });
});

describe('PARAGRAPH_STARTS_WITH_FORMULA', () => {
    it('detects paragraph starting with inline math', () => {
        expectError(checkEN('Text here.\n\n$x$ is a number.'), 'PARAGRAPH_STARTS_WITH_FORMULA');
    });

    it('detects paragraph starting with \\(', () => {
        expectError(checkEN('Text here.\n\n\\(x\\) is a number.'), 'PARAGRAPH_STARTS_WITH_FORMULA');
    });

    it('does not flag inline math in middle of paragraph', () => {
        expectNoError(checkEN('Consider $x$ as a number.'), 'PARAGRAPH_STARTS_WITH_FORMULA');
    });
});

describe('SENTENCE_STARTS_WITH_FORMULA', () => {
    it('detects sentence starting with formula after period', () => {
        expectError(checkEN('We proved that. $x$ is good.'), 'SENTENCE_STARTS_WITH_FORMULA');
    });

    it('does not flag formula in middle of sentence', () => {
        expectNoError(checkEN('We know that $x$ is good.'), 'SENTENCE_STARTS_WITH_FORMULA');
    });
});

describe('SENTENCE_STARTS_WITH_NUMBER', () => {
    it('detects sentence starting with a number', () => {
        expectError(checkEN('We know this. 5 elements remain.'), 'SENTENCE_STARTS_WITH_NUMBER');
    });

    it('does not flag numbers in mid-sentence', () => {
        expectNoError(checkEN('There are 5 elements in the set.'), 'SENTENCE_STARTS_WITH_NUMBER');
    });
});

describe('PUNCTUATION_AFTER_DISPLAY_MATH', () => {
    it('detects comma after display math', () => {
        expectError(checkEN('Text\n\\[x^2\\]\n, and more.'), 'PUNCTUATION_AFTER_DISPLAY_MATH');
    });

    it('detects period after display math', () => {
        expectError(checkEN('Text\n\\[x^2\\]\n.'), 'PUNCTUATION_AFTER_DISPLAY_MATH');
    });

    it('does not flag punctuation after inline math', () => {
        expectNoError(checkEN('The value $x^2$, is large.'), 'PUNCTUATION_AFTER_DISPLAY_MATH');
    });
});

describe('NO_CONCLUSION', () => {
    it('detects when text ends with formula', () => {
        expectError(checkEN('We get $x^2$'), 'NO_CONCLUSION');
    });

    it('does not flag when text ends with words', () => {
        expectNoError(checkEN('We get $x^2$. This completes the proof.'), 'NO_CONCLUSION');
    });
});

// ============================================================
// FONT AND ENVIRONMENT COMMANDS
// ============================================================
describe('LOW_LEVEL_FONT_COMMANDS', () => {
    it('detects {\\it ...}', () => {
        expectError(checkEN('{\\it text}'), 'LOW_LEVEL_FONT_COMMANDS');
    });

    it('detects {\\bf ...}', () => {
        expectError(checkEN('{\\bf text}'), 'LOW_LEVEL_FONT_COMMANDS');
    });

    it('does not flag \\textit', () => {
        expectNoError(checkEN('\\textit{text}'), 'LOW_LEVEL_FONT_COMMANDS');
    });

    it('does not flag \\item', () => {
        expectNoError(checkEN('\\item text'), 'LOW_LEVEL_FONT_COMMANDS');
    });
});

describe('ITALIC_INSTEAD_OF_EMPH', () => {
    it('detects \\textit usage', () => {
        expectError(checkEN('\\textit{word}'), 'ITALIC_INSTEAD_OF_EMPH');
    });

    it('does not flag \\emph', () => {
        expectNoError(checkEN('\\emph{word}'), 'ITALIC_INSTEAD_OF_EMPH');
    });
});

describe('EQNARRAY_USED', () => {
    it('detects eqnarray environment', () => {
        expectError(checkEN('\\begin{eqnarray}x=1\\end{eqnarray}'), 'EQNARRAY_USED');
    });

    it('does not flag align environment', () => {
        expectNoError(checkEN('\\begin{align}x=1\\end{align}'), 'EQNARRAY_USED');
    });
});

describe('REPLACE_MBOX_WITH_TEXT', () => {
    it('detects \\mbox', () => {
        expectError(checkEN('$x = \\mbox{value}$'), 'REPLACE_MBOX_WITH_TEXT');
    });

    it('detects \\hbox', () => {
        expectError(checkEN('$x = \\hbox{value}$'), 'REPLACE_MBOX_WITH_TEXT');
    });

    it('does not flag \\text', () => {
        expectNoError(checkEN('$x = \\text{value}$'), 'REPLACE_MBOX_WITH_TEXT');
    });
});

describe('MATH_ENVIRONMENT_VERBOSITY_WARNING', () => {
    it('detects \\begin{math}', () => {
        expectError(checkEN('\\begin{math}x\\end{math}'), 'MATH_ENVIRONMENT_VERBOSITY_WARNING');
    });

    it('does not flag $...$', () => {
        expectNoError(checkEN('$x$'), 'MATH_ENVIRONMENT_VERBOSITY_WARNING');
    });

    it('does not flag \\(...\\)', () => {
        expectNoError(checkEN('\\(x\\)'), 'MATH_ENVIRONMENT_VERBOSITY_WARNING');
    });
});

describe('TEXT_COMMANDS_IN_MATH_MODE', () => {
    it('detects \\textit in math', () => {
        expectError(checkEN('\\[\\textit{x}\\]'), 'TEXT_COMMANDS_IN_MATH_MODE');
    });

    it('detects \\textbf in math', () => {
        expectError(checkEN('$\\textbf{x}$'), 'TEXT_COMMANDS_IN_MATH_MODE');
    });

    it('detects \\emph in math', () => {
        expectError(checkEN('$\\emph{x}$'), 'TEXT_COMMANDS_IN_MATH_MODE');
    });

    it('does not flag \\mathbf', () => {
        expectNoError(checkEN('$\\mathbf{x}$'), 'TEXT_COMMANDS_IN_MATH_MODE');
    });
});

// ============================================================
// FORMULA CONTENT ANALYSIS
// ============================================================
describe('ELLIPSIS_LDOTS', () => {
    it('detects ... in math mode', () => {
        expectError(checkEN('$a_1, a_2, ... , a_n$'), 'ELLIPSIS_LDOTS');
    });

    it('does not flag \\ldots', () => {
        expectNoError(checkEN('$a_1, a_2, \\ldots, a_n$'), 'ELLIPSIS_LDOTS');
    });
});

describe('INCORPORATE_NOT', () => {
    it('detects \\not =', () => {
        expectError(checkEN('$a \\not = b$'), 'INCORPORATE_NOT');
    });

    it('detects \\not\\in', () => {
        expectError(checkEN('$x \\not\\in A$'), 'INCORPORATE_NOT');
    });

    it('does not flag \\ne', () => {
        expectNoError(checkEN('$a \\ne b$'), 'INCORPORATE_NOT');
    });

    it('does not flag \\notin', () => {
        expectNoError(checkEN('$x \\notin A$'), 'INCORPORATE_NOT');
    });
});

describe('BACKSLASH_NEEDED', () => {
    it('detects sin without backslash', () => {
        expectError(checkEN('$sin x$'), 'BACKSLASH_NEEDED');
    });

    it('detects cos without backslash', () => {
        expectError(checkEN('$cos x$'), 'BACKSLASH_NEEDED');
    });

    it('detects lim without backslash', () => {
        expectError(checkEN('$lim_{n} a_n$'), 'BACKSLASH_NEEDED');
    });

    it('detects max without backslash', () => {
        expectError(checkEN('$max(a,b)$'), 'BACKSLASH_NEEDED');
    });

    it('detects min without backslash', () => {
        expectError(checkEN('$min(a,b)$'), 'BACKSLASH_NEEDED');
    });

    it('detects log without backslash', () => {
        expectError(checkEN('$log n$'), 'BACKSLASH_NEEDED');
    });

    it('detects exp without backslash', () => {
        expectError(checkEN('$exp(x)$'), 'BACKSLASH_NEEDED');
    });

    it('detects det without backslash', () => {
        expectError(checkEN('$det A$'), 'BACKSLASH_NEEDED');
    });

    it('does not flag \\sin', () => {
        expectNoError(checkEN('$\\sin x$'), 'BACKSLASH_NEEDED');
    });

    it('does not flag \\cos', () => {
        expectNoError(checkEN('$\\cos x$'), 'BACKSLASH_NEEDED');
    });

    it('does not flag \\max', () => {
        expectNoError(checkEN('$\\max(a,b)$'), 'BACKSLASH_NEEDED');
    });
});

describe('OVER_VS_FRAC', () => {
    it('detects \\over', () => {
        expectError(checkEN('$a \\over b$'), 'OVER_VS_FRAC');
    });

    it('does not flag \\frac', () => {
        expectNoError(checkEN('$\\frac{a}{b}$'), 'OVER_VS_FRAC');
    });

    it('does not flag \\overline', () => {
        expectNoError(checkEN('$\\overline{x}$'), 'OVER_VS_FRAC');
    });
});

describe('CHOOSE_VS_BINOM', () => {
    it('detects \\choose', () => {
        expectError(checkEN('$n \\choose k$'), 'CHOOSE_VS_BINOM');
    });

    it('does not flag \\binom', () => {
        expectNoError(checkEN('$\\binom{n}{k}$'), 'CHOOSE_VS_BINOM');
    });
});

describe('LE_AS_SINGLE_COMMAND', () => {
    it('detects <= in math', () => {
        expectError(checkEN('$a <= b$'), 'LE_AS_SINGLE_COMMAND');
    });

    it('detects >= in math', () => {
        expectError(checkEN('$a >= b$'), 'LE_AS_SINGLE_COMMAND');
    });

    it('does not flag \\le', () => {
        expectNoError(checkEN('$a \\le b$'), 'LE_AS_SINGLE_COMMAND');
    });

    it('does not flag \\ge', () => {
        expectNoError(checkEN('$a \\ge b$'), 'LE_AS_SINGLE_COMMAND');
    });
});

describe('SETS_IN_BBFONT', () => {
    it('detects \\in N without \\mathbb', () => {
        expectError(checkEN('$x \\in N$'), 'SETS_IN_BBFONT');
    });

    it('detects \\in Z without \\mathbb', () => {
        expectError(checkEN('$x \\in Z$'), 'SETS_IN_BBFONT');
    });

    it('does not flag \\in \\mathbb{N}', () => {
        expectNoError(checkEN('$x \\in \\mathbb{N}$'), 'SETS_IN_BBFONT');
    });
});

describe('FLOOR_FUNCTION_NOTATION', () => {
    it('detects [x] notation in math', () => {
        expectError(checkEN('$[x]$'), 'FLOOR_FUNCTION_NOTATION');
    });

    it('does not flag \\lfloor x\\rfloor', () => {
        expectNoError(checkEN('$\\lfloor x\\rfloor$'), 'FLOOR_FUNCTION_NOTATION');
    });

    it('does not flag [a,b] with comma', () => {
        expectNoError(checkEN('$[a,b]$'), 'FLOOR_FUNCTION_NOTATION');
    });
});

describe('MULTIPLICATION_SIGN', () => {
    it('detects * in math', () => {
        expectError(checkEN('$a*b$'), 'MULTIPLICATION_SIGN');
    });

    it('does not flag \\cdot', () => {
        expectNoError(checkEN('$a \\cdot b$'), 'MULTIPLICATION_SIGN');
    });

    it('does not flag * in superscript like equation*', () => {
        expectNoError(checkEN('$x^*$'), 'MULTIPLICATION_SIGN');
    });
});

describe('INVISIBLE_BRACES', () => {
    it('detects bare { after =', () => {
        expectError(checkEN('$A = {x, y}$'), 'INVISIBLE_BRACES');
    });

    it('detects bare { after \\cup', () => {
        expectError(checkEN('$A \\cup {B}$'), 'INVISIBLE_BRACES');
    });

    it('does not flag \\{...\\}', () => {
        expectNoError(checkEN('$A = \\{x, y\\}$'), 'INVISIBLE_BRACES');
    });
});

describe('MOD_NOT_A_COMMAND', () => {
    it('detects plain mod in math', () => {
        expectError(checkEN('$a mod b$'), 'MOD_NOT_A_COMMAND');
    });

    it('does not flag \\bmod', () => {
        expectNoError(checkEN('$a \\bmod b$'), 'MOD_NOT_A_COMMAND');
    });

    it('does not flag \\pmod', () => {
        expectNoError(checkEN('$a \\pmod{b}$'), 'MOD_NOT_A_COMMAND');
    });
});

describe('TEXT_IN_MATH_MODE', () => {
    it('detects long English word in math', () => {
        expectError(checkEN('$A_{good}$'), 'TEXT_IN_MATH_MODE');
    });

    it('detects Cyrillic in math', () => {
        expectError(checkEN('$x = привет$'), 'TEXT_IN_MATH_MODE');
    });

    it('does not flag \\text{...}', () => {
        expectNoError(checkEN('$A_{\\text{good}}$'), 'TEXT_IN_MATH_MODE');
    });

    it('does not flag short variable names', () => {
        expectNoError(checkEN('$x + y$'), 'TEXT_IN_MATH_MODE');
    });
});

describe('MID_IN_SET_COMPREHENSION', () => {
    it('detects | instead of \\mid in set notation', () => {
        expectError(checkEN('$\\{x | x > 0\\}$'), 'MID_IN_SET_COMPREHENSION');
    });

    it('detects double \\mid without set braces', () => {
        expectError(checkEN('$\\mid x \\mid$'), 'MID_IN_SET_COMPREHENSION');
    });

    it('does not flag \\mid in set comprehension', () => {
        expectNoError(checkEN('$\\{x \\mid x > 0\\}$'), 'MID_IN_SET_COMPREHENSION');
    });
});

describe('LEFT_RIGHT_RECOMMENDED', () => {
    it('detects parentheses around frac in display math', () => {
        expectError(checkEN('\\[(\\frac{a}{b})^2\\]'), 'LEFT_RIGHT_RECOMMENDED');
    });

    it('does not flag when \\left\\right used', () => {
        expectNoError(checkEN('\\[\\left(\\frac{a}{b}\\right)^2\\]'), 'LEFT_RIGHT_RECOMMENDED');
    });

    it('does not flag in inline math', () => {
        expectNoError(checkEN('$(\\frac{a}{b})^2$'), 'LEFT_RIGHT_RECOMMENDED');
    });
});

describe('CDOT_FOR_READABILITY', () => {
    it('detects number directly before \\frac', () => {
        expectError(checkEN('$2\\frac{a}{b}$'), 'CDOT_FOR_READABILITY');
    });

    it('detects number before \\binom', () => {
        expectError(checkEN('$3\\binom{n}{k}$'), 'CDOT_FOR_READABILITY');
    });

    it('does not flag \\cdot before \\frac', () => {
        expectNoError(checkEN('$2 \\cdot \\frac{a}{b}$'), 'CDOT_FOR_READABILITY');
    });
});

describe('UNNECESSARY_MATH_MODE', () => {
    it('detects single non-alphanumeric symbol in math', () => {
        expectError(checkEN('Text $+$ more text.'), 'UNNECESSARY_MATH_MODE');
    });

    it('detects single operator in math', () => {
        expectError(checkEN('Use $=$ sign.'), 'UNNECESSARY_MATH_MODE');
    });

    it('does not flag single letter in math', () => {
        expectNoError(checkEN('Let $x$ be given.'), 'UNNECESSARY_MATH_MODE');
    });

    it('does not flag expression in math', () => {
        expectNoError(checkEN('$x + y$'), 'UNNECESSARY_MATH_MODE');
    });
});

describe('BETTER_TO_USE_WORDS_THEN_MATH', () => {
    it('detects formula starting with =', () => {
        expectError(checkEN('The count $= m^2$ items.'), 'BETTER_TO_USE_WORDS_THEN_MATH');
    });

    it('detects formula starting with \\le', () => {
        expectError(checkEN('The count $\\le m^2$ items.'), 'BETTER_TO_USE_WORDS_THEN_MATH');
    });

    it('does not flag normal formula', () => {
        expectNoError(checkEN('We have $x^2 + y^2$'), 'BETTER_TO_USE_WORDS_THEN_MATH');
    });
});

describe('GRAPHICS_IN_MATH_MODE', () => {
    it('detects \\includegraphics in math', () => {
        expectError(checkEN('\\[\\includegraphics{fig.png}\\]'), 'GRAPHICS_IN_MATH_MODE');
    });

    it('does not flag \\includegraphics in text', () => {
        expectNoError(checkEN('\\includegraphics{fig.png}'), 'GRAPHICS_IN_MATH_MODE');
    });
});

describe('UNICODE_SQRT', () => {
    it('detects unicode sqrt symbol', () => {
        expectError(checkEN('We compute √2.'), 'UNICODE_SQRT');
    });

    it('detects unicode sqrt in math', () => {
        expectError(checkEN('$√2$'), 'UNICODE_SQRT');
    });

    it('does not flag \\sqrt', () => {
        expectNoError(checkEN('$\\sqrt{2}$'), 'UNICODE_SQRT');
    });
});

describe('LIMITS_UNNECESSARY_IN_DISPLAY_MODE', () => {
    it('detects \\limits in display math', () => {
        expectError(checkEN('\\[\\sum\\limits_{i=1}^n x_i\\]'), 'LIMITS_UNNECESSARY_IN_DISPLAY_MODE');
    });

    it('does not flag \\limits in inline math', () => {
        expectNoError(checkEN('$\\sum\\limits_{i=1}^n x_i$'), 'LIMITS_UNNECESSARY_IN_DISPLAY_MODE');
    });
});

describe('USE_DIVIDES_INSTEAD_OF_VDOTS', () => {
    it('detects \\vdots followed by non-special char', () => {
        expectError(checkEN('$a \\vdots b$'), 'USE_DIVIDES_INSTEAD_OF_VDOTS');
    });

    it('does not flag \\vdots followed immediately by &', () => {
        expectNoError(checkEN('$\\vdots&$'), 'USE_DIVIDES_INSTEAD_OF_VDOTS');
    });

    it('does not flag \\vdots followed by \\\\', () => {
        expectNoError(checkEN('$\\vdots\\\\$'), 'USE_DIVIDES_INSTEAD_OF_VDOTS');
    });
});

describe('DASH_IN_MATH_MODE', () => {
    it('detects dash at end of math', () => {
        expectError(checkEN('$x-$'), 'DASH_IN_MATH_MODE');
    });

    it('does not flag minus in expression', () => {
        expectNoError(checkEN('$x - y$'), 'DASH_IN_MATH_MODE');
    });
});

describe('MAKE_LONG_FORMULA_DISPLAY', () => {
    it('detects very long inline formula (>110 chars)', () => {
        const longFormula =
            'a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q + r + s + t + u + v + w + x + y + z + aa + bb + cc';
        expect(longFormula.length > 110).toBe(true);
        expectError(checkEN('$' + longFormula + '$'), 'MAKE_LONG_FORMULA_DISPLAY');
    });

    it('does not flag short inline formula', () => {
        expectNoError(checkEN('$x + y$'), 'MAKE_LONG_FORMULA_DISPLAY');
    });

    it('does not flag long display formula', () => {
        const longFormula =
            'a + b + c + d + e + f + g + h + i + j + k + l + m + n + o + p + q + r + s + t + u + v + w + x + y + z';
        expectNoError(checkEN('\\[' + longFormula + '\\]'), 'MAKE_LONG_FORMULA_DISPLAY');
    });
});

// ============================================================
// PUNCTUATION AND SPACING
// ============================================================
describe('SPACE_BEFORE_PUNCTUATION_MARK', () => {
    it('detects space before comma', () => {
        expectError(checkEN('Word , another word.'), 'SPACE_BEFORE_PUNCTUATION_MARK');
    });

    it('detects space before period', () => {
        expectError(checkEN('End of sentence .'), 'SPACE_BEFORE_PUNCTUATION_MARK');
    });

    it('detects space before colon', () => {
        expectError(checkEN('Note :'), 'SPACE_BEFORE_PUNCTUATION_MARK');
    });

    it('does not flag proper punctuation', () => {
        expectNoError(checkEN('Word, another word.'), 'SPACE_BEFORE_PUNCTUATION_MARK');
    });
});

describe('SPACE_AFTER_PUNCTUATION_MARK', () => {
    it('detects missing space after comma before Cyrillic', () => {
        expectError(checkRU('Слово,другое слово.'), 'SPACE_AFTER_PUNCTUATION_MARK');
    });

    it('detects punctuation at end of text fragment before inline math (RU)', () => {
        expectError(checkRU('текст,$x$ продолжение.'), 'SPACE_AFTER_PUNCTUATION_MARK');
    });
});

describe('SPACE_BEFORE_PARENTHESIS', () => {
    it('detects missing space before (', () => {
        expectError(checkEN('word(text) here.'), 'SPACE_BEFORE_PARENTHESIS');
    });

    it('does not flag space before (', () => {
        expectNoError(checkEN('word (text) here.'), 'SPACE_BEFORE_PARENTHESIS');
    });

    it('does not flag nested parentheses', () => {
        expectNoError(checkEN('((nested)) text.'), 'SPACE_BEFORE_PARENTHESIS');
    });
});

describe('SPACE_AFTER_PARENTHESIS', () => {
    it('detects space after opening parenthesis', () => {
        expectError(checkEN('word ( text) here.'), 'SPACE_AFTER_PARENTHESIS');
    });

    it('does not flag no space after opening parenthesis', () => {
        expectNoError(checkEN('word (text) here.'), 'SPACE_AFTER_PARENTHESIS');
    });
});

describe('CAPITALIZATION_AFTER_PUNCTUATION_MARK', () => {
    it('detects capital Cyrillic after comma', () => {
        expectError(checkRU('слово, Другое слово.'), 'CAPITALIZATION_AFTER_PUNCTUATION_MARK');
    });

    it('detects capital Cyrillic after semicolon', () => {
        expectError(checkRU('слово; Другое слово.'), 'CAPITALIZATION_AFTER_PUNCTUATION_MARK');
    });

    it('does not flag lowercase after comma', () => {
        expectNoError(checkRU('слово, другое слово.'), 'CAPITALIZATION_AFTER_PUNCTUATION_MARK');
    });
});

describe('CAPITALIZATION_AFTER_PERIOD', () => {
    it('detects lowercase Cyrillic after period', () => {
        expectError(checkRU('Предложение. другое предложение.'), 'CAPITALIZATION_AFTER_PERIOD');
    });

    it('does not flag uppercase after period', () => {
        expectNoError(checkRU('Предложение. Другое предложение.'), 'CAPITALIZATION_AFTER_PERIOD');
    });
});

describe('PERIOD_BEFORE_NEXT_SENTENCE', () => {
    it('detects missing period when Cyrillic sentence follows math', () => {
        expectError(checkRU('Имеем $x$ Теперь покажем.'), 'PERIOD_BEFORE_NEXT_SENTENCE');
    });

    it('does not flag when period ends the formula portion', () => {
        expectNoError(checkRU('Имеем $x.$ Теперь покажем.'), 'PERIOD_BEFORE_NEXT_SENTENCE');
    });
});

describe('TILDE_INEFFECTIVE_AS_NBSP', () => {
    it('detects space before tilde', () => {
        expectError(checkEN('Formula ~\\ref{eq1}'), 'TILDE_INEFFECTIVE_AS_NBSP');
    });

    it('detects space after tilde', () => {
        expectError(checkEN('Formula~ text'), 'TILDE_INEFFECTIVE_AS_NBSP');
    });

    it('does not flag tilde without surrounding spaces', () => {
        expectNoError(checkEN('Formula~\\ref{eq1}'), 'TILDE_INEFFECTIVE_AS_NBSP');
    });
});

describe('INDENTATION_WITH_SPACES', () => {
    it('detects multiple tildes', () => {
        expectError(checkEN('~~text'), 'INDENTATION_WITH_SPACES');
    });

    it('detects multiple \\:', () => {
        expectError(checkEN('$\\:\\: x$'), 'INDENTATION_WITH_SPACES');
    });

    it('does not flag single tilde', () => {
        expectNoError(checkEN('word~word'), 'INDENTATION_WITH_SPACES');
    });
});

describe('DASH_HYPHEN', () => {
    it('detects hyphen used as dash (surrounded by spaces)', () => {
        expectError(checkEN('word - another word.'), 'DASH_HYPHEN');
    });

    it('does not flag proper em-dash ---', () => {
        expectNoError(checkEN('word --- another word.'), 'DASH_HYPHEN');
    });

    it('does not flag proper en-dash --', () => {
        expectNoError(checkEN('word -- another word.'), 'DASH_HYPHEN');
    });

    it('does not flag hyphen in compound word', () => {
        expectNoError(checkEN('well-known result.'), 'DASH_HYPHEN');
    });
});

// ============================================================
// QUOTATION MARKS
// ============================================================
describe('WRONG_QUOTES', () => {
    it('detects programmer quotes " in text', () => {
        expectError(checkEN('"text"'), 'WRONG_QUOTES');
    });

    it("does not flag LaTeX quotes ``...''", () => {
        expectNoError(checkEN("``text''"), 'WRONG_QUOTES');
    });
});

describe('QUOTES_IN_MATH', () => {
    it('detects " in math mode', () => {
        expectError(checkEN('$x"$'), 'QUOTES_IN_MATH');
    });

    it('does not flag apostrophe prime in math', () => {
        expectNoError(checkEN("$f''(x)$"), 'QUOTES_IN_MATH');
    });
});

describe('WRONG_SAME_QUOTES', () => {
    it("detects ''...'' same quotes", () => {
        expectError(checkEN("''text''"), 'WRONG_SAME_QUOTES');
    });

    it('detects ``...`` same quotes', () => {
        expectError(checkEN('``text``'), 'WRONG_SAME_QUOTES');
    });

    it("does not flag ``...'' proper quotes", () => {
        expectNoError(checkEN("``text''"), 'WRONG_SAME_QUOTES');
    });
});

// ============================================================
// CROSS-REFERENCING
// ============================================================
describe('EQREF_INSTEAD_OF_REF', () => {
    it('detects (\\ref{...})', () => {
        expectError(checkEN('See (\\ref{eq1}).'), 'EQREF_INSTEAD_OF_REF');
    });

    it('does not flag \\eqref{...}', () => {
        expectNoError(checkEN('See \\eqref{eq1}.'), 'EQREF_INSTEAD_OF_REF');
    });
});

describe('NONBREAKABLE_SPACE_BEFORE_REF', () => {
    it('detects regular space before \\ref', () => {
        expectError(checkEN('See \\ref{eq1}.'), 'NONBREAKABLE_SPACE_BEFORE_REF');
    });

    it('detects regular space before \\eqref', () => {
        expectError(checkEN('See \\eqref{eq1}.'), 'NONBREAKABLE_SPACE_BEFORE_REF');
    });

    it('does not flag tilde before \\ref', () => {
        expectNoError(checkEN('See~\\ref{eq1}.'), 'NONBREAKABLE_SPACE_BEFORE_REF');
    });
});

describe('TRIVIAL_LABEL', () => {
    it('detects \\label{eq1}', () => {
        expectError(checkEN('\\label{eq1}'), 'TRIVIAL_LABEL');
    });

    it('detects \\label{eq:1}', () => {
        expectError(checkEN('\\label{eq:1}'), 'TRIVIAL_LABEL');
    });

    it('detects \\label{th2}', () => {
        expectError(checkEN('\\label{th2}'), 'TRIVIAL_LABEL');
    });

    it('does not flag \\label{eqCauchy}', () => {
        expectNoError(checkEN('\\label{eqCauchy}'), 'TRIVIAL_LABEL');
    });

    it('does not flag \\label{thm:binomial}', () => {
        expectNoError(checkEN('\\label{thm:binomial}'), 'TRIVIAL_LABEL');
    });
});

describe('SYMBOLIC_LINKS', () => {
    it('detects hardcoded formula number (1) in math', () => {
        expectError(checkEN('$(1)$'), 'SYMBOLIC_LINKS');
    });

    it('detects hardcoded *) in math', () => {
        expectError(checkEN('$*)$'), 'SYMBOLIC_LINKS');
    });

    it('detects Russian "рисунок 1" pattern', () => {
        expectError(checkRU('См. рисунок 1. Конец.'), 'SYMBOLIC_LINKS');
    });

    it('detects Russian "формула 1" pattern', () => {
        expectError(checkRU('Используя формулу 1, получаем. Конец.'), 'SYMBOLIC_LINKS');
    });
});

describe('FORMULA_NEIGHBOURING_REFERENCE', () => {
    it('detects \\ref right after formula', () => {
        expectError(checkEN('$x$\\ref{eq1} text.'), 'FORMULA_NEIGHBOURING_REFERENCE');
    });

    it('detects \\ref right before formula', () => {
        expectError(checkEN('text \\ref{eq1}$x$ text.'), 'FORMULA_NEIGHBOURING_REFERENCE');
    });
});

// ============================================================
// LATIN/CYRILLIC ISSUES
// ============================================================
describe('LATIN_LETTER_OUTSIDE_MATH_EN', () => {
    it('detects single Latin letter B in text', () => {
        expectError(checkEN(', B,'), 'LATIN_LETTER_OUTSIDE_MATH_EN');
    });

    it('does not flag letter a (could be article)', () => {
        expectNoError(checkEN(', a,'), 'LATIN_LETTER_OUTSIDE_MATH_EN');
    });

    it('does not flag letter I (pronoun)', () => {
        expectNoError(checkEN(', I,'), 'LATIN_LETTER_OUTSIDE_MATH_EN');
    });

    it('does not flag letters in words', () => {
        expectNoError(checkEN('Hello world.'), 'LATIN_LETTER_OUTSIDE_MATH_EN');
    });
});

describe('LATIN_LETTER_OUTSIDE_MATH_RU', () => {
    it('detects single Latin letter in Russian text', () => {
        expectError(checkRU(', x,'), 'LATIN_LETTER_OUTSIDE_MATH_RU');
    });

    it('detects single letter a in Russian text', () => {
        expectError(checkRU(', a,'), 'LATIN_LETTER_OUTSIDE_MATH_RU');
    });

    it('does not flag Latin in math mode', () => {
        expectNoError(checkRU('Пусть $x$ --- число.'), 'LATIN_LETTER_OUTSIDE_MATH_RU');
    });
});

describe('MATH_SEMANTICS_OUTSIDE_MATH', () => {
    it('detects \\infty in text', () => {
        expectError(checkEN('Goes to \\infty.'), 'MATH_SEMANTICS_OUTSIDE_MATH');
    });

    it('detects \\cdot in text', () => {
        expectError(checkEN('Use \\cdot here.'), 'MATH_SEMANTICS_OUTSIDE_MATH');
    });

    it('detects math expression with = in text', () => {
        expectError(checkEN('We know 2 + 3 = 5 now.'), 'MATH_SEMANTICS_OUTSIDE_MATH');
    });

    it('does not flag \\infty in math', () => {
        expectNoError(checkEN('$x \\to \\infty$'), 'MATH_SEMANTICS_OUTSIDE_MATH');
    });
});

describe('LATIN_LETTER_C_MISUSED', () => {
    it('detects Latin c in Russian text', () => {
        expectError(checkEN('слово c другим словом.'), 'LATIN_LETTER_C_MISUSED');
    });

    it('does not flag Cyrillic с', () => {
        expectNoError(checkEN('слово с другим словом.'), 'LATIN_LETTER_C_MISUSED');
    });
});

describe('CYRILLIC_LETTER_C_MISUSED', () => {
    it('detects Cyrillic а in math mode', () => {
        expectError(checkEN('$а+b$'), 'CYRILLIC_LETTER_C_MISUSED');
    });

    it('detects Cyrillic с in math mode', () => {
        expectError(checkEN('$с+b$'), 'CYRILLIC_LETTER_C_MISUSED');
    });

    it('does not flag Latin a in math', () => {
        expectNoError(checkEN('$a+b$'), 'CYRILLIC_LETTER_C_MISUSED');
    });
});

// ============================================================
// SUGGESTED STYLE IMPROVEMENTS
// ============================================================
describe('SUGGESTED_NEW_PARAGRAPH', () => {
    it('detects \\\\ in text mode', () => {
        expectError(checkEN('text\\\\more text.'), 'SUGGESTED_NEW_PARAGRAPH');
    });

    it('detects \\newline in text mode', () => {
        expectError(checkEN('text\\newline more text.'), 'SUGGESTED_NEW_PARAGRAPH');
    });
});

describe('NUMERALS_AS_WORDS', () => {
    it('detects small numeral in text', () => {
        expectError(checkEN('Consider 2 cases.'), 'NUMERALS_AS_WORDS');
    });

    it('detects single digit formula', () => {
        expectError(checkEN('There are $3$ of them.'), 'NUMERALS_AS_WORDS');
    });

    it('does not flag large numbers in text', () => {
        expectNoError(checkEN('Consider 100 cases.'), 'NUMERALS_AS_WORDS');
    });
});

describe('MANUAL_LISTS', () => {
    it('detects 1) at start of line', () => {
        expectError(checkEN('1) First item.'), 'MANUAL_LISTS');
    });

    it('detects a) at start of line', () => {
        expectError(checkEN('a) First item.'), 'MANUAL_LISTS');
    });

    it('detects 2. at start of line', () => {
        expectError(checkEN('2. Second item.'), 'MANUAL_LISTS');
    });

    it('does not flag \\begin{enumerate}', () => {
        expectNoError(checkEN('\\begin{enumerate}\\item First\\end{enumerate}'), 'MANUAL_LISTS');
    });
});

// ============================================================
// ENGLISH-SPECIFIC CHECKS
// ============================================================
describe('EN_ORDINAL_ABBREVIATION', () => {
    it('detects 2st (should be 2nd)', () => {
        expectError(checkEN('The 2st item.'), 'EN_ORDINAL_ABBREVIATION');
    });

    it('detects 3st (should be 3rd)', () => {
        expectError(checkEN('The 3st item.'), 'EN_ORDINAL_ABBREVIATION');
    });

    it('detects 11st (should be 11th)', () => {
        expectError(checkEN('The 11st item.'), 'EN_ORDINAL_ABBREVIATION');
    });

    it('detects 12nd (should be 12th)', () => {
        expectError(checkEN('The 12nd item.'), 'EN_ORDINAL_ABBREVIATION');
    });

    it('detects 13rd (should be 13th)', () => {
        expectError(checkEN('The 13rd item.'), 'EN_ORDINAL_ABBREVIATION');
    });
});

describe('EN_ORDINAL_ABBREVIATION_IN_MATH', () => {
    it('detects ^{th} in math', () => {
        expectError(checkEN('$5^{th}$'), 'EN_ORDINAL_ABBREVIATION_IN_MATH');
    });

    it('detects ^{st} in math', () => {
        expectError(checkEN('$1^{st}$'), 'EN_ORDINAL_ABBREVIATION_IN_MATH');
    });

    it('detects ^{nd} in math', () => {
        expectError(checkEN('$2^{nd}$'), 'EN_ORDINAL_ABBREVIATION_IN_MATH');
    });

    it('detects ^{rd} in math', () => {
        expectError(checkEN('$3^{rd}$'), 'EN_ORDINAL_ABBREVIATION_IN_MATH');
    });
});

// ============================================================
// RUSSIAN-SPECIFIC CHECKS
// ============================================================
describe('RU_ORDINAL_ABBREVIATION', () => {
    it('detects incorrect ordinal like 5-ый', () => {
        expectError(checkRU('$5$-ый элемент.'), 'RU_ORDINAL_ABBREVIATION');
    });

    it('detects 3-ого', () => {
        expectError(checkRU('$3$-ого числа.'), 'RU_ORDINAL_ABBREVIATION');
    });
});

describe('ABBREVIATIONS_WITH_SPACE (RU)', () => {
    it('detects т.к. without thin space', () => {
        expectError(checkRU('Верно, т.к. доказано.'), 'ABBREVIATIONS_WITH_SPACE');
    });

    it('detects ч.т.д. (ч.т. portion)', () => {
        expectError(checkRU('Доказано, ч.т.д.'), 'ABBREVIATIONS_WITH_SPACE');
    });

    it('detects т.н. without thin space', () => {
        expectError(checkRU('Это т.н. теорема.'), 'ABBREVIATIONS_WITH_SPACE');
    });

    it('does not flag т.е. (not in regex)', () => {
        expectNoError(checkRU('Условие, т.е. требование.'), 'ABBREVIATIONS_WITH_SPACE');
    });
});

describe('DASH_SURROUND_WITH_SPACES (RU)', () => {
    it('detects -- without space after', () => {
        expectError(checkRU('слово --другое.'), 'DASH_SURROUND_WITH_SPACES');
    });

    it('detects -- without space before', () => {
        expectError(checkRU('слово-- другое.'), 'DASH_SURROUND_WITH_SPACES');
    });

    it('does not flag -- surrounded by spaces', () => {
        expectNoError(checkRU('слово -- другое.'), 'DASH_SURROUND_WITH_SPACES');
    });
});

describe('LATE_DEFINITION (RU)', () => {
    it('detects late variable definition with "где"', () => {
        expectError(checkRU('$x=a+b$, где $a$ --- число.'), 'LATE_DEFINITION');
    });
});

describe('RUSSIAN_TYPOGRAPHY_PECULIARITIES (RU)', () => {
    it('detects \\epsilon', () => {
        expectError(checkRU('$\\epsilon > 0$'), 'RUSSIAN_TYPOGRAPHY_PECULIARITIES');
    });

    it('detects \\phi', () => {
        expectError(checkRU('$\\phi(x)$'), 'RUSSIAN_TYPOGRAPHY_PECULIARITIES');
    });

    it('detects \\emptyset', () => {
        expectError(checkRU('$A = \\emptyset$'), 'RUSSIAN_TYPOGRAPHY_PECULIARITIES');
    });

    it('does not flag \\varepsilon', () => {
        expectNoError(checkRU('$\\varepsilon > 0$'), 'RUSSIAN_TYPOGRAPHY_PECULIARITIES');
    });

    it('does not flag \\varphi', () => {
        expectNoError(checkRU('$\\varphi(x)$'), 'RUSSIAN_TYPOGRAPHY_PECULIARITIES');
    });

    it('does not flag \\varnothing', () => {
        expectNoError(checkRU('$A = \\varnothing$'), 'RUSSIAN_TYPOGRAPHY_PECULIARITIES');
    });
});

describe('NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC (RU)', () => {
    it('detects command directly followed by Cyrillic', () => {
        expectError(checkRU('\\textbfСлово'), 'NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC');
    });

    it('does not flag command with space before Cyrillic', () => {
        expectNoError(checkRU('\\textbf Слово'), 'NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC');
    });
});

// ============================================================
// INTEGRATION TESTS
// ============================================================
describe('Integration: clean input produces no errors', () => {
    it('well-formed LaTeX with display math', () => {
        const result = checkEN('We prove that\n\\[x^2 + y^2 = z^2.\\]\nThis concludes the proof.');
        expect(result.hasNoErrors(), `Expected no errors but got: [${result.errors.join(', ')}]`).toBe(true);
    });

    it('well-formed LaTeX with inline math', () => {
        const result = checkEN('Let $x$ be a real number. Then $x^2 \\ge 0$. The proof is complete.');
        expect(result.hasNoErrors(), `Expected no errors but got: [${result.errors.join(', ')}]`).toBe(true);
    });
});

describe('Integration: multiple errors detected simultaneously', () => {
    it('detects both $$ and eqnarray', () => {
        const result = checkEN('$$x$$\n\\begin{eqnarray}y\\end{eqnarray}');
        expectError(result, 'DOUBLE_DOLLARS');
        expectError(result, 'EQNARRAY_USED');
    });

    it('detects font and spacing issues together', () => {
        const result = checkEN('{\\bf word} , other word.');
        expectError(result, 'LOW_LEVEL_FONT_COMMANDS');
        expectError(result, 'SPACE_BEFORE_PUNCTUATION_MARK');
    });

    it('detects multiple math issues', () => {
        const result = checkEN('$sin x + cos y ... a <= b$ text.');
        expectError(result, 'BACKSLASH_NEEDED');
        expectError(result, 'ELLIPSIS_LDOTS');
        expectError(result, 'LE_AS_SINGLE_COMMAND');
    });
});

describe('Integration: complex well-formed documents', () => {
    it('multi-line proof with proper formatting', () => {
        const input = [
            'We prove the following theorem.',
            '\\begin{equation}\\label{eqMain}',
            'a^2 + b^2 = c^2.',
            '\\end{equation}',
            'From~\\eqref{eqMain} it follows that $c \\ge a$.',
            'This completes the proof.',
        ].join('\n');
        const result = checkEN(input);
        expectNoError(result, 'MISMATCHED_MATH_DELIMITERS');
        expectNoError(result, 'DOUBLE_DOLLARS');
        expectNoError(result, 'EQNARRAY_USED');
        expectNoError(result, 'NONBREAKABLE_SPACE_BEFORE_REF');
    });

    it('document with aligned equations', () => {
        const input = [
            'We compute the following.',
            '\\begin{align}',
            'x &= a + b, \\\\',
            'y &= c + d.',
            '\\end{align}',
            'The result follows.',
        ].join('\n');
        const result = checkEN(input);
        expectNoError(result, 'CONSECUTIVE_DISPLAY_FORMULAE');
        expectNoError(result, 'EQNARRAY_USED');
    });
});

describe('Edge cases', () => {
    it('handles input with only text (no math)', () => {
        const result = checkEN('Just some plain text without any formulas.');
        expectNoError(result, 'MISMATCHED_MATH_DELIMITERS');
        expectNoError(result, 'DOUBLE_DOLLARS');
    });

    it('handles input with multiple inline formulas', () => {
        const result = checkEN('Let $x$ and $y$ be integers. Then $x+y$ is an integer. Done.');
        expectNoError(result, 'MISMATCHED_MATH_DELIMITERS');
        expectNoError(result, 'UNNECESSARY_FORMULA_BREAK');
    });

    it('handles escaped backslash \\\\', () => {
        const result = checkEN('\\[a \\\\ b\\]');
        expectNoError(result, 'MISMATCHED_MATH_DELIMITERS');
    });

    it('handles nested environments', () => {
        const result = checkEN('\\begin{equation}\\begin{aligned}x &= 1\\end{aligned}\\end{equation}');
        expectNoError(result, 'MISMATCHED_MATH_DELIMITERS');
    });

    it('handles \\begin{equation*}', () => {
        const result = checkEN('\\begin{equation*}x=1\\end{equation*}');
        expectNoError(result, 'MISMATCHED_MATH_DELIMITERS');
    });

    it('handles multline environment', () => {
        const result = checkEN('\\begin{multline}x + y \\\\ = z\\end{multline}');
        expectNoError(result, 'MISMATCHED_MATH_DELIMITERS');
    });

    it('handles gather environment', () => {
        const result = checkEN('\\begin{gather}x = 1 \\\\ y = 2\\end{gather}');
        expectNoError(result, 'MISMATCHED_MATH_DELIMITERS');
    });

    it('handles flalign environment', () => {
        const result = checkEN('\\begin{flalign}x &= 1\\end{flalign}');
        expectNoError(result, 'MISMATCHED_MATH_DELIMITERS');
    });
});

describe('Severity levels', () => {
    it('DOUBLE_DOLLARS has severity 0 (critical)', () => {
        const result = checkEN('$$x$$');
        expect(result.getSeverity('DOUBLE_DOLLARS')).toBe(0);
    });

    it('LEFT_RIGHT_RECOMMENDED has severity 10 (minor)', () => {
        const result = checkEN('\\[(\\frac{a}{b})^2\\]');
        expect(result.getSeverity('LEFT_RIGHT_RECOMMENDED')).toBe(10);
    });

    it('TRIVIAL_LABEL has severity 5 (medium)', () => {
        const result = checkEN('\\label{eq1}');
        expect(result.getSeverity('TRIVIAL_LABEL')).toBe(5);
    });
});

describe('Error deduplication', () => {
    it('reports same error code only once even with multiple occurrences', () => {
        const result = checkEN('$sin x + cos y$ and $tan z$ text.');
        const sinCosCount = result.errors.filter((e) => e === 'BACKSLASH_NEEDED').length;
        expect(sinCosCount).toBe(1);
    });

    it('reports \\textit only once even with multiple uses', () => {
        const result = checkEN('\\textit{a} and \\textit{b}');
        const count = result.errors.filter((e) => e === 'ITALIC_INSTEAD_OF_EMPH').length;
        expect(count).toBe(1);
    });
});

describe('Pure function export', () => {
    it('checkLatex is a function', () => {
        expect(typeof checkLatex).toBe('function');
    });

    it('returns an array', () => {
        const result = checkLatex('test', en.errorDescriptions, en.strings);
        expect(Array.isArray(result)).toBe(true);
    });

    it('result items have expected shape', () => {
        const result = checkLatex('$$x$$', en.errorDescriptions, en.strings);
        expect(result.length).toBeGreaterThan(0);
        const item = result[0];
        expect(item).toHaveProperty('code');
        expect(item).toHaveProperty('severity');
        expect(item).toHaveProperty('msg');
        expect(item).toHaveProperty('fragments');
        expect(Array.isArray(item.fragments)).toBe(true);
    });
});

describe('Language-specific error activation', () => {
    it('RU_ORDINAL_ABBREVIATION does NOT fire with English i18n', () => {
        expectNoError(checkEN('$5$-ый элемент.'), 'RU_ORDINAL_ABBREVIATION');
    });

    it('EN_ORDINAL_ABBREVIATION does NOT fire with Russian i18n', () => {
        expectNoError(checkRU('The 2st item.'), 'EN_ORDINAL_ABBREVIATION');
    });

    it('RUSSIAN_TYPOGRAPHY_PECULIARITIES does NOT fire with English i18n', () => {
        expectNoError(checkEN('$\\epsilon > 0$'), 'RUSSIAN_TYPOGRAPHY_PECULIARITIES');
    });

    it('NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC does NOT fire with English i18n (empty msg)', () => {
        expectNoError(checkEN('\\textbfСлово'), 'NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC');
    });

    it('ABBREVIATIONS_WITH_SPACE does NOT fire with English i18n', () => {
        expectNoError(checkEN('Верно, т.к. доказано.'), 'ABBREVIATIONS_WITH_SPACE');
    });

    it('DASH_SURROUND_WITH_SPACES does NOT fire with English i18n', () => {
        expectNoError(checkEN('слово --другое.'), 'DASH_SURROUND_WITH_SPACES');
    });
});
