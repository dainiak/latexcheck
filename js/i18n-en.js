window.i18n = {
    "strings": {
        "noErrors": "The checker has found nothing to complain about.",
        "task": "Task",
        "solution": "Solution",
        "mmDoubleOpen": "Command <code>{1}</code> occurred in math mode that was opened earlier with command <code>{2}</code>",
        "mmWrongClose": "Command <code>{1}</code> occurred in text mode while it should close the math mode."
    },
    "errorDescriptions": {
        "DOUBLE_DOLLARS": {
            "msg": "Double dollars for display math should be avoided in LaTeX. Use <code>\\[</code>…<code>\\]</code> for display style formulas. See <a href=\"https://tex.stackexchange.com/questions/503/why-is-preferable-to\">explanation</a>.",
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
        "ABBREVIATIONS_WITH_SPACE": {
            "msg": "",
            "severity": 0
        },
        "DASH_HYPHEN": {
            "msg": "Возможно, перепутано тире с дефисом. Полноценное длинное тире ставится с помощью <code>---</code>, укороченное с помощью  <code>--</code>. Подробнее о тире, дефисах и подобном см. <a href=\"https://webstyle.sfu-kras.ru/tire-defis\">здесь</a> и <a href=\"https://habrahabr.ru/post/20588/\">здесь</a>. Ну и, конечно, никогда не поздно почитать <a href=\"https://www.artlebedev.ru/kovodstvo/sections/97/\">А. Лебедева</a>.",
            "severity": 0
        },
        "DASH_IN_MATH_MODE": {
            "msg": "Похоже, Вы хотели поставить дефис. Но когда знак дефиса попадает в математический режим, он становится минусом. Вывод: делать дефис не частью формулы, а частью следующего за ней текста.",
            "severity": 0
        },
        "DASH_SURROUND_WITH_SPACES": {
            "msg": "Тире с двух сторон следует окружать пробелами. Особенный шик — один или оба из пробелов сделать неразрывными, чтобы тире не «повисало на краю пропасти» при переносе строки. Подробнее о тире, дефисах и подобном см. <a href=\"https://webstyle.sfu-kras.ru/tire-defis\">здесь</a> и <a href=\"https://habrahabr.ru/post/20588/\">здесь</a>. Ну и, конечно, никогда не поздно почитать <a href=\"https://www.artlebedev.ru/kovodstvo/sections/97/\">А. Лебедева</a>.",
            "severity": 0
        },
        "NUMERAL_ABBREVIATION": {
            "msg": "Нарушены <a href=\"https://new.gramota.ru/spravka/letters/22-spravka/letters/87-rubric-99\">правила сокращения порядковых числительных</a>.",
            "severity": 0
        },
        "LATE_DEFINITION": {
            "msg": "Вместо того, чтобы писать <q><code>$x=a+b$</code>, где <code>$a=…</code></q> сначала лучше ввести все буквы и лишь затем записать выражение, эти буквы содержащие. См. <a href=\"https://1drv.ms/w/s!AiAwrmxQ9QLrjOtTQqAXWdl3ryK5Jg?e=vEMU6W\">статью П. Халмоша</a>, раздел «Правильно используйте слова».",
            "severity": 0
        },
        "PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA": {
            "msg": "Пустая строка заставляет \\(\\LaTeX\\) начинать новый параграф, даже если эта пустая строка стоит прямо перед выключной формулой. Чаще всего это не нужно, так как параграфы по смыслу не следует начинать с формул, а выключную формулу \\(\\LaTeX\\) в любом случае окаймляет достаточным количеством пустого пространства.",
            "severity": 0
        },
        "UNNECESSARY_FORMULA_BREAK": {
            "msg": "Возможно, некоторые формулы следовало объединить. Например, вместо <code>$x$, $y$ $\\in$ $A$</code> пишите <code>$x,\\,y\\in A$</code>; вместо <code>$a$ = $b+c$</code> пишите <code>$a=b+c$</code> и т.д.",
            "severity": 0
        },
        "CENTERING": {
            "msg": "Центрирование явно используется только при включении рисунков и таблиц. Иногда для заголовков. Для обычных формул центрирование не используется, вместо этого следует делать выключные формулы.",
            "severity": 0
        },
        "LOW_LEVEL_FONT_COMMANDS": {
            "msg": "Вместо низкоуровневых команд <code>{\\it …}</code>, <code>{\\bf …}</code> используйте команды <code>\\textit{…}</code> <code>\\textbf{…}</code> (подробности см. по <a href=\"https://tex.stackexchange.com/questions/41681/correct-way-to-bold-italicize-text\">ссылке</a>.) Кроме того, выделять текст лучше не курсивом, а более гибкой командой <code>\\emph{…}</code>, поскольку она корректно сработает даже внутри курсивного блока.",
            "severity": 0
        },
        "ITALIC_INSTEAD_OF_EMPH": {
            "msg": "Выделять текст лучше не курсивом, а более гибкой командой <code>\\emph{…}</code>, поскольку она корректно сработает даже внутри курсивного блока.",
            "severity": 0
        },
        "WRONG_QUOTES": {
            "msg": "Для закавычивания слов «клавиатурные» кавычки <code>\"…\"</code> в LaTeX не используются. Если нужно закавычить слово, делайте это одним из способов <code>``…''</code> (два апострофа на букве ё вначале и два на букве э в конце) или <code><<…>></code> (два знака меньше и два знака больше).",
            "severity": 0
        },
        "WRONG_SAME_QUOTES": {
            "msg": "Открывающие и закрывающие кавычки ставится по-разному: непривильно делать <code>''…''</code> или <code>``…``</code>, следует делать <code>``…''</code> для закавычивания в англоязычном тексте. В русской типографике применяются французские <code><<кавычки-ёлочки>></code>, для вложенных кавычек — немецкие <code>,,кавычки-лапки``</code>.",
            "severity": 0
        },
        "QUOTES_IN_MATH": {
            "msg": "Обнаружен символ кавычки в математическом режиме. Если Вы хотели поставить двойной штрих над математическим символом, наберите два штриха подряд: <code>y''</code>.",
            "severity": 0
        },
        "LATIN_LETTER_OUTSIDE_MATH": {
            "msg": "Даже одна буква, если у неё математический смысл (если это имя математического объекта) — должна быть набрана в математическом режиме.",
            "severity": 0
        },
        "MATH_SEMANTICS_OUTSIDE_MATH": {
            "msg": "Команды, печатающие символы, имеющие математическую природу, настоятельно рекомендуется использовать в математическом режиме, даже если они работают и без оного.",
            "severity": 0
        },
        "LATIN_LETTER_C_MISUSED": {
            "msg": "Возможно, использована случайно латинская буква с (це) вместо русского предлога <strong>с</strong> посреди текста на русском языке.",
            "severity": 0
        },
        "CYRILLIC_LETTER_C_MISUSED": {
            "msg": "Возможно, использована случайно кириллическая буква <strong>с</strong> (эс) вместо латинской буквы <strong>c</strong> (це) внутри фоормулы.",
            "severity": 0
        },
        "FLOOR_FUNCTION_NOTATION": {
            "msg": "В современной литературе принято целую часть числа x обозначать <code>\\lfloor x\\rfloor</code>, а не <code>[x]</code>.",
            "severity": 0
        },
        "MULTIPLICATION_SIGN": {
            "msg": "Знак <code>*</code> используется для обозначения умножения в программировании, но не в математике. Пользуйтесь командой <code>\\cdot</code> или <code>\\times</code> (последней только в особых случаях).",
            "severity": 0
        },
        "SPACE_BEFORE_PUNCTUATION_MARK": {
            "msg": "Пробелы перед двоеточием, запятой, точкой, восклицательным и вопросительными знаками, точкой с запятой не ставятся.",
            "severity": 0
        },
        "SPACE_BEFORE_PARENTHESES": {
            "msg": "В тексте перед открывающей скобкой ставится пробел.",
            "severity": 0
        },
        "SPACE_AFTER_PUNCTUATION_MARK": {
            "msg": "После двоеточия, запятой, точки, точки с запятой, восклицательного и вопросительного знаков нужно ставить пробел.",
            "severity": 0
        },
        "SPACE_AFTER_PARENTHESIS": {
            "msg": "После открывающей скобки не следует ставить пробел.",
            "severity": 0
        },
        "CAPITALIZATION_AFTER_PUNCTUATION_MARK": {
            "msg": "После двоеточия, точки с запятой, запятой, — не должно начинаться новое предложение.",
            "severity": 0
        },
        "CAPITALIZATION_AFTER_PERIOD": {
            "msg": "Предложение следует начинать с заглавной буквы.",
            "severity": 0
        },
        "PERIOD_BEFORE_NEXT_SENTENCE": {
            "msg": "В конце предложения должна ставиться точка, даже если предложение заканчивается формулой.",
            "severity": 0
        },
        "LEFT_RIGHT_RECOMMENDED": {
            "msg": "Когда при наборе формул возникает необходимость поставить скобки (круглые/фигурные/квадратные) или знак модуля вокруг высокой подформулы (дроби, биномиального коэффициента, суммы с пределами), рекомендуется добавлять команды <code>\\left</code> и <code>\\right</code>. Особенно это актуально для выключных формул. Например, сравните, как нелепо выглядит в PDF скомпилированная формула <code>\\[(\\frac{a}{b})^2\\]</code> и как естественен её «правильный» вариант <code>\\[\\left(\\frac{a}{b}\\right)^2\\]</code>. Тем не менее, переусердствовать здесь тоже не стоит: добавляйте <code>\\left… … \\right…</code> только тогда, когда видите явное несоответствие между высотой скобок и высотой того, что они окружают. Подробности по <a href=\"https://tex.stackexchange.com/a/58641\">ссылке</a>. Можно также воспользоваться командой <a href=\"https://tex.stackexchange.com/a/1765\"><code>\\DeclarePairedDelimiter</code></a> из библиотеки mathtools.",
            "severity": 10
        },
        "NUMERALS_AS_WORDS": {
            "msg": "Со стилистической точки зрения, числительные, не превосходящие пяти и окружённые текстом, часто лучше писать не цифрами, а словами. Например, <em>Рассмотрим 2 случая</em> смотрится хуже, чем <em>Рассмотрим два случая</em>.",
            "severity": 10
        },
        "MID_IN_SET_COMPREHENSION": {
            "msg": "При описании множеств вертикальная черта ставится командой <code>\\mid</code>. Например, <code>\\{x^2\\mid x\\in\\mathbb{Z}\\}</code>. И, наоборот, <code>\\mid</code> НЕ используется в остальных контекстах, например, при обозначении модуля числа. Для обозначения последнего пишите <code>|x|</code> или <code>\\lvert x \\rvert</code>.",
            "severity": 0
        },
        "SYMBOLIC_LINKS": {
            "msg": "Пользуйтесь символическими ссылками, например: <code>Заметим, что \\begin{equation}\\label{eqSquares} a^2-b^2=(a-b)(a+b). \\end{equation} Из равенства~\\eqref{eqSquares}, следует, что…</code>.",
            "severity": 0
        },
        "EQREF_INSTEAD_OF_REF": {
            "msg": "Вместо <code>(\\ref{…})</code> следует писать <code>\\eqref{…}</code>",
            "severity": 0
        },
        "NONBREAKABLE_SPACE_BEFORE_REF": {
            "msg": "Перед командами <code>\\ref</code>, <code>\\eqref</code> рекомендуется ставить тильду, чтобы номер ссылки был приклеен неразрывным пробелом, например: <code>…Согласно~\\eqref{eqMaxwell}, имеем…</code>.",
            "severity": 0
        },
        "ELLIPSIS_LDOTS": {
            "msg": "В математическом режиме многоточие ставится не <code>...</code>, а командой <code>\\ldots</code>. При наличии пакета amsmath, когда многоточие нужно вставить между запятыми в перечислении объектов, используйте команду <code>\\dotsc</code>.",
            "severity": 0
        },
        "SUGGESTED_NEW_PARAGRAPH": {
            "msg": "Чтобы начать с новой строки формулу, она делается выключной. Чтобы начать новый параграф текста, используется команда <code>\\par</code> в текстовом режиме. Использовать же несемантичный перенос <code>\\\\</code>, помимо окружений типа <code>tabular</code>, следует только в крайних случаях.",
            "severity": 0
        },
        "TRIVIAL_LABEL": {
            "msg": "Символические ссылки нужно делать, но нет большого смысла делать тривиальные описания типа <code>\\label{eq1}</code>. Так же, как в программировании называть переменную <code>var1</code> чаще всего пагубно. Куда лучше придумать осмысленное название, например <code>eqCauchy</code>, <code>eqBinomialSymmetry</code>, <code>eqMain</code> (если это действительно самая важная формула в доказательстве) и т.д.",
            "severity": 5
        },
        "REPLACE_MBOX_WITH_TEXT": {
            "msg": "Для вставки текста внутрь формулы вместо команд <code>\\mbox</code> и <code>\\hbox</code> пользуйтесь командой <code>\\text</code>. Объяснение см. по <a href=\"https://tex.stackexchange.com/questions/70632/difference-between-various-methods-for-producing-text-in-math-mode\">ссылке</a>.",
            "severity": 0
        },
        "TEXT_IN_MATH_MODE": {
            "msg": "Для вставки текста внутрь формулы (даже если слова на латинице, но не являются именами математических объектов) вместо команд пользуйтесь командой <code>\\text</code>, например: <code>Рассмотрим множество $A_{\\text{хорошие}}$</code>.",
            "severity": 0
        },
        "NO_CONCLUSION": {
            "msg": "Обычно решение задачи или доказательство теоремы не заканчивают рисунком или формулой. Полезно добавить в конце хотя бы какое-то заключение, например: <code>Теорема доказана.</code>, <code>В итоге мы получили ответ: искомое количество равно $42$.</code> и т.д.",
            "severity": 5
        },
        "INCORPORATE_NOT": {
            "msg": "Хотя префикс <code>\\not</code> позволяет из многих значков получить значок-отрицание, часто короче (и <a href=\"https://tex.stackexchange.com/a/141011\">рекомендуется</a>!) писать одной командой. Например, вместо <code>\\not=</code> можно написать <code>\\ne</code>, вместо <code>\\not\\in</code> написать <code>\\notin</code> и т.д.",
            "severity": 0
        },
        "PARAGRAPH_STARTS_WITH_FORMULA": {
            "msg": "Параграф не следует начинать с формулы. Если Вы хотите, чтобы формула была на отдельной строке, а не в тексте, сделайте её выносной: <code>\\[…\\]</code>.",
            "severity": 0
        },
        "SENTENCE_STARTS_WITH_FORMULA": {
            "msg": "Обычно предложение не следует начинать с формулы. Почти всегда можно добавить в начало слово. Например, вместо предложения <code>$G$ связен.</code> напишите <code>Граф $G$ связен.</code>",
            "severity": 0
        },
        "SENTENCE_STARTS_WITH_NUMBER": {
            "msg": "Обычно предложение не следует начинать с цифровой записи числа. Например, вместо предложения <code>5 человек можно выстроить в очередь $5!$ способами.</code> лучше написать либо <code>Пятерых человек…</code> либо <code>Заметим, что 5 человек…</code>",
            "severity": 5
        },
        "RUSSIAN_TYPOGRAPHY_PECULIARITIES": {
            "msg": "Строго говоря, это не является ошибкой, но в отечественной типографской традиции принято пустое множество обозначать значком <code>\\varnothing</code>, а не <code>\\emptyset</code> (последний более приплюснутый). Аналогично, вместо <code>\\epsilon</code> лучше писать <code>\\varepsilon</code>, а вместо <code>\\phi</code> писать <code>\\varphi</code>.",
            "severity": 0
        },
        "OVER_VS_FRAC": {
            "msg": "Команда <code>\\over</code> является низкоуровневой командой TeX и <a href=\"https://tex.stackexchange.com/a/73825\">не рекомендуется</a> к использованию в LaTeX. Вместо <code>A \\over B</code> пишите <code>\\frac{A}{B}</code>.",
            "severity": 0
        },
        "CHOOSE_VS_BINOM": {
            "msg": "Команда <code>\\choose</code> является низкоуровневой командой TeX и <a href=\"https://tex.stackexchange.com/a/127711\">не рекомендуется</a> к использованию в LaTeX. Вместо <code>A \\choose B</code> пишите <code>\\binom{A}{B}</code>.",
            "severity": 0
        },
        "INVISIBLE_BRACES": {
            "msg": "Чтобы вывести на экран фигурные скобки, нужно написать <code>\\{…\\}</code>. Если писать просто <code>{…}</code>, скобки играют роль не символов, а «объединителей» TeX-овских команд. Кстати, в роли объединителей ими не нужно злоупотреблять; используйте их только при необходимости.",
            "severity": 0
        },
        "SETS_IN_BBFONT": {
            "msg": "Стандартные числовые множества (натуральные числа и пр.) нужно набирать специальным шрифтом: вместо <code>N</code> пишите <code>\\mathbb{N}</code>.",
            "severity": 0
        },
        "MANUAL_LISTS": {
            "msg": "Не следует вручную создавать нумерованные списки. Пишите так: <code>\\begin{enumerate}\\item Во-первых, \\item Во-вторых … \\end{enumerate}</code>.",
            "severity": 0
        },
        "MOD_NOT_A_COMMAND": {
            "msg": "Используйте команду <code>\\bmod</code> или <code>\\pmod</code>, чтобы mod был набран в формуле прямым шрифтом (как и подобает операции, а не произведению трёх переменных m, o и d).",
            "severity": 0
        },
        "TILDE_INEFFECTIVE_AS_NBSP": {
            "msg": "Значок <code>~</code> означает неразрывный пробел. Окружать его пробелами бессмысленно: неразрывность пропадает. Например, вместо <code>По формуле ~\\eqref{…</code> следует писать <code>По формуле~\\eqref{…</code>",
            "severity": 0
        },
        "LE_AS_SINGLE_COMMAND":  {
            "msg": "Чтобы набрать символ \\(\\le\\) или \\(\\ge\\), используйте команды <code>\\le</code> и <code>\\ge</code> соответственно. Стрелка \\(\\Leftarrow\\) набирается командой <code>\\Leftarrow</code>. Программистские сочетания <code><=</code> и <code>>=</code> ни в одной из ситуаций не годятся.",
            "severity": 0
        },
        "PUNCTUATION_AFTER_DISPLAY_MATH":  {
            "msg": "Если поставить знак препинания после выключной формулы, он будет отображён на другой строке. Поэтому при необходимости поставить, например, запятую сразу после выключной формулы, запятую следует сделать частью этой формулы.",
            "severity": 0
        },
        "BACKSLASH_NEEDED":  {
            "msg": "Слова \\(\\min\\), \\(\\max\\) и подобные в формулах являются именами математических операторов и должны набираться прямым шрифтом. В LaTeX есть команды <code>\\min</code>, <code>\\max</code>, <code>\\lim</code>, <code>\\deg</code>, и другие, которые делают эту работу за Вас. Список доступных стандартных команд см. по <a href=\"https://www.overleaf.com/learn/latex/Operators#Reference_guide\">ссылке</a>. Если такой команды ещё нет, используйте конструкцию типа <code>\\operatorname{min}</code> или, ещё лучше, <a href=\"https://tex.stackexchange.com/a/67529\">создайте свой оператор</a> командой <code>\\DeclareMathOperator</code> в преамбуле документа.",
            "severity": 0
        },
        "CDOT_FOR_READABILITY":  {
            "msg": "В произведениях чисел, обозначаемых отдельной буквой, и дробей или биномиальных коэффициентов, полезно для улучшения читабельности текста явно указывать произведение командой <code>\\cdot</code>.",
            "severity": 5
        },
        "GRAPHICS_IN_MATH_MODE":  {
            "msg": "Команда <code>\\includegraphics</code> не должна использоваться в математическом режиме без <em>крайней</em> необходимости. Чтобы отцентрировать рисунок, вместо помещения рисунка в выключную формулу используйте окружения <code>center</code> и <code>figure</code>.",
            "severity": 0
        },
        "UNNECESSARY_MATH_MODE": {
            "msg": "Если внутри формулы (в окружении долларов) стоит единственный символ и он не является буквой или цифрой — это тревожный знак. Скорее всего, либо в математический режим переходить было не нужно, либо без нужды на части была разорвана формула.",
            "severity": 0
        },
        "BETTER_TO_USE_WORDS_THEN_MATH": {
            "msg": "Конструкции наподобие <code>число элементов $=m^2$</code> недопустимы в письменном тексте, за исключением конспектов. Знаки \\(=, \\gt, \\geqslant\\) и др. нужно в этих случаях писать словами: <code>…не превосходит $m^2$</code>, <code>…равняется $m^2$</code> и т.д.",
            "severity": 0
        },
        "NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC":{
            "msg": "Хотя $\\LaTeX$ это и не считает ошибкой, не следует писать слитно команды ТеХа и кириллические слова.",
            "severity": 0
        },
        "TEXT_COMMANDS_IN_MATH_MODE": {
            "msg": "Текстовые команды <code>\\textbf</code>, <code>\\textit</code> и др. не следует использовать в математическом режиме. Для набора жирным шрифтом математических символов есть команда <code>\\mathbf</code>.",
            "severity": 0
        },
        "LIMITS_UNNECESSARY_IN_DISPLAY_MODE": {
            "msg": "Команда <code>\\limits</code> в выключных формулах обычно лишняя: пределы и без неё выставляются верно.",
            "severity": 0
        },
        "MATH_ENVIRONMENT_VERBOSITY_WARNING": {
            "msg": "Окружение <code>math</code> используется довольно редко. Лучше всего вместо него использовать более короткую (и абсолютно такую же по получаемому результату) конструкцию <code>\\(…\\)</code> или <code>$…$</code>. Часто также ошибочно полагают, что с помощью math оформляют <em>выключные</em> формулы — но это не так: внутри окружения math действует обычный inline-режим. Для оформления выключных формул подойдёт либо конструкция <code>\\[…\\]</code>, либо одно из окружений equation, array и др.",
            "severity": 0
        },
        "USE_DIVIDES_INSTEAD_OF_VDOTS": {
            "msg": "Команду <code>\\vdots</code> следует использовать только в матрицах или похожих окружениях для обозначения именно многоточия по вертикали. Когда речь идёт о делимости, вместо трёх точек (в качестве слов «делится на») используйте вертикальную черту (в качестве слов «является делителем»). Когда же рядом ещё вертикальные черта, например, в set builder notation, разумно вообще писать словами: <code>\\( A=\\{x\\in\\mathbb{N} \\mid x\\text{ кратен } 5\\} \\)</code>",
            "severity": 0
        },
        "FORMULA_NEIGHBOURING_REFERENCE": {
            "msg": "Плохо читается, когда формула непосредственно соседствует со ссылкой, без знаков препинания. Всегда можно вставить слово либо поменять порядок слов в предложении, чтобы этого избежать.",
            "severity": 0
        },
        "MAKE_LONG_FORMULA_DISPLAY": {
            "msg": "Подозрительно длинная формула набрана не в выключном режиме. Формулы, которые при компиляции не влезают целиком на одну строку (т.е. вся строка занята формулой и всё равно возникает перенос), нужно выключными, аккуратно их разбивая построчно с помощью окружений AMS: см. перечень подходящих окружений в <a href=\"https://www.overleaf.com/learn/latex/Aligning_equations_with_amsmath\">документе по ссылке</a>.",
            "severity": 0
        },
        "UNICODE_SQRT": {
            "msg": "Для квадратного корня следует использовать команду <code>\\sqrt</code> вместо символа UNICODE.",
            "severity": 0
        }
    }
};