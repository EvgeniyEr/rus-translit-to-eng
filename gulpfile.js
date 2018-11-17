//Подключение установленных модулей
var gulp = require('gulp'),
    runSequence = require('run-sequence'), //Выполняет последовательность задач gulp в указанном порядке
    sass = require('gulp-sass'),
    concat = require('gulp-concat'), //Объединение файлов, в том порядке, в котором перечислены в src()
    uglify = require('gulp-uglify'), //Сжатие js
    browserSync = require('browser-sync'),
    del = require('del'), //Удаление файлов и каталогов
    cleanCSS = require('gulp-clean-css'), //Сжатие css файла
    rename = require('gulp-rename'), //Переименование файла
    autoprefixer = require('gulp-autoprefixer'),
    gulpif = require('gulp-if'), //Создание условий
    argv = require('yargs').argv, //Возможность передать параметр в командной строке
    htmlreplace = require('gulp-html-replace'),
    rename = require("gulp-rename");

/* -------------------------------------------------------------------------------------------------
 * Команды для запуска (если gulp установлен глобально):
 *
 * gulp                      сборка сайта development
 * gulp --prod               сборка сайта production
 *
 -------------------------------------------------------------------------------------------------- */
var mode = argv.prod ? 'production' : 'development';
console.log('Сборка в режиме: ' + mode);

/* -----------------------------------------------------------------------------------------------  */
gulp.task('default', function () {
    runSequence('browser-sync', 'build', 'watch');
});

/* -----------------------------------------------------------------------------------------------  */
gulp.task('browser-sync', function () {
    browserSync({
        server: {
            baseDir: "build", //Базовая директория для сервера
            index: 'index.html' //Открывает первым (по умолчанию)
        },
        notify: false //Отключаем уведомления браузера
    });
});

/* ------------------------------------------------------------------------------------------------ */
//Перед build задачей запускаются задачи, указанные в массиве ('del-build' и так далее в той же последовательности,
//как указано в массиве)
gulp.task('build', ['del-build', 'html', 'styles', 'scripts']);

/* ------------------------------------------------------------------------------------------------ */
gulp.task('watch', function () {
    //При изменении в файлах, а также при добавлении или удалении файла, будут выполняться task
    gulp.watch('app/**/*.scss', ['styles']);
    gulp.watch('app/**/*.js', ['del-js', 'scripts']);

    //При изменении файлов html будут выполнятся следующие task
    gulp.watch('app/*.html', ['html', 'bs-reload']);
});

/* ------------------------------------------------------------------------------------------------ */
// Reload all Browsers (обновление всех страниц)
gulp.task('bs-reload', function () {
    browserSync.reload();
});

/* ------------------------------------------------------------------------------------------------ */
gulp.task('del-build', function () {
    del.sync(['build/']);
});

/* ------------------------------------------------------------------------------------------------ */
gulp.task('del-js', function () {
    del.sync(['build/js/']);
});

/* ------------------------------------------------------------------------------------------------ */
gulp.task('html', function () {
    return gulp.src('app/*.html') //Берем из источника
        //В продакшн подключение всех js, перечисленных в секции 'build:js' в файлах *.html будет заменено
        //на одно подключение
        .pipe(gulpif(argv.prod, htmlreplace({
            js: {
                src : null, // Отсутствуют подстановки в шаблон tpl
                tpl: '<script src="js/bundle.min.js" defer></script>'
            }
        })))
        .pipe(gulp.dest('build/')); //Выгружаем результата в папку build/
});

/* ------------------------------------------------------------------------------------------------ */
gulp.task('styles', function () {
    return gulp.src([
        'app/sass/style.scss'
    ])
        .pipe(sass()) //Преобразуем Sass в CSS посредством gulp-sass
        .pipe(autoprefixer(['last 15 versions', '> 0.5%', 'ie 8', 'ie 9', 'ie 10'], {cascade: true})) //Создаем префиксы
        .pipe(cleanCSS({compatibility: 'ie8'})) //совместимость 'ie8'
        .pipe(rename({suffix: '.min'})) //Переименование файла
        .pipe(gulp.dest('build/css/')) //Выгружаем результата в папку build/css/
        .pipe(browserSync.reload({stream: true})); //Будет происходить инекция (подстановка) вновь полученного .css файла
});

/* ------------------------------------------------------------------------------------------------ */
gulp.task('scripts', function () {
    var src = [
        'app/js/helper.js',
        'app/blocks/**/*.js'
    ];
    return gulp.src(src)
        .pipe(gulpif(argv.prod, concat('bundle.min.js'))) //Для продакшн объединяем все js файлы в один
        .pipe(gulpif(argv.prod, uglify())) //Для продакшн сжимаем
        .pipe(gulpif(!argv.prod, rename({dirname: ''}))) // Для dev сборки удаляем промежуточную папку (название блока)
        .pipe(gulp.dest('build/js/'))
        .pipe(browserSync.reload({stream: true})); //Будет происходить инекция (подстановка) вновь полученного .js файла
});
