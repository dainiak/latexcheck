export default {
    strings: {
        noErrors:
            'Замечательный результат: автоматическая проверка пройдена без замечаний.',
        task: 'Условие задачи',
        solution: 'Решение',
        mmDoubleOpen:
            'Команда <code>{1}</code> встречена в математическом режиме, открытом ранее командой <code>{2}</code>',
        mmWrongClose:
            'Команда <code>{1}</code> встречена в текстовом режиме, а должна была закрывать математический.',
        lineNo: ' (строка {1} в редакторе)',
        wrongFragment:
            'Подозрительный фрагмент: <code>…{1}…</code>',
        pasteLabel:
            'Вставьте исходный текст на \\(\\LaTeX\\) сюда:',
        checkBtn: 'Проверить!',
        previewBtn: 'Предпросмотр',
        reportBugBtn:
            'Сообщить об ошибке',
        langLabel: 'Switch to English',
        headerDesc:
            'Инструмент создан <a rel="author" href="https://www.dainiak.com" target="_blank">Александром Дайняком</a>. См. также <a href="https://github.com/dainiak/latexcheck-py" target="_blank">консольную версию</a> этого инструмента; часто она даёт более точный результат.',
        resourcesToggle:
            'См. также полезные ресурсы для пользователей \\(\\LaTeX\\).',
        resultPlaceholder:
            'Здесь отображается результат проверки',
        githubRibbon: 'Проект на GitHub',
    },
    resources: [
        {
            title: 'Полезные ресурсы:',
            items: [
                {
                    text: 'П. Халмош. <em>Как писать математические тексты</em>',
                    url: 'https://1drv.ms/w/s!AiAwrmxQ9QLrjOtTQqAXWdl3ryK5Jg?e=vEMU6W',
                },
                {
                    text: 'К. В. Воронцов. \\(\\LaTeX\\) 2e в примерах',
                    url: 'https://www.ccas.ru/voron/download/voron05latex.pdf',
                },
                {
                    text: 'С. М. Львовский. Набор и вёрстка в системе \\(\\LaTeX\\)',
                    url: 'https://www.mccme.ru/free-books/llang/newllang.pdf',
                },
                {
                    text: 'Интерактивный вводный урок по \\(\\LaTeX\\): www.ilatexprimer.com',
                    url: 'https://www.dainiak.com/ilatexprimer/',
                },
                {
                    text: 'Рукописный ввод символов \\(\\LaTeX\\): <a href="https://detexify.kirelabs.org/classify.html" target="_blank">Detexify</a> и <a href="http://www.martin-thoma.de/write-math/classify/" target="_blank">Write Math</a>',
                    url: null,
                },
                {
                    text: 'Wikibooks: LaTeX/Advanced Mathematics',
                    url: 'https://en.wikibooks.org/wiki/LaTeX/Advanced_Mathematics',
                },
            ],
        },
    ],
    errorDescriptions: {
        DOUBLE_DOLLARS: {
            msg: 'Двойных долларов в тексте быть не должно. Выносные формулы нужно оформлять с помощью <code>\\[</code>…<code>\\]</code>. Объяснение <a href="https://tex.stackexchange.com/questions/503/why-is-preferable-to" target="_blank">по ссылке</a>.',
            severity: 0,
        },
        MISMATCHED_MATH_DELIMITERS: {
            msg: 'Возможно, где-то не закрыта формула знаком доллара, либо наоборот забыт доллар перед формулой.',
            severity: 0,
        },
        CONSECUTIVE_DISPLAY_FORMULAE: {
            msg: 'Обнаружены две идущие подряд выключные формулы. Такого быть не должно: используйте окружение <code>aligned</code> или его аналоги, чтобы грамотно оформить не умещающиеся на одной строке выкладки. Подробнее, например, по <a href="https://www.overleaf.com/learn/latex/Aligning_equations_with_amsmath" target="_blank">ссылке</a>.',
            severity: 0,
        },
        EQNARRAY_USED: {
            msg: 'Не используйте окружение <code>eqnarray</code> (подробности по <a href="https://tex.stackexchange.com/a/197" target="_blank">ссылке</a>). Вместо этого пользуйтесь, например, <code>align</code>.',
            severity: 0,
        },
        ABBREVIATIONS_WITH_SPACE: {
            msg: 'Сокращения типа <em>т.&thinsp;е.</em>, <em>т.&thinsp;к.</em>, <a href="https://ru.wikipedia.org/wiki/Q.E.D." target="_blank"><em>ч.&thinsp;т.&thinsp;д.</em></a> и подобные <a href="https://new.gramota.ru/spravka/buro/search-answer?s=296030">следует оформлять с пробелом</a> (см. также <a href="https://popravilam.com/blog/105-probel-v-sokrashcheniyah.html" target="_blank">тут</a>), но есть особенность: использовать нужно <em>неразрывный</em> пробел <code>~</code> или, ещё лучше, <a href="https://ru.wikipedia.org/wiki/%D0%A3%D0%B7%D0%BA%D0%B8%D0%B9_%D0%BF%D1%80%D0%BE%D0%B1%D0%B5%D0%BB" target="_blank"><em>тонкую шпацию</em></a> <code>\\,</code>. Например: <code>ч.\\,т.\\,д.</code>.',
            severity: 0,
        },
        DASH_HYPHEN: {
            msg: 'Возможно, перепутано тире с дефисом. Полноценное длинное тире ставится с помощью <code>---</code>, укороченное с помощью  <code>--</code>. Подробнее о тире, дефисах и подобном см. <a href="https://webstyle.sfu-kras.ru/tire-defis" target="_blank">здесь</a> и <a href="https://habrahabr.ru/post/20588/" target="_blank">здесь</a>. Ну и, конечно, никогда не поздно почитать <a href="https://www.artlebedev.ru/kovodstvo/sections/97/" target="_blank">А. Лебедева</a>.',
            severity: 0,
        },
        DASH_IN_MATH_MODE: {
            msg: 'Похоже, Вы хотели поставить дефис. Но когда знак дефиса попадает в математический режим, он становится минусом. Вывод: делать дефис не частью формулы, а частью следующего за ней текста.',
            severity: 0,
        },
        DASH_SURROUND_WITH_SPACES: {
            msg: 'Тире с двух сторон следует окружать пробелами. Особенный шик — один или оба из пробелов сделать неразрывными.',
            severity: 0,
        },
        RU_ORDINAL_ABBREVIATION: {
            msg: 'Нарушены <a href="https://new.gramota.ru/spravka/letters/22-spravka/letters/87-rubric-99" target="_blank">правила сокращения порядковых числительных</a>.',
            severity: 0,
        },
        EN_ORDINAL_ABBREVIATION: { msg: '', severity: 0 },
        LATE_DEFINITION: {
            msg: 'Вместо того, чтобы писать <q><code>$x=a+b$</code>, где <code>$a=…</code></q> сначала лучше ввести все буквы и лишь затем записать выражение.',
            severity: 0,
        },
        PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA: {
            msg: 'Пустая строка заставляет \\(\\LaTeX\\) начинать новый параграф, даже если эта пустая строка стоит прямо перед выключной формулой.',
            severity: 0,
        },
        UNNECESSARY_FORMULA_BREAK: {
            msg: 'Возможно, некоторые формулы следовало объединить.',
            severity: 0,
        },
        CENTERING: {
            msg: 'Центрирование явно используется только при включении рисунков и таблиц.',
            severity: 0,
        },
        LOW_LEVEL_FONT_COMMANDS: {
            msg: 'Вместо низкоуровневых команд <code>{\\it …}</code>, <code>{\\bf …}</code> используйте команды <code>\\textit{…}</code> <code>\\textbf{…}</code>.',
            severity: 0,
        },
        ITALIC_INSTEAD_OF_EMPH: {
            msg: 'Выделять текст лучше не курсивом, а более гибкой командой <code>\\emph{…}</code>.',
            severity: 0,
        },
        WRONG_QUOTES: {
            msg: 'Для закавычивания слов «клавиатурные» кавычки <code>"..."</code> в \\(\\LaTeX\\) не используются.',
            severity: 0,
        },
        WRONG_SAME_QUOTES: {
            msg: 'Открывающие и закрывающие кавычки ставятся по-разному.',
            severity: 0,
        },
        QUOTES_IN_MATH: {
            msg: 'Обнаружен символ кавычки в математическом режиме.',
            severity: 0,
        },
        LATIN_LETTER_OUTSIDE_MATH_RU: {
            msg: 'Даже одна буква, если у неё математический смысл — должна быть набрана в математическом режиме.',
            severity: 0,
        },
        MATH_SEMANTICS_OUTSIDE_MATH: {
            msg: 'Команды, печатающие математические символы, рекомендуется использовать в математическом режиме.',
            severity: 0,
        },
        LATIN_LETTER_C_MISUSED: {
            msg: 'Возможно, использована случайно латинская буква с (це) вместо русского предлога <strong>с</strong>.',
            severity: 0,
        },
        CYRILLIC_LETTER_C_MISUSED: {
            msg: 'Возможно, использована случайно одна из кириллических букв <strong>а</strong>, <strong>е</strong>, <strong>с</strong>, <strong>х</strong> вместо латинской.',
            severity: 0,
        },
        FLOOR_FUNCTION_NOTATION: {
            msg: 'В современной литературе принято целую часть числа \\(x\\) обозначать <code>\\lfloor x\\rfloor</code>, а не <code>[x]</code>.',
            severity: 0,
        },
        MULTIPLICATION_SIGN: {
            msg: 'Знак <code>*</code> используется для обозначения умножения в программировании, но не в математике. Пользуйтесь командой <code>\\cdot</code> или <code>\\times</code>.',
            severity: 0,
        },
        SPACE_BEFORE_PUNCTUATION_MARK: {
            msg: 'Пробелы перед двоеточием, запятой, точкой не ставятся.',
            severity: 0,
        },
        SPACE_BEFORE_PARENTHESIS: {
            msg: 'В тексте перед открывающей скобкой ставится пробел.',
            severity: 0,
        },
        SPACE_AFTER_PUNCTUATION_MARK: {
            msg: 'После двоеточия, запятой, точки нужно ставить пробел.',
            severity: 0,
        },
        SPACE_AFTER_PARENTHESIS: {
            msg: 'После открывающей скобки не следует ставить пробел.',
            severity: 0,
        },
        CAPITALIZATION_AFTER_PUNCTUATION_MARK: {
            msg: 'После двоеточия, точки с запятой, запятой, — не должно начинаться новое предложение.',
            severity: 0,
        },
        CAPITALIZATION_AFTER_PERIOD: {
            msg: 'Предложение следует начинать с заглавной буквы.',
            severity: 0,
        },
        PERIOD_BEFORE_NEXT_SENTENCE: {
            msg: 'В конце предложения должна ставиться точка, даже если предложение заканчивается формулой.',
            severity: 0,
        },
        LEFT_RIGHT_RECOMMENDED: {
            msg: 'Когда при наборе формул возникает необходимость поставить скобки вокруг высокой подформулы, рекомендуется добавлять <code>\\left</code> и <code>\\right</code>.',
            severity: 10,
        },
        NUMERALS_AS_WORDS: {
            msg: 'Числительные, не превосходящие пяти, часто лучше писать не цифрами, а словами.',
            severity: 10,
        },
        MID_IN_SET_COMPREHENSION: {
            msg: 'При описании множеств вертикальная черта ставится командой <code>\\mid</code>.',
            severity: 0,
        },
        SYMBOLIC_LINKS: {
            msg: 'Пользуйтесь символическими ссылками.',
            severity: 0,
        },
        EQREF_INSTEAD_OF_REF: {
            msg: 'Вместо <code>(\\ref{…})</code> следует писать <code>\\eqref{…}</code>',
            severity: 0,
        },
        NONBREAKABLE_SPACE_BEFORE_REF: {
            msg: 'Перед командами <code>\\ref</code>, <code>\\eqref</code> рекомендуется ставить тильду.',
            severity: 0,
        },
        ELLIPSIS_LDOTS: {
            msg: 'В математическом режиме многоточие ставится командой <code>\\ldots</code>.',
            severity: 0,
        },
        SUGGESTED_NEW_PARAGRAPH: {
            msg: 'Использовать несемантичный перенос <code>\\\\</code> следует только в крайних случаях.',
            severity: 0,
        },
        TRIVIAL_LABEL: {
            msg: 'Символические ссылки нужно делать, но нет смысла делать тривиальные описания типа <code>\\label{eq1}</code>.',
            severity: 5,
        },
        REPLACE_MBOX_WITH_TEXT: {
            msg: 'Для вставки текста внутрь формулы пользуйтесь командой <code>\\text</code>.',
            severity: 0,
        },
        TEXT_IN_MATH_MODE: {
            msg: 'Для вставки текста внутрь формулы пользуйтесь командой <code>\\text</code>.',
            severity: 0,
        },
        NO_CONCLUSION: {
            msg: 'Обычно решение задачи не заканчивают рисунком или формулой.',
            severity: 5,
        },
        INCORPORATE_NOT: {
            msg: 'Вместо <code>\\not=</code> можно написать <code>\\ne</code>, вместо <code>\\not\\in</code> написать <code>\\notin</code>.',
            severity: 0,
        },
        PARAGRAPH_STARTS_WITH_FORMULA: {
            msg: 'Параграф не следует начинать с формулы.',
            severity: 0,
        },
        SENTENCE_STARTS_WITH_FORMULA: {
            msg: 'Обычно предложение не следует начинать с формулы.',
            severity: 0,
        },
        SENTENCE_STARTS_WITH_NUMBER: {
            msg: 'Обычно предложение не следует начинать с цифровой записи числа.',
            severity: 5,
        },
        RUSSIAN_TYPOGRAPHY_PECULIARITIES: {
            msg: 'В отечественной типографской традиции принято: <code>\\varnothing</code> вместо <code>\\emptyset</code>, <code>\\varepsilon</code> вместо <code>\\epsilon</code>, <code>\\varphi</code> вместо <code>\\phi</code>.',
            severity: 0,
        },
        OVER_VS_FRAC: {
            msg: 'Команда <code>\\over</code> является низкоуровневой. Вместо <code>A \\over B</code> пишите <code>\\frac{A}{B}</code>.',
            severity: 0,
        },
        CHOOSE_VS_BINOM: {
            msg: 'Команда <code>\\choose</code> является низкоуровневой. Вместо <code>A \\choose B</code> пишите <code>\\binom{A}{B}</code>.',
            severity: 0,
        },
        INVISIBLE_BRACES: {
            msg: 'Чтобы вывести фигурные скобки, нужно написать <code>\\{…\\}</code>.',
            severity: 0,
        },
        SETS_IN_BBFONT: {
            msg: 'Стандартные числовые множества нужно набирать: <code>\\mathbb{N}</code>.',
            severity: 0,
        },
        MANUAL_LISTS: {
            msg: 'Не следует вручную создавать нумерованные списки. Используйте окружение enumerate.',
            severity: 0,
        },
        MOD_NOT_A_COMMAND: {
            msg: 'Используйте <code>\\bmod</code> или <code>\\pmod</code>.',
            severity: 0,
        },
        TILDE_INEFFECTIVE_AS_NBSP: {
            msg: 'Значок <code>~</code> означает неразрывный пробел. Окружать его пробелами бессмысленно.',
            severity: 0,
        },
        INDENTATION_WITH_SPACES: {
            msg: 'Избегайте использования нескольких пробельных значков подряд.',
            severity: 0,
        },
        LE_AS_SINGLE_COMMAND: {
            msg: 'Используйте <code>\\le</code> и <code>\\ge</code> вместо <code><=</code> и <code>>=</code>.',
            severity: 0,
        },
        PUNCTUATION_AFTER_DISPLAY_MATH: {
            msg: 'Знак препинания после выключной формулы следует делать частью формулы.',
            severity: 0,
        },
        BACKSLASH_NEEDED: {
            msg: 'Слова \\(\\min\\), \\(\\max\\) и подобные в формулах должны набираться прямым шрифтом: <code>\\min</code>, <code>\\max</code>, <code>\\lim</code> и т.д.',
            severity: 0,
        },
        CDOT_FOR_READABILITY: {
            msg: 'Полезно для читабельности явно указывать произведение командой <code>\\cdot</code>.',
            severity: 5,
        },
        GRAPHICS_IN_MATH_MODE: {
            msg: 'Команда <code>\\includegraphics</code> не должна использоваться в математическом режиме.',
            severity: 0,
        },
        UNNECESSARY_MATH_MODE: {
            msg: 'Если внутри формулы стоит единственный символ и он не является буквой или цифрой — это тревожный знак.',
            severity: 0,
        },
        BETTER_TO_USE_WORDS_THEN_MATH: {
            msg: 'Конструкции наподобие <code>число элементов $=m^2$</code> недопустимы в письменном тексте.',
            severity: 0,
        },
        NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC: {
            msg: 'Хотя \\(\\LaTeX\\) это и не считает ошибкой, не следует писать слитно команды ТеХа и кириллические слова.',
            severity: 0,
        },
        TEXT_COMMANDS_IN_MATH_MODE: {
            msg: 'Текстовые команды <code>\\textbf</code>, <code>\\textit</code> не следует использовать в математическом режиме.',
            severity: 0,
        },
        LIMITS_UNNECESSARY_IN_DISPLAY_MODE: {
            msg: 'Команда <code>\\limits</code> в выключных формулах обычно лишняя.',
            severity: 0,
        },
        MATH_ENVIRONMENT_VERBOSITY_WARNING: {
            msg: 'Окружение <code>math</code> используется редко. Используйте <code>\\(…\\)</code> или <code>$…$</code>.',
            severity: 0,
        },
        USE_DIVIDES_INSTEAD_OF_VDOTS: {
            msg: 'Команду <code>\\vdots</code> следует использовать только в матрицах.',
            severity: 0,
        },
        FORMULA_NEIGHBOURING_REFERENCE: {
            msg: 'Плохо читается, когда формула непосредственно соседствует со ссылкой.',
            severity: 0,
        },
        MAKE_LONG_FORMULA_DISPLAY: {
            msg: 'Подозрительно длинная формула набрана не в выключном режиме.',
            severity: 0,
        },
        UNICODE_SQRT: {
            msg: 'Для квадратного корня используйте <code>\\sqrt</code> вместо символа UNICODE.',
            severity: 0,
        },
    },
};
