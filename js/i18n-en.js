window.i18n = {
    "strings": {
        "noErrors": "The checker has found nothing to complain about.",
        "task": "Task",
        "solution": "Solution",
        "mmDoubleOpen": "Command <code>{1}</code> occurred in math mode that was opened earlier with command <code>{2}</code>",
        "mmWrongClose": "Command <code>{1}</code> occurred in text mode while it should close the math mode.",
        "lineNo": " (line {1} in source code)",
        "wrongFragment": "Code fragment: <code>…{1}…</code>"
    },
    "errorDescriptions": {
        "DOUBLE_DOLLARS": {
            "msg": "Double dollars for display math should be avoided in \\(\\LaTeX\\). Use <code>\\[</code>…<code>\\]</code> for display style formulas. See <a href=\"https://tex.stackexchange.com/questions/503/why-is-preferable-to\">explanation</a>.",
            "severity": 0
        },
        "MISMATCHED_MATH_DELIMITERS": {
            "msg": "Possibly mismatched math delimiters.",
            "severity": 0
        },
        "CONSECUTIVE_DISPLAY_FORMULAE": {
            "msg": "Two consecutive display style formulas detected. This should be avoided. Use <code>aligned</code> environment or its analogues to properly typeset long formula that does not fit into single line. See e.g. <a href=\"https://www.overleaf.com/learn/latex/Aligning_equations_with_amsmath\">these guidelines</a>.",
            "severity": 0
        },
        "EQNARRAY_USED": {
            "msg": "Avoid <code>eqnarray</code> environment (see <a href=\"https://tex.stackexchange.com/a/197\">details</a>). Use e.g. <code>align</code> instead.",
            "severity": 0
        },
        "DASH_HYPHEN": {
            "msg": "Looks like you have wrongly used hyphen instead of dash. You can typeset M-dash “—” with <code>---</code> and N-dash “–” with <code>--</code> in \\(\\LaTeX\\). See <a href=\"https://www.grammarly.com/blog/hyphens-and-dashes/\">details</a>.",
            "severity": 0
        },
        "DASH_IN_MATH_MODE": {
            "msg": "Looks like you wanted to typeset a hyphen. But when hyphen appears in math mode \\(\\LaTeX\\) treats it as minus. So you should make this hyphen part of the text that follows the formula, not the formula itself.",
            "severity": 0
        },
        "EN_ORDINAL_ABBREVIATION_IN_MATH": {
            "msg": "Ordinal abbreviations are textual, not mathematical pieces. See <a href=\"https://tex.stackexchange.com/a/4119\">details</a> on how to properly typeset them in \\(\\LaTeX\\) if you’d like to keep the superscript style.",
            "severity": 0
        },
        "EN_ORDINAL_ABBREVIATION": {
            "msg": "Possibly wrong ordinal abbreviation, see <a href=\"https://www.grammarly.com/blog/how-to-write-ordinal-numbers-correctly/\">details</a>.",
            "severity": 0
        },
        "PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA": {
            "msg": "An empty line makes \\(\\LaTeX\\) to start a new paragraph even if this line happens just before a display-style formula. Most of the time it is not needed, as paragraphs should not start with formulae, and as display math already have enough space before and after.",
            "severity": 0
        },
        "UNNECESSARY_FORMULA_BREAK": {
            "msg": "Looks like some math needs concatenating. For instance, instead of <code>$x$, $y$ $\\in$ $A$</code> write <code>$x,\\,y\\in A$</code>; instead of <code>$a$ = $b+c$</code> write <code>$a=b+c$</code> etc.",
            "severity": 0
        },
        "CENTERING": {
            "msg": "Explicit centering should only be used in figure an table environments, and sometimes for headings. Avoid centering of non-display-style formulae.",
            "severity": 0
        },
        "LOW_LEVEL_FONT_COMMANDS": {
            "msg": "Instead of using low-level TeX commands <code>{\\it …}</code>, <code>{\\bf …}</code>. Instead use <code>\\textit{…}</code>, <code>\\textbf{…}</code> etc (see <a href=\"https://tex.stackexchange.com/questions/41681/correct-way-to-bold-italicize-text\">details</a>.) It is also recommended to use <code>\\emph{…}</code> command to emphasize portions of the text instead of italicizing, as it nicely works also inside italicized text blocks.",
            "severity": 0
        },
        "ITALIC_INSTEAD_OF_EMPH": {
            "msg": "Consider using <code>\\emph{…}</code> for text emphasis instead of italicizing, as it nicely works also inside italicized text blocks.",
            "severity": 0
        },
        "WRONG_QUOTES": {
            "msg": "Do not use “programmers’ quotes” like <code>\"…\"</code> to quote in \\(\\LaTeX\\). Use <code>``…''</code> instead.",
            "severity": 0
        },
        "WRONG_SAME_QUOTES": {
            "msg": "Opening and closing quotes are usually different: avoid <code>''…''</code> or <code>``…``</code>, make it <code>``…''</code> instead.",
            "severity": 0
        },
        "QUOTES_IN_MATH": {
            "msg": "Quote symbol detected in math mode. If you need to put a mathematical “prime” symbol use <code>\\prime\\prime</code> or just keyboard apostrophes <code>''</code>.",
            "severity": 0
        },
        "LATIN_LETTER_OUTSIDE_MATH_EN": {
            "msg": "Even a single letter (if this letter has a mathematical semantics) should be typeset in math mode.",
            "severity": 0
        },
        "MATH_SEMANTICS_OUTSIDE_MATH": {
            "msg": "Commands that typeset <em>mathematical</em> symbols should generally be placed inside math mode (in spite of some of them work in text mode also).",
            "severity": 0
        },
        "LATIN_LETTER_C_MISUSED": {
            "msg": "Looks like you have accidentally used latin c instead of cyrillic с.",
            "severity": 0
        },
        "CYRILLIC_LETTER_C_MISUSED": {
            "msg": "Looks like you have accidentally used one of cyrillic letters a,e,c instead of their latin counterparts.",
            "severity": 0
        },
        "FLOOR_FUNCTION_NOTATION": {
            "msg": "In modern mathematical literature the integer part of number \(x\) is denoted as <code>\\lfloor x\\rfloor</code>, not <code>[x]</code>.",
            "severity": 0
        },
        "MULTIPLICATION_SIGN": {
            "msg": "Symbol <code>*</code> is used to denote multiplication in programming, not in mathematics. Use <code>\\cdot</code> or <code>\\times</code> instead (<code>\\times</code> is used only in special circumstances though).",
            "severity": 0
        },
        "SPACE_BEFORE_PUNCTUATION_MARK": {
            "msg": "There should be no space symbol inserted before colon, semicolon, comma, full stop, exclamation mark or question mark.",
            "severity": 0
        },
        "SPACE_BEFORE_PARENTHESES": {
            "msg": "There should be a space before the opening parenthesis.",
            "severity": 0
        },
        "SPACE_AFTER_PUNCTUATION_MARK": {
            "msg": "There should be a space after colon, semicolon, comma, full stop, exclamation mark or question mark.",
            "severity": 0
        },
        "SPACE_AFTER_PARENTHESIS": {
            "msg": "There should be no space after the opening parenthesis.",
            "severity": 0
        },
        "CAPITALIZATION_AFTER_PUNCTUATION_MARK": {
            "msg": "Colon, semicolon, and comma do not mark the end of the sentence, and thus the word following them should generally not be capitalized.",
            "severity": 0
        },
        "CAPITALIZATION_AFTER_PERIOD": {
            "msg": "Sentences should start with capital letter.",
            "severity": 0
        },
        "PERIOD_BEFORE_NEXT_SENTENCE": {
            "msg": "Sentences should ultimately end with full stop even if they end with formula.",
            "severity": 0
        },
        "LEFT_RIGHT_RECOMMENDED": {
            "msg": "When in need of typesetting paired delimiters (parentheses, brackets, braces, absolute value symbol, norm symbol) around some large formula, it is recommended to add <code>\\left</code> and <code>\\right</code> commands. Compare how ugly is the PDF representation of a formula <code>\\[(\\frac{a}{b})^2\\]</code> and how beautiful is the proper variant of it: <code>\\[\\left(\\frac{a}{b}\\right)^2\\]</code>. On the other hand, <code>\\left… … \\right…</code> should not be overused, use them just when you see the mismatch between the formula hight and the delimiter height. See <a href=\"https://tex.stackexchange.com/a/58641\">details</a>. You can also employ <a href=\"https://tex.stackexchange.com/a/1765\"><code>\\DeclarePairedDelimiter</code></a> command from <em>mathtools</em> library.",
            "severity": 10
        },
        "NUMERALS_AS_WORDS": {
            "msg": "Stylistically it usually looks better when small numerals are kept as words, not numbers. E.g. <em>Consider 2 cases</em> looks inferior to <em>Consider two cases</em>.",
            "severity": 10
        },
        "MID_IN_SET_COMPREHENSION": {
            "msg": "When describing sets the vertical line is placed using <code>\\mid</code> command. E.g. <code>\\{x^2\\mid x\\in\\mathbb{Z}\\}</code>. In other contexts you should generally avoid <code>\\mid</code>. For instance, for absolute value use <code>|x|</code> or <code>\\lvert x \\rvert</code>.",
            "severity": 0
        },
        "SYMBOLIC_LINKS": {
            "msg": "Employ symbolic cross-referencing, e.g.: <code>Note that \\begin{equation}\\label{eqSquares} a^2-b^2=(a-b)(a+b). \\end{equation} From~\\eqref{eqSquares} it follows that…</code>. See <a href=\"https://www.overleaf.com/learn/latex/Cross_referencing_sections%2C_equations_and_floats\">details</a>.",
            "severity": 0
        },
        "EQREF_INSTEAD_OF_REF": {
            "msg": "Write <code>\\eqref{…}</code> instead of <code>(\\ref{…})</code>.",
            "severity": 0
        },
        "NONBREAKABLE_SPACE_BEFORE_REF": {
            "msg": "Commands <code>\\ref</code>, <code>\\eqref</code> and such are recommended to be prepended with unbreakable space <code>~</code>, e.g.: <code>…Using~\\eqref{eqMaxwell} we obtain…</code>.",
            "severity": 0
        },
        "ELLIPSIS_LDOTS": {
            "msg": "You should use <code>\\ldots</code> for ellipsis in math mode instead of <code>...</code>. If you use <em>amsmath</em> package you can use  <code>\\dotsc</code> command for ellipsis in typical mathematical enumerations.",
            "severity": 0
        },
        "SUGGESTED_NEW_PARAGRAPH": {
            "msg": "To place a formula on a new line you should make that formula to be display-style. To start a new paragraph use <code>\\par</code> in text mode. Avoid using low-level line break <code>\\\\</code> except for <code>tabular</code>, <code>matrix</code>, or similar environments.",
            "severity": 0
        },
        "TRIVIAL_LABEL": {
            "msg": "It is definitely a good idea to use symbolic cross-references instead of hard-coding explicit numbers, but you should avoid using non-semantic names of the references like <code>\\label{eq1}</code>. Just as a variable with the name <code>var1</code> is frowned upon in software development. Take time and think on some meaningful name, e.g. <code>eqCauchy</code>, <code>eqBinomialSymmetry</code>, <code>eqMain</code> (the latter if fine if this is indeed the most important formula in your proof) etc.",
            "severity": 5
        },
        "REPLACE_MBOX_WITH_TEXT": {
            "msg": "To place text inside a formula avoid using low-level <code>\\mbox</code> and <code>\\hbox</code> commands. Use <code>\\text</code> instead. See <a href=\"https://tex.stackexchange.com/questions/70632/difference-between-various-methods-for-producing-text-in-math-mode\">details</a>.",
            "severity": 0
        },
        "TEXT_IN_MATH_MODE": {
            "msg": "To insert text inside a math formula use <code>\\text</code> command, e.g.: <code>Consider a set $A_{\\text{good}}$</code>.",
            "severity": 0
        },
        "NO_CONCLUSION": {
            "msg": "It is rarely a good idea to end the proof or a problem solution right on some formula or a figure. It is best to add some concluding remark in the end, e.g.: <code>This concludes the proof.</code> or <code>Thus we finally get unknown value: $42$.</code> etc.",
            "severity": 5
        },
        "INCORPORATE_NOT": {
            "msg": "Although <code>\\not</code> command does work to get a negated (crossed-out) sign, the <a href=\"https://tex.stackexchange.com/a/141011\">better way</a> is to search for the dedicated command. For instance, <code>\\ne</code> is better than <code>\\not=</code>, <code>\\notin</code> is better than <code>\\not\\in</code> etc.",
            "severity": 0
        },
        "PARAGRAPH_STARTS_WITH_FORMULA": {
            "msg": "A paragraph should not start with a formula. If you need to place a formula on a separate line, typeset it in display mode using <code>\\[…\\]</code>.",
            "severity": 0
        },
        "SENTENCE_STARTS_WITH_FORMULA": {
            "msg": "Typically a sentence should not start with a formula. You can pretty much always add some introductory words. For instance, instead of <code>$G$ is connected.</code> write <code>Graph $G$ is connected.</code>",
            "severity": 0
        },
        "SENTENCE_STARTS_WITH_NUMBER": {
            "msg": "Typically a sentence should not start with a number. Consider using numerals or reordering the sentenced. <code>5 persons can form a queue in $5!$ ways.</code> you could write <code>Five persons…</code> or <code>Note that 5 persons…</code>",
            "severity": 5
        },
        "OVER_VS_FRAC": {
            "msg": "The command <code>\\over</code> is a low-level TeX command and <a href=\"https://tex.stackexchange.com/a/73825\">should be avoided</a> in \\(\\LaTeX\\). Replace <code>A \\over B</code> with <code>\\frac{A}{B}</code>.",
            "severity": 0
        },
        "CHOOSE_VS_BINOM": {
            "msg": "The command <code>\\choose</code> is a low-level TeX command and <a href=\"https://tex.stackexchange.com/a/127711\">should be avoided</a> in \\(\\LaTeX\\). Replace <code>A \\choose B</code> with <code>\\binom{A}{B}</code>.",
            "severity": 0
        },
        "INVISIBLE_BRACES": {
            "msg": "To typeset braces you should write <code>\\{…\\}</code>. Without backslaches the braces <code>{…}</code> are the semantic delimiters in code, but are not displayed in the PDF.",
            "severity": 0
        },
        "SETS_IN_BBFONT": {
            "msg": "Standard number sets should be typeset in “blackboard bold” font: e.g. the usages of <code>N</code> as a set of naturals should be replaced with <code>\\mathbb{N}</code>.",
            "severity": 0
        },
        "MANUAL_LISTS": {
            "msg": "Avoid manual numbering in lists. Employ <em>enumerate</em> environment: <code>\\begin{enumerate}\\item Firstly… \\item Secondly… \\end{enumerate}</code>. Learn more about typesetting lists <a href=\"https://www.overleaf.com/learn/latex/Lists\">here</a>.",
            "severity": 0
        },
        "MOD_NOT_A_COMMAND": {
            "msg": "Use <code>\\bmod</code> or <code>\\pmod</code> to typeset \\(\\bmod\\) with roman font.",
            "severity": 0
        },
        "TILDE_INEFFECTIVE_AS_NBSP": {
            "msg": "The symbol <code>~</code> denotes the unbreakable space in \\(\\LaTeX\\). It should not be surrounded with spaces: you loose unbreakability. For instance, instead of <code>Formula ~\\eqref{…} implies…</code> you should write <code>Formula~\\eqref{…} implies…</code>",
            "severity": 0
        },
        "INDENTATION_WITH_SPACES": {
            "msg": "Avoid using multiple spaces to indent text. Use proper \\(\\LaTeX\\) spacing command instead, see <a href=\"https://tex.stackexchange.com/a/74354\">details</a>.",
            "severity": 0
        },
        "LE_AS_SINGLE_COMMAND":  {
            "msg": "To typeset \\(\\le\\) or \\(\\ge\\) employ <code>\\le</code> and <code>\\ge</code> commands respectively. The arrow \\(\\Leftarrow\\) is typeset with <code>\\Leftarrow</code> command. Software developing combinations like <code><=</code> and <code>>=</code> are of no use in \\(\\LaTeX\\).",
            "severity": 0
        },
        "PUNCTUATION_AFTER_DISPLAY_MATH":  {
            "msg": "When you place a punctuation mark right after a display-style formula, it is going to be thorn away from it and placed on a separate line (just look at the compiled PDF). So if you need e.g. to place a comma right after display formula, you should make this comma part of the formula itself.",
            "severity": 0
        },
        "BACKSLASH_NEEDED":  {
            "msg": "Words \\(\\min\\), \\(\\max\\) and such in mathematical formulas are operator names and should be typeset with roman font. There are corresponding <em>commands</em> of \\(\\LaTeX\\) <code>\\min</code>, <code>\\max</code>, <code>\\lim</code>, <code>\\deg</code>, and others, that will do that work for you. See the list of these commands <a href=\"https://www.overleaf.com/learn/latex/Operators#Reference_guide\">here</a>. If you cannot see the command that you need, write something like <code>\\operatorname{min}</code> or, even better, <a href=\"https://tex.stackexchange.com/a/67529\">declare your own operator</a> with <code>\\DeclareMathOperator</code> command in the document preamble.",
            "severity": 0
        },
        "CDOT_FOR_READABILITY":  {
            "msg": "When typesetting products of numbers, fractions, binomial coefficients and such, consider using explicit multiplication dot <code>\\cdot</code> occasionally.",
            "severity": 5
        },
        "GRAPHICS_IN_MATH_MODE":  {
            "msg": "The <code>\\includegraphics</code> command should not be used in math mode except for you really know what you are doing with it. For instance, to center a figure on screen, use <code>center</code> and <code>figure</code> environments instead of surrounding your <code>\\includegraphics</code> with display math delimiters.",
            "severity": 0
        },
        "UNNECESSARY_MATH_MODE": {
            "msg": "If the only content of a formula is a single symbols which is neither a digit nor a single letter — that is suspicious! Most likely you either did not need math mode here or unnecessarily broke a formula into pieces.",
            "severity": 0
        },
        "BETTER_TO_USE_WORDS_THEN_MATH": {
            "msg": "Constructs like <code>the number of elements $=m^2$</code> are unacceptable in proper mathematical writing except for taking short personal notes. Symbols  \\(=, \\gt, \\geqslant\\) and such should be replaced with words if surrounded by words: <code>…does not exceed $m^2$</code>, <code>…equals $m^2$</code> etc.",
            "severity": 0
        },
        "NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC":{
            "msg": "",
            "severity": 0
        },
        "TEXT_COMMANDS_IN_MATH_MODE": {
            "msg": "Text style commands <code>\\textbf</code>, <code>\\textit</code> and such should be avoided in math mode. There are math-mode commands for some font styles. For instance, <code>\\mathbf</code> for mathematical bold font.",
            "severity": 0
        },
        "LIMITS_UNNECESSARY_IN_DISPLAY_MODE": {
            "msg": "The <code>\\limits</code> command can be frequently omitted in display formulas: the operator limits are typically automatically placed above and below the operator even without it in display math mode.",
            "severity": 0
        },
        "MATH_ENVIRONMENT_VERBOSITY_WARNING": {
            "msg": "The <code>math</code> environment is not popular in \\(\\LaTeX\\) community. You can use a shorter (and absolutely equivalent in terms of what you get of it) construct <code>\\(…\\)</code> or <code>$…$</code>. Note also that <em>math</em> does not make a display-style formula, it opens the standard inline-math mode. For display math use <code>\\[…\\]</code> or one of the environments <em>equation</em>, <em>array</em> etc.",
            "severity": 0
        },
        "USE_DIVIDES_INSTEAD_OF_VDOTS": {
            "msg": "Command <code>\\vdots</code> should be primarily used for typesetting matrices as a vertical ellipsis. When writing on divisibility of numbers consider using vertical line (“…devides…”) instead of triple vertical dots (“…is divisible by…”).",
            "severity": 0
        },
        "FORMULA_NEIGHBOURING_REFERENCE": {
            "msg": "A formula that directly neighbours a reference typically looks inferior. You can always think on some word to insert in between them.",
            "severity": 0
        },
        "MAKE_LONG_FORMULA_DISPLAY": {
            "msg": "Long formulas that take a lot of screen space should generally be thoughtfully typeset with proper AMS environments: see the list of these environments and their usecases <a href=\"https://www.overleaf.com/learn/latex/Aligning_equations_with_amsmath\">here</a>.",
            "severity": 0
        },
        "UNICODE_SQRT": {
            "msg": "To typeset the square root symbol use <code>\\sqrt</code> instead of UNICODE symbol. As a benefit you will also get a beautiful stretching overline.",
            "severity": 0
        }
    }
};