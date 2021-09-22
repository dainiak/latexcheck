let inBrowser = typeof window !== "undefined";
function initiate() {

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

        let errors = this.errors = {
            'FIXME_NOT_YET_FIXED': {
                msg: 'В проверяющую систему не допускается загружать решения, которые всё ещё содержат исправления преподавателей (команду <code>\\fix</code>).',
                severity: 0
            },
            'DOUBLE_DOLLARS': {
                msg: 'Двойных долларов в тексте быть не должно. Выносные формулы нужно оформлять с помощью <code>\\[</code>…<code>\\]</code>. Объяснение см. по <a href="http://tex.stackexchange.com/questions/503/why-is-preferable-to">ссылке</a>.',
                severity: 0
            },
            'MISMATCHED_MATH_DELIMITERS': {
                msg: 'Возможно, где-то не закрыта формула знаком доллара, либо наоборот забыт доллар перед формулой.',
                severity: 0
            },
            'CONSECUTIVE_DISPLAY_FORMULAE': {
                msg: 'Обнаружены две идущие подряд выключные формулы. Такого быть не должно: используйте окружение <code>aligned</code> или его аналоги, чтобы грамотно оформить не умещающиеся на одной строке выкладки. Подробнее, например, по <a href="https://www.sharelatex.com/learn/Aligning_equations_with_amsmath">ссылке</a>.',
                severity: 0
            },
            'EQNARRAY_USED': {
                msg: 'Не используйте окружение <code>eqnarray</code> (подробности по <a href="https://tex.stackexchange.com/a/197">ссылке</a>). Вместо этого пользуйтесь, например, <code>align</code>.',
                severity: 0
            },
            'ABBREVIATIONS_WITH_SPACE': {
                msg: 'Сокращения типа <em>ч.т.д.</em>, <em>т.к.</em>, и подобные, следует оформлять с неразрывным пробелом <code>~</code> или так называемой <em>тонкой шпацией</em> <code>\\,</code> — это неразрывный пробел несколько меньшей ширины, нежели обычный. Например: <code>ч.\\,т.\\,д.</code>. В противном случае может случиться казус при переносе текста, когда часть сокращения останется на строке, а часть перейдёт на следующую. Тонкая шпация также смотрится лучше в этом случае, чем обычный пробел. Также её используют при наборе инициалов, например: <code>М.\\,В.~Ломоносов</code> или <code>М.\\,В.\\,Ломоносов</code>.',
                severity: 0
            },
            'DASH_HYPHEN': {
                msg: 'Возможно, перепутано тире с дефисом. Полноценное длинное тире ставится с помощью <code>---</code>, укороченное с помощью  <code>--</code>. Подробнее о тире, дефисах и подобном см. <a href="http://webstyle.sfu-kras.ru/tire-defis">здесь</a> и <a href="http://habrahabr.ru/post/20588/">здесь</a>. Ну и, конечно, никогда не поздно почитать <a href="https://www.artlebedev.ru/kovodstvo/sections/97/">А. Лебедева</a>.',
                severity: 0
            },
            'DASH_IN_MATH_MODE': {
                msg: 'Похоже, Вы хотели поставить дефис. Но когда знак дефиса попадает в математический режим, он становится минусом. Вывод: делать дефис не частью формулы, а частью следующего за ней текста.',
                severity: 0
            },
            'DASH_SURROUND_WITH_SPACES': {
                msg: 'Тире с двух сторон следует окружать пробелами. Особенный шик — один или оба из пробелов сделать неразрывными, чтобы тире не «повисало на краю пропасти» при переносе строки. Подробнее о тире, дефисах и подобном см. <a href="http://webstyle.sfu-kras.ru/tire-defis">здесь</a> и <a href="http://habrahabr.ru/post/20588/">здесь</a>. Ну и, конечно, никогда не поздно почитать <a href="https://www.artlebedev.ru/kovodstvo/sections/97/">А. Лебедева</a>.',
                severity: 0
            },
            'NUMERAL_ABBREVIATION': {
                msg: 'Нарушены <a href="http://new.gramota.ru/spravka/letters/22-spravka/letters/87-rubric-99">правила сокращения порядковых числительных</a>.',
                severity: 0
            },
            'LATE_DEFINITION': {
                msg: 'Вместо того, чтобы писать <q><code>$x=a+b$</code>, где <code>$a=…</code></q> сначала лучше ввести все буквы и лишь затем записать выражение, эти буквы содержащие. См. <a href="https://doc.co/pgnsVw">статью П. Халмоша</a>, раздел «Правильно используйте слова».',
                severity: 0
            },
            'PARAGRAPH_BREAK_BEFORE_DISPLAY_FORMULA': {
                msg: 'Пустая строка заставляет \\(\\LaTeX\\) начинать новый параграф, даже если эта пустая строка стоит прямо перед выключной формулой. Чаще всего это не нужно, так как параграфы по смыслу не следует начинать с формул, а выключную формулу \\(\\LaTeX\\) в любом случае окаймляет достаточным количеством пустого пространства.',
                severity: 0
            },
            'UNNECESSARY_FORMULA_BREAK': {
                msg: 'Возможно, некоторые формулы следовало объединить. Например, вместо <code>$x$, $y$ $\\in$ $A$</code> пишите <code>$x,\\,y\\in A$</code>; вместо <code>$a$ = $b+c$</code> пишите <code>$a=b+c$</code> и т.д.',
                severity: 0
            },
            'CENTERING': {
                msg: 'Центрирование явно используется только при включении рисунков и таблиц. Иногда для заголовков. Для обычных формул центрирование не используется, вместо этого следует делать выключные формулы.',
                severity: 0
            },
            'LOW_LEVEL_FONT_COMMANDS': {
                msg: 'Вместо низкоуровневых команд <code>{\\it …}</code>, <code>{\\bf …}</code> используйте команды <code>\\textit{…}</code> <code>\\textbf{…}</code> (подробности см. по <a href="http://tex.stackexchange.com/questions/41681/correct-way-to-bold-italicize-text">ссылке</a>.)'
                    + 'Кроме того, выделять текст лучше не курсивом, а более гибкой командой <code>\\emph{…}</code>, поскольку она корректно сработает даже внутри курсивного блока.',
                severity: 0
            },
            'ITALIC_INSTEAD_OF_EMPH': {
                msg: 'Выделять текст лучше не курсивом, а более гибкой командой <code>\\emph{…}</code>, поскольку она корректно сработает даже внутри курсивного блока.',
                severity: 0
            },
            'WRONG_QUOTES': {
                msg: 'Для закавычивания слов «клавиатурные» кавычки <code>"…"</code> в LaTeX не используются. Если нужно закавычить слово, делайте это одним из способов <code>``…\'\'</code> (два апострофа на букве ё вначале и два на букве э в конце) или <code><<…>></code> (два знака меньше и два знака больше).',
                severity: 0
            },
            'WRONG_SAME_QUOTES': {
                msg: 'Открывающие и закрывающие кавычки ставится по-разному: непривильно делать <code>\'\'…\'\'</code> или <code>``…``</code>, следует делать <code>``…\'\'</code> для закавычивания в англоязычном тексте. В русской типографике применяются французские <code><<кавычки-ёлочки>></code>, для вложенных кавычек — немецкие <code>,,кавычки-лапки``</code>.',
                severity: 0
            },
            'QUOTES_IN_MATH': {
                msg: 'Обнаружен символ кавычки в математическом режиме. Если Вы хотели поставить двойной штрих над математическим символом, наберите два штриха подряд: <code>y\'\'</code>.',
                severity: 0
            },
            'LATIN_LETTER_OUTSIDE_MATH': {
                msg: 'Даже одна буква, если у неё математический смысл — должна быть заключена в доллары.',
                severity: 0
            },
            'MATH_SEMANTICS_OUTSIDE_MATH': {
                msg: 'Команды, печатающие символы, имеющие математическую природу, настоятельно рекомендуется использовать в математическом режиме, даже если они работают и без оного.',
                severity: 0
            },
            'LATIN_LETTER_C_MISUSED': {
                msg: 'Возможно, использована случайно латинская буква с (це) вместо русского предлога <strong>с</strong> посреди текста на русском языке.',
                severity: 0
            },
            'CYRILLIC_LETTER_C_MISUSED': {
                msg: 'Возможно, использована случайно кириллическая буква <strong>с</strong> вместо латинской буквы <strong>c</strong> (це) внутри фоормулы.',
                severity: 0
            },
            'FLOOR_FUNCTION_NOTATION': {
                msg: 'В современной литературе принято целую часть числа x обозначать <code>\\lfloor x\\rfloor</code>, а не <code>[x]</code>.',
                severity: 0
            },
            'MULTIPLICATION_SIGN': {
                msg: 'Знак <code>*</code> используется для обозначения умножения в программировании, но не в математике. Пользуйтесь командой <code>\\cdot</code> или <code>\\times</code> (последней в особых случаях).',
                severity: 0
            },
            'SPACE_BEFORE_PUNCTUATION_MARK': {
                msg: 'Пробелы перед двоеточием, запятой, точкой, восклицательным и вопросительными знаками, точкой с запятой не ставятся.',
                severity: 0
            },
            'SPACE_BEFORE_PARENTHESES': {
                msg: 'В тексте перед открывающей скобкой ставится пробел.',
                severity: 0
            },
            'SPACE_AFTER_PUNCTUATION_MARK': {
                msg: 'После двоеточия, запятой, точки, точки с запятой, восклицательного и вопросительного знаков нужно ставить пробел.',
                severity: 0
            },
            'SPACE_AFTER_PARENTHESIS': {
                msg: 'После открывающей скобки не следует ставить пробел.',
                severity: 0
            },
            'CAPITALIZATION_AFTER_PUNCTUATION_MARK': {
                msg: 'После двоеточия, точки с запятой, запятой, не должно начинаться новое предложение.',
                severity: 0
            },
            'CAPITALIZATION_AFTER_PERIOD': {
                msg: 'Предложение следует начинать с заглавной буквы.',
                severity: 0
            },
            'PERIOD_BEFORE_NEXT_SENTENCE': {
                msg: 'В конце предложения должна ставиться точка, даже если предложение заканчивается формулой.',
                severity: 0
            },
            'LEFT_RIGHT_RECOMMENDED': {
                msg: 'Когда при наборе формул возникает необходимость поставить скобки (круглые/фигурные/квадратные) или знак модуля вокруг высокой подформулы (дроби, биномиального коэффициента, суммы с пределами), рекомендуется добавлять команды <code>\\left</code> и <code>\\right</code>. Особенно это актуально для выключных формул. Например, сравните, как нелепо выглядит в PDF скомпилированная формула <code>\\[(\\frac{a}{b})^2\\]</code> и как естественен её «правильный» вариант <code>\\[\\left(\\frac{a}{b}\\right)^2\\]</code>. Тем не менее, переусердствовать здесь тоже не стоит: добавляйте <code>\\left…  … \\right…</code> только тогда, когда видите явное несоответствие между высотой скобок и высотой того, что они окружают. Подробности по <a href="http://tex.stackexchange.com/a/58641">ссылке</a>. Можно также воспользоваться командой <a href="http://tex.stackexchange.com/a/1765"><code>\\DeclarePairedDelimiter</code></a> из библиотеки mathtools.',
                severity: 10
            },
            'NUMERALS_AS_WORDS': {
                msg: 'Со стилистической точки зрения, числительные, не превосходящие пяти и окружённые текстом, часто лучше писать не цифрами, а словами. Например, <em>Рассмотрим 2 случая</em> смотрится хуже, чем <em>Рассмотрим два случая</em>.',
                severity: 10
            },
            'MID_IN_SET_COMPREHENSION': {
                msg: 'При описании множеств вертикальная черта ставится командой <code>\\mid</code>. '
                    + 'Например, <code>\\{x^2\\mid x\\in\\mathbb{Z}\\}</code>. '
                    + 'И, наоборот, <code>\\mid</code> НЕ используется в остальных контекстах, например, при обозначении модуля числа. Для обозначения последнего пишите <code>\\lvert x \\rvert</code>.',
                severity: 0
            },
            'SYMBOLIC_LINKS': {
                msg: 'Пользуйтесь символическими ссылками, например: <code>Заметим, что \\begin{equation}\\label{eqSquares} a^2-b^2=(a-b)(a+b). \\end{equation} Из равенства~\\eqref{eqSquares}, следует, что…</code>.',
                severity: 0
            },
            'EQREF_INSTEAD_OF_REF': {
                msg: 'Вместо <code>(\\ref{…})</code> следует писать <code>\\eqref{…}</code>',
                severity: 0
            },
            'NONBREAKABLE_SPACE_BEFORE_REF': {
                msg: 'Перед командами <code>\\ref</code>, <code>\\eqref</code> рекомендуется ставить тильду, чтобы номер ссылки был приклеен неразрывным пробелом, например: <code>…Согласно~\\eqref{eqMaxwell}, имеем…</code>.',
                severity: 0
            },
            'ELLIPSIS_LDOTS': {
                msg: 'В математическом режиме многоточие ставится не <code>...</code>, а командой <code>\\ldots</code>. При наличии пакета amsmath, когда многоточие нужно вставить между запятыми в перечислении объектов, используйте команду <code>\\dotsc</code>.',
                severity: 0
            },
            'SUGGESTED_NEW_PARAGRAPH': {
                msg: 'Чтобы начать с новой строки формулу, она делается выключной. Чтобы начать новый параграф текста, используется команда <code>\\par</code> в текстовом режиме. Использовать же несемантичный перенос <code>\\\\</code>, помимо окружений типа <code>tabular</code>, следует только в крайних случаях.',
                severity: 0
            },
            'TRIVIAL_LABEL': {
                msg: 'Символические ссылки нужно делать, но нет большого смысла делать тривиальные описания типа <code>\\label{eq1}</code>. '
                    + 'Так же, как в программировании называть переменную <code>var1</code> чаще всего пагубно. '
                    + 'Куда лучше придумать осмысленное название, например <code>eqCauchy</code>, <code>eqBinomialSymmetry</code>, <code>eqMain</code> (если это действительно самая важная формула в доказательстве) и т.д.',
                severity: 5
            },
            'REPLACE_MBOX_WITH_TEXT': {
                msg: 'Для вставки текста внутрь формулы вместо команд <code>\\mbox</code> и <code>\\hbox</code> пользуйтесь командой <code>\\text</code>. Объяснение см. по <a href="http://tex.stackexchange.com/questions/70632/difference-between-various-methods-for-producing-text-in-math-mode">ссылке</a>.',
                severity: 0
            },
            'TEXT_IN_MATH_MODE': {
                msg: 'Для вставки текста внутрь формулы (даже если слова на латинице, но не являются именами математических объектов) вместо команд пользуйтесь командой <code>\\text</code>, например: <code>Рассмотрим множество $A_{\\text{хорошие}}$</code>.',
                severity: 0
            },
            'NO_CONCLUSION': {
                msg: 'Обычно решение задачи или доказательство теоремы не заканчивают рисунком или формулой. Полезно добавить в конце хотя бы какое-то заключение, например: <code>Теорема доказана.</code>, <code>В итоге мы получили ответ: искомое количество равно $42$.</code> и т.д.',
                severity: 5
            },
            'INCORPORATE_NOT': {
                msg: 'Хотя префикс <code>\\not</code> позволяет из многих значков получить значок-отрицание, часто короче (и <a href="http://tex.stackexchange.com/a/141011">рекомендуется</a>!) писать одной командой. '
                    + 'Например, вместо <code>\\not=</code> можно написать <code>\\ne</code>, вместо <code>\\not\\in</code> написать <code>\\notin</code> и т.д. '
                    + 'По <a href="https://goo.gl/RQUTQ9">ссылке</a> доступен список часто используемых значков с отрицанием.',
                severity: 0
            },
            'PARAGRAPH_STARTS_WITH_FORMULA': {
                msg: 'Параграф не следует начинать с формулы. Если Вы хотите, чтобы формула была на отдельной строке, а не в тексте, сделайте её выносной: <code>\\[…\\]</code>.',
                severity: 0
            },
            'SENTENCE_STARTS_WITH_FORMULA': {
                msg: 'Предложение не следует начинать с формулы. Всегда можно добавить вначале слово. Например, вместо предложения <code>$G$ связен.</code> напишите <code>Граф $G$ связен.</code>',
                severity: 0
            },
            'RUSSIAN_TYPOGRAPHY_PECULIARITIES': {
                msg: 'Строго говоря, это не является ошибкой, но в отечественной типографской традиции принято пустое множество обозначать значком <code>\\varnothing</code>, а не <code>\\emptyset</code> (последний более приплюснутый). '
                    + 'Аналогично, вместо <code>\\epsilon</code> лучше писать <code>\\varepsilon</code>, а вместо <code>\\phi</code> писать <code>\\varphi</code>.',
                severity: 0
            },
            'OVER_VS_FRAC': {
                msg: 'Команда <code>\\over</code> является низкоуровневой командой TeX и <a href="http://tex.stackexchange.com/a/73825">не рекомендуется</a> к использованию в LaTeX. Вместо <code>A \\over B</code> пишите <code>\\frac{A}{B}</code>.',
                severity: 0
            },
            'CHOOSE_VS_BINOM': {
                msg: 'Команда <code>\\choose</code> является низкоуровневой командой TeX и <a href="http://tex.stackexchange.com/a/127711">не рекомендуется</a> к использованию в LaTeX. Вместо <code>A \\choose B</code> пишите <code>\\binom{A}{B}</code>.',
                severity: 0
            },
            'INVISIBLE_BRACES': {
                msg: 'Чтобы вывести на экран фигурные скобки, нужно написать <code>\\{…\\}</code>. Если писать просто <code>{…}</code>, скобки играют роль не символов, а «объединителей» TeX-овских команд. '
                    + 'Кстати, в роли объединителей ими не нужно злоупотреблять; используйте их только при необходимости.',
                severity: 0
            },
            'SETS_IN_BBFONT': {
                msg: 'Стандартные числовые множества (натуральные числа и пр.) нужно набирать специальным шрифтом: вместо <code>N</code> пишите <code>\\mathbb{N}</code>.',
                severity: 0
            },
            'MANUAL_LISTS': {
                msg: 'Не следует вручную создавать нумерованные списки. Пишите так: <code>\\begin{enumerate}\\item Во-первых, \\item Во-вторых … \\end{enumerate}</code>.',
                severity: 0
            },
            'MOD_NOT_A_COMMAND': {
                msg: 'Используйте команду <code>\\bmod</code> или <code>\\pmod</code>, чтобы mod был набран в формуле прямым шрифтом (как и подобает операции, а не произведению трёх переменных m, o и d).',
                severity: 0
            },
            'TILDE_INEFFECTIVE_AS_NBSP': {
                msg: 'Значок <code>~</code> означает неразрывный пробел. Окружать его пробелами бессмысленно: неразрывность пропадает. Например, вместо <code>По формуле ~\\eqref{…</code> следует писать <code>По формуле~\\eqref{…</code>',
                severity: 0
            },
            'LE_AS_SINGLE_COMMAND':  {
                msg: 'Чтобы набрать символ \\(\\le\\) или \\(\\ge\\), используйте команды <code>\\le</code> и <code>\\ge</code> соответственно. Стрелка \\(\\Leftarrow\\) набирается командой <code>\\Leftarrow</code>. Программистские сочетания <code><=</code> и <code>>=</code> ни в одной из ситуаций не годятся.',
                severity: 0
            },
            'PUNCTUATION_AFTER_DISPLAY_MATH':  {
                msg: 'Если поставить знак препинания после выключной формулы, он будет отображён на другой строке. Поэтому при необходимости поставить, например, запятую сразу после выключной формулы, запятую следует сделать частью этой формулы.',
                severity: 0
            },
            'BACKSLASH_NEEDED':  {
                msg: 'Слова \\(\\min\\), \\(\\max\\) и подобные в формулах являются именами математических операторов и должны набираться прямым шрифтом. В LaTeX есть команды <code>\\min</code>, <code>\\max</code>, <code>\\lim</code>, <code>\\deg</code>, и другие, которые делают эту работу за Вас. Список доступных стандартных команд см. по <a href="https://www.sharelatex.com/learn/Operators#Reference_guide">ссылке</a>. Если такой команды ещё нет, используйте конструкцию типа <code>\\operatorname{min}</code> или, ещё лучше, <a href="http://tex.stackexchange.com/a/67529">создайте свой оператор</a> командой <code>\\DeclareMathOperator</code> в преамбуле документа.',
                severity: 0
            },
            'CDOT_FOR_READABILITY':  {
                msg: 'В произведениях чисел, обозначаемых отдельной буквой, и дробей или биномиальных коэффициентов, полезно для улучшения читабельности текста явно указывать произведение командой <code>\\cdot</code>.',
                severity: 5
            },
            'GRAPHICS_IN_MATH_MODE':  {
                msg: 'Команда <code>\\includegraphics</code> не должна использоваться в математическом режиме без <em>крайней</em> необходимости. Чтобы отцентрировать рисунок, вместо помещения рисунка в выключную формулу используйте окружения <code>center</code> и <code>figure</code>.',
                severity: 0
            },
            'UNNECESSARY_MATH_MODE': {
                msg: 'Если внутри формулы (в окружении долларов) стоит единственный символ и он не является буквой или цифрой — это тревожный знак. Скорее всего, либо в математический режим переходить было не нужно, либо без нужды на части была разорвана формула.',
                severity: 0
            },
            'BETTER_TO_USE_WORDS_THEN_MATH': {
                msg: 'Конструкции наподобие <code>число элементов $=m^2$</code> недопустимы в письменном тексте, за исключением конспектов. Знаки \\(=, \\gt, \\geqslant\\) и др. нужно в этих случаях писать словами: <code>…не превосходит $m^2$</code>, <code>…равняется $m^2$</code> и т.д.',
                severity: 0
            },
            'NO_SPACE_AFTER_COMMAND_BEFORE_CYRILLIC':{
                msg: 'Хотя $\\LaTeX$ это и не считает ошибкой, не следует писать слитно команды ТеХа и кириллические слова.',
                severity: 0
            },
            'TEXT_COMMANDS_IN_MATH_MODE': {
                msg: 'Текстовые команды <code>\\textbf</code>, <code>\\textit</code> и др. не следует использовать в математическом режиме. Для набора жирным шрифтом математических символов есть команда <code>\\mathbf</code>.',
                severity: 0
            },
            'LIMITS_UNNECESSARY_IN_DISPLAY_MODE': {
                msg: 'Команда <code>\\limits</code> в выключных формулах обычно лишняя: пределы и без неё выставляются верно.',
                severity: 0
            },
            'MATH_ENVIRONMENT_VERBOSITY_WARNING': {
                msg: 'Окружение <code>math</code> используется довольно редко. Лучше всего вместо него использовать более короткую (и абсолютно такую же по получаемому результату) конструкцию <code>\\(…\\)</code> или <code>$…$</code>. Часто также ошибочно полагают, что с помощью math оформляют <em>выключные</em> формулы — но это не так: внутри окружения math действует обычный inline-режим. Для оформления выключных формул подойдёт либо конструкция <code>\\[…\\]</code>, либо одно из окружений equation, array и др.',
                severity: 0
            },
            'USE_DIVIDES_INSTEAD_OF_VDOTS': {
                msg: 'Команду <code>\\vdots</code> следует использовать только в матрицах или похожих окружениях для обозначения именно многоточия по вертикали. Когда речь идёт о делимости, вместо трёх точек (в качестве слов «делится на») используйте вертикальную черту (в качестве слов «является делителем»). Когда же рядом ещё вертикальные черта, например, в set builder notation, разумно вообще писать словами: <code>\\( A=\\{x\\in\\mathbb{N} \\mid x\\text{ кратен } 5\\} \\)</code>',
                severity: 0
            },
            'FORMULA_NEIGHBOURING_REFERENCE': {
                msg: 'Плохо читается, когда формула непосредственно соседствует со ссылкой, без знаков препинания. Всегда можно вставить слово либо поменять порядок слов в предложении, чтобы этого избежать.',
                severity: 0
            },
            'MAKE_LONG_FORMULA_DISPLAY': {
                msg: 'Подозрительно длинная формула набрана не в выключном режиме. Формулы, которые при компиляции не влезают целиком на одну строку (т.е. вся строка занята формулой и всё равно возникает перенос), нужно выключными, аккуратно их разбивая построчно с помощью окружений AMS: см. перечень подходящих окружений на стр. 2 в <a href="http://goo.gl/WywBQT">документе по ссылке</a>.',
                severity: 0
            }
        };
        let used_errcodes = {};
        if (!addWarningCustom) {
            // This var will be visible to the code below.
            let rda = $('#result_display_area');
            rda.html('');
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
            if (codeFragment){
                codeFragment = '<br><span class="badge bg-light bg-gradient text-dark"'
                        + (lineNumber ? ' onclick="hlAceLine(' + lineNumber + ')"': '')
                        +'>Подозрительный фрагмент: <code>…' + codeFragment + '…</code>'
                        + (lineNumber ? ' (строка ' + lineNumber + ' в редакторе)' : '')
                        + '</span>';
            }

            if(!used_errcodes[errorCode]) {
                let severity = errors[errorCode].severity.toString();
                let rda = $('#result_display_area');
                rda.html(rda.html() + '<div class="p-2 border severity' + severity + '" id="' + errorCode + '" data-severity="' + severity +'">' + (extraInfo ? extraInfo : errors[errorCode].msg) + '</div>');
                used_errcodes[errorCode] = $('#' + errorCode);
            }
            let errorMessage = used_errcodes[errorCode];

            if (codeFragment) {
                errorMessage.html(errorMessage.html() + codeFragment);
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
            if(fragmentType === 'math') {
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
            else {
                for (let i = 0; i < textFragments.length; ++i) {
                    let badPos = textFragments[i].search(badness);
                    if (badPos >= 0){
                        addTypicalWarning(errorCode, 'text', i, badPos);
                    }
                }
            }
        }


        /* STAGE: Check if there are no teacher fixmes left */
        let badPos = latexString.search(/\\fix{/);
        if (badPos >= 0){
            addWarning('FIXME_NOT_YET_FIXED', null, '\\fix{', latexString.substring(0,badPos).split('\n').length-1);
        }

        /* STAGE: Check math delimiters */
        badPos = latexString.search(/\${2}/);
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
                            'Команда <code>' + nextTwoSymbols + '</code> встречена в математическом режиме, открытом ранее командой <code>' + lastSeenBrace + '</code>');
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
                            'Команда <code>' + nextTwoSymbols + '</code> встречена в математическом режиме, открытом ранее командой <code>' + lastSeenBrace + '</code>');
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
                            'Команда <code>' + nextTwoSymbols + '</code> встречена в текстовом режиме, а должна была закрывать математический.');
                    break;
                }
                if (nextTwoSymbols === '\\]' && lastSeenBrace !== '\\[' || nextTwoSymbols === '\\)' && lastSeenBrace !== '\\(' ) {
                    addWarning(
                            'MISMATCHED_MATH_DELIMITERS',
                            'Математический режим был открыт командой <code>' + lastSeenBrace + '</code>, а закрыт командой <code>' + nextTwoSymbols + '</code>');
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
                            'Математический режим был открыт командой <code>' + lastSeenBrace + '</code>, а закрыт командой <code>$</code>');
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

        /* STAGE: check if numerals are properly abbreviated */
        badPos = latexString.search(/(\\\)|\$)?\s*-{1,3}\s*(ый|ого|о|тому|ому|ему|ом|ая|ой|ую|ые|ыми|и|ым|тым|той|им|его|того|тых|ых|том|ем|ём|ех|ёх|ух)([^абвгдеёжзиклмнопрстуфхцчшщьыъэюя]|$)/i);
        if (badPos >= 0) {
            addWarning('NUMERAL_ABBREVIATION', null, extractSnippet(latexString, badPos), findLine(badPos));
        }

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


        /* STAGE: check for includegraphics in math mode */
        addWarningQuick('math', /\\includegraphics/, 'GRAPHICS_IN_MATH_MODE');


        /* STAGE: check quotation marks */
        addWarningQuick('text', /"/, 'WRONG_QUOTES');
        addWarningQuick('math', /"/, 'QUOTES_IN_MATH');
        addWarningQuick('text', /(''[^']+'')|('[^']+')|(``[^']+``)|(`[^']+`)|(''[^']+``)/, 'WRONG_SAME_QUOTES');

        /* STAGE: check latin letters outside math mode */
        addWarningQuick('text', /([^\\]\\(\\|newline)[^\\])/, 'SUGGESTED_NEW_PARAGRAPH');

        /* STAGE: check latin letters outside math mode */
        addWarningQuick('text', /(^|[,. ~])[a-zA-Z]($|[,.:!? ~-])/, 'LATIN_LETTER_OUTSIDE_MATH');

        /* STAGE: check typical math commands outside math mode */
        addWarningQuick('text', /(\\infty)/, 'MATH_SEMANTICS_OUTSIDE_MATH');

        /* STAGE: check if latin letter c accidentially used instead of cyrillic letter с and vice versa*/
        addWarningQuick('text', /[абвгдеёжзиклмнопрстуфхцчшщьыъэюя ]\s+c\s+[абвгдеёжзиклмнопрстуфхцчшщьыъэюя ]/i, 'LATIN_LETTER_C_MISUSED');
        addWarningQuick('math', /(^|[^ абвгдеёжзиклмнопрстуфхцчшщьыъэюя])[с]($|[^ абвгдеёжзиклмнопрстуфхцчшщьыъэюя])/i, 'CYRILLIC_LETTER_C_MISUSED');


        addWarningQuick('math', /-$/, 'DASH_IN_MATH_MODE');

        /* STAGE: check if hyphen is used where dash should be */
        addWarningQuick('text', ' - ', 'DASH_HYPHEN');

        /* STAGE: check if hyphen is used where dash should be */
        addWarningQuick('text', /ч\. т\.|т\. н\.|т\. ч\.|т\. к\./, 'ABBREVIATIONS_WITH_SPACE');


        /* STAGE: check if dash is surrounded with spaces */
        addWarningQuick('text', /--[^- ~\n]|[^- ~\n]--/, 'DASH_SURROUND_WITH_SPACES');


        /* STAGE: check for correct floor function notation */
        addWarningQuick('math', /\[[^\[\],;]+]/, 'FLOOR_FUNCTION_NOTATION');


        /* STAGE: check for incorrect multiplication sign */
        addWarningQuick('math', /[^{^_]\*/, 'MULTIPLICATION_SIGN');
        addWarningQuick('text', /[^{^_]\*/, 'MULTIPLICATION_SIGN');


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

        let rda = $('#result_display_area');
        if (addWarningCustom === undefined && rda.html() === '') {
            rda.text('Замечательный результат: автоматическая проверка пройдена без замечаний.');
        }
    }

    function checkLatexCodeExport(latexString) {
        let used_errcodes = {};
        function addWarning(errorCode, extraInfo, codeFragment, lineNumber) {
            if (!used_errcodes[errorCode]) {
                used_errcodes[errorCode] = {
                    severity: this.errors[errorCode].severity,
                    extraInfo: (extraInfo ? extraInfo : this.errors[errorCode].msg),
                    codeFragments: []
                };
            }
            used_errcodes[errorCode].codeFragments.push({code: codeFragment, line: lineNumber});
        }
        checkLatexCode(latexString, addWarning);
        return used_errcodes;
    }

    if (inBrowser) {
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

    $('#btn_check').click(function(){
        $('#result_display_area').addClass('flex');
        checkLatexCode(editor.getValue());
        MathJax.typeset([document.querySelector('#result_display_area')]);
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

        let rda = $('#result_display_area');
        rda.text(v);
        MathJax.typesetPromise([document.querySelector('#result_display_area')]).then(() => {
            let v = rda.html();
            v = v
                .replace(/\\par/g, '<br>')
                .replace('((beginTask))', '<span class="badge">Условие задачи</span>')
                .replace('((beginSolution))', '<span class="badge">Решение</span>');
            $('#result_display_area').html(v);
        });
    }

    $('#btn_try_typeset').click(function(){
        $('#result_display_area').removeClass('flex');
        typesetWithProcessing();
    });
    } else {
        exports.checkLatexCode = checkLatexCodeExport;
    }
}

if (inBrowser) {
    $(initiate);
} else {
    initiate();
}
