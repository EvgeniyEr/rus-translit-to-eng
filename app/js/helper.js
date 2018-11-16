"use strict";

var helper = {
    /**
     * Выполняет транслитерацию русского текста в английский для Яндекс-поисковика.
     * Правила транслитерации русских букв: https://yandex.ru/support/nmaps/app_transliteration.html
     * Дополнительные проблемы: https://yandex.ru/blog/narod-karta/dopolnenie-k-pravilam-transliteratsii-russkikh-bukv
     *
     * Слова по умолчанию разделяются символом '-' и выводятся в нижнем регистре.
     *
     * Икслючения при транлитерации:
     * 'Ъ' не  пишется, кроме: 'ъе' -> 'ye'
     * 'Ы' -> 'Y' Как исключение, в окончаниях: 'ый' -> 'iy' (аналогично окончанию 'ий' -> 'iy')
     * 'Ь' опускается в конце слова;
     * сочетания  [ь + гласная] -> [y + гласная] (кроме Ё, Ю, Я)
     *
     * @param {string} str Строка для замены;
     * @param {bool} isLowerCase Флаг перевода результата в нихний регистр;
     * @param {string} wordSeparator Разделитель слов. Строка, которой будут заменены пробельные символы
     * @return {string}
     */
    rusTranslitToEng: function (str, isLowerCase, wordSeparator) {
        str = str || '';
        isLowerCase = isLowerCase || true;
        wordSeparator = wordSeparator || '-';

        var translitToEng = {
            А: 'A', Б: 'B', В: 'V', Г: 'G', Д: 'D', Е: 'E', Ё: 'YO', Ж: 'ZH', З: 'Z', И: 'I', Й: 'Y',
            К: 'K', Л: 'L', М: 'M', Н: 'N', О: 'O', П: 'P', Р: 'R', С: 'S', Т: 'T', У: 'U', Ф: 'F',
            Х: 'KH', Ц: 'TS', Ч: 'CH', Ш: 'SH', Щ: 'SCH', Ъ: '', Ы: 'Y', Ь: '', Э: 'E', Ю: 'YU', Я: 'YA',
            а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'yo', ж: 'zh', з: 'z', и: 'i', й: 'y',
            к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
            х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'sch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya'
        };
        if (isLowerCase) {
            str = str.toLowerCase();
        }

        // Все кроме этих символов будут заменены на символ разделитель слова
        str = str.replace(/[^a-zA-Zа-яёА-ЯЁ0-9_]+/g, wordSeparator);

        // Удаляем первый и последний разделитель слов в строке
        var regex = new RegExp('^' + wordSeparator + '|' + wordSeparator + '$', 'g');
        str = str.replace(regex, '');


        // Обработка исключений ----------------------------------------
        // 'Ъ' не  пишется, кроме: 'ъе' транслируется в 'ye'
        str = str.replace(/ъе/g, 'ye');

        // Окончание 'ый' транслируется в 'iy' (аналогично окончание 'ий' в 'iy')
        regex = new RegExp('ый' + wordSeparator + '|ий' + wordSeparator, 'g');
        str = str.replace(regex, 'iy' + wordSeparator);
        str = str.replace(/ый$|ий$/g, 'iy'); // Для конца предложения

        // сочетания  [ь + гласная] транслируется в [y + гласная] (кроме Ё, Ю, Я)
        str = str.replace(/ь([аоуыиэеАОУЫИЭЕ])/g, 'y$1');

        if (!isLowerCase) {
            // Тогда нужно проверить эти же исключения для верхнего регистра
            str = str.replace(/ЪЕ/g, 'YE');
            str = str.replace(/ъЕ/g, 'yE');
            str = str.replace(/Ъе/g, 'Ye');

            regex = new RegExp('ЫЙ' + wordSeparator + '|ИЙ' + wordSeparator, 'g');
            str = str.replace(regex, 'IY' + wordSeparator);

            regex = new RegExp('ыЙ' + wordSeparator + '|иЙ' + wordSeparator, 'g');
            str = str.replace(regex, 'iY' + wordSeparator);

            regex = new RegExp('Ый' + wordSeparator + '|Ий' + wordSeparator, 'g');
            str = str.replace(regex, 'Iy' + wordSeparator);

            str = str.replace(/ЫЙ$|ИЙ$/g, 'IY');
            str = str.replace(/ыЙ$|иЙ$/g, 'iY');
            str = str.replace(/Ый$|Ий$/g, 'Iy');

            str = str.replace(/Ь([аоуыиэеАОУЫИЭЕ])/g, 'Y$1');
        }
        // ------------------------------------------------------------

        str = str.replace(/[а-яёА-ЯЁ]/g, function (a) {
            return translitToEng[a];
        });
        return str;
    },
};
