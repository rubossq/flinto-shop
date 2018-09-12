'use strict';

const gulp = require('gulp');
const debug = require('gulp-debug');
const gulpIf = require('gulp-if');
const uglify = require('gulp-uglify');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const cssnano = require('gulp-cssnano');
const concat = require('gulp-concat');
const del = require('del');
const stylus = require('gulp-stylus');
const newer = require('gulp-newer');
const path = require('path');
const remember = require('gulp-remember');
const cached = require('gulp-cached');

const browserSync = require('browser-sync').create();

let isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

gulp.task('prepare:scripts', function () {
    return gulp.src(['frontend/js/jquery-3.3.1.min.js',
        'frontend/js/bootstrap.min.js', 'frontend/js/**/*.js'])
        .pipe(cached('scripts'))
        .pipe(gulpIf(isDev, sourcemaps.init()))
        //.pipe(uglify())
        .pipe(remember('scripts'))
        //.pipe(concat('all.js'))
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest('public/js'));
});

gulp.task('prepare:styles', function () {
    return gulp.src(['frontend/css/**/*.*', '!frontend/css/libs/*.styl'])
        .pipe(cached('styles'))
        .pipe(gulpIf(function (file) {
            return file.extname === '.styl';
        }, stylus()))
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(autoprefixer())
        //.pipe(cssnano())
        .pipe(remember('styles'))
        //.pipe(concat('bundle.css'))
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest('public/css'));
});

gulp.task('prepare:assets', function () {
    return gulp.src(['frontend/**/*.*', '!frontend/css/**/*.*',
        '!frontend/js/**/*.js'])
        .pipe(debug('assets'))
        .pipe(newer('public'))
        .pipe(gulp.dest('public'));
});


gulp.task('clean', function () {
    return del('public');
});


gulp.task('build', gulp.series('clean', gulp.parallel('prepare:scripts',
    'prepare:styles', 'prepare:assets')));

gulp.task('watch', function () {
    gulp.watch('frontend/js/**/*.js', gulp.series('prepare:scripts'))
        .on('unlink', function (filepath) {
            remember.forget('scripts', path.resolve(filepath));
            delete cached.caches.scripts[path.resolve(filepath)];
        });
    gulp.watch(['frontend/css/**/*.*'],
        gulp.series('prepare:styles')).on('unlink', function (filepath) {
        remember.forget('styles', path.resolve(filepath));
        delete cached.caches.scripts[path.resolve(filepath)];
    });
    gulp.watch(['frontend/**/*.*', '!frontend/css/**/*.*',
        '!frontend/js/**/*.js'], gulp.series('prepare:assets'));
});

gulp.task('serve', function () {
    browserSync.init({
        server: "public",
        notify: false
    });

    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));


