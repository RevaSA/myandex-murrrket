const gulp          = require('gulp');
const less          = require('gulp-less');
const browserSync   = require('browser-sync');
const autoprefixer  = require('gulp-autoprefixer');
const rename        = require('gulp-rename');
const ejs           = require('gulp-ejs');
const gutil         = require('gulp-util');
const sourcemaps    = require('gulp-sourcemaps');
const include       = require('gulp-include');
const imagemin      = require('gulp-imagemin');
const gulpIf        = require('gulp-if');
const resource      = require('./src/js/resource');

const env = process.env.NODE_ENV;
const isDevelopment = !env || env === 'development';

// Автоперезагрузка при изменении файлов в папке `dist`:
// Принцип: меняем файлы в `/src`, они обрабатываются и переносятся в `dist` и срабатывает автоперезагрузка.
// Это таск нужен только при локальной разработке.
gulp.task('livereload', () => {
    browserSync.create();
    browserSync.init({
        server: {
            baseDir: 'dist'
        },
        files: [
            'dist/**/*.*'
        ]
    });
});

// Отслеживание изменений в файлах, нужно только при локальной разработке
gulp.task('watch', () => {
    gulp.watch('src/**/*.ejs', ['html']);
    gulp.watch('src/less/**/*.less', ['styles']);
    gulp.watch('src/img/**/*.*', ['img']);
});

gulp.task('html', () => {
    gulp.src('src/index.ejs')
        .pipe(ejs(resource).on('error', gutil.log))
        .pipe(include())
        .pipe(rename('index.html'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('styles', () => {
    gulp.src('src/less/main.less')
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('img', () => {
    gulp.src('src/img/**/*.*')
        .pipe(gulpIf(!isDevelopment, imagemin()))
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('default', ['html', 'styles', 'img', 'livereload', 'watch']);
gulp.task('prod', ['html', 'styles', 'img']);
