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
const resolver = require('stylus').resolver;
const newer = require('gulp-newer');
const path = require('path');
const remember = require('gulp-remember');
const cached = require('gulp-cached');
const rev = require('gulp-rev');
const browserSync = require('browser-sync').create();
const combine = require('stream-combiner2').obj;
const eslint = require('gulp-eslint');
const nodemon = require('gulp-nodemon');
const imagemin = require('gulp-imagemin');

let isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';
let disableHtml = true;

gulp.task('prepare:scripts', function () {
    return gulp.src(['frontend/js/jquery-3.3.1.min.js',
        'frontend/js/bootstrap.min.js', 'frontend/js/**/*.js'])
        .pipe(cached('scripts'))
        .pipe(remember('scripts'))
        .pipe(gulpIf(function(file){
            return !file.relative.includes('jquery') && !file.relative.includes('bootstrap');
        }, combine(eslint({configFile: '.eslintrc.client.json'}), eslint.format(), eslint.failAfterError())))
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(gulpIf(!isDev,
            combine(
                uglify(),
                gulpIf(function(file){
                    return file.relative.indexOf('admin') === -1;
                }, concat('all.js'))
            )
        ))
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest('public/js'))
        .pipe(gulpIf(!isDev, combine(rev.manifest('js.json'), gulp.dest('manifest'))));
});

gulp.task('prepare:styles', function () {
    return gulp.src(['frontend/css/**/*.*', '!frontend/css/libs/*.styl'])
        .pipe(cached('styles'))
        .pipe(remember('styles'))
        .pipe(gulpIf(function (file) {
            console.log('file go ' + file.relative);
            return file.extname === '.styl';
        }, stylus({
            define:{
                url: resolver()
            }
        })))
        .pipe(gulpIf(isDev, sourcemaps.init()))
        .pipe(gulpIf(!isDev,
            combine(
                autoprefixer(),
                cssnano(),
                gulpIf(function (file) {
                    return file.relative.indexOf('admin') === -1;
                }, concat('bundle.css')),
                rev()
            )
        ))
        .pipe(gulpIf(isDev, sourcemaps.write()))
        .pipe(gulp.dest('public/css'))
        .pipe(gulpIf(!isDev, combine(rev.manifest('css.json'), gulp.dest('manifest'))));
});

gulp.task('prepare:assets', function () {
    return gulp.src(['frontend/**/*.*', '!frontend/css/**/*.*',
        '!frontend/js/**/*.js'])
        .pipe(newer('public'))
        .pipe(gulpIf(function(file){
            return ~['jpg', 'jpeg', 'png'].indexOf(file.relative.split('.').pop());
        }, imagemin()))
        .pipe(gulpIf(disableHtml && function(file){
            return file.relative.indexOf('.html') === -1;
        }, gulp.dest('public')));
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
    gulp.watch(['frontend/css/**/*.*', '!frontend/css/libs/*.styl'],
        gulp.series('prepare:styles')).on('unlink', function (filepath) {
        remember.forget('styles', path.resolve(filepath));
        delete cached.caches.scripts[path.resolve(filepath)];
    });
    gulp.watch(['frontend/css/libs/*.styl'],
        gulp.series('prepare:styles')).on('change', function (filepath) {
            console.log("file was changed " + filepath);
            let mainPath = "frontend/css/main.styl";
            delete cached.caches.scripts[path.resolve(mainPath)];
            console.log(path.resolve(mainPath));
    });
    gulp.watch(['frontend/**/*.*', '!frontend/css/**/*.*',
        '!frontend/js/**/*.js'], gulp.series('prepare:assets'));

});


gulp.task('nodemon', function (cb) {

    let started = false;

    return nodemon({
        script: 'app.js',
        watch: [
            'app',
            'app.js'
        ],
        ext: "js hbs"
    }).on('start', function () {
        if (!started) {
            cb();
            started = true;
        }
    }).on('restart', function () {
        setTimeout(function(){
            browserSync.reload({ stream: false });
        }, 1000);
    });
});

gulp.task('browser-sync', function () {
    browserSync.init(null, {
        proxy: "http://localhost:8000",
        files: ["public/**/*.*"],
        browser: "google chrome",
        port: 5000,
    });
});

gulp.task('serve', function () {
    browserSync.init({
        server: "public",
        notify: false
    });

    browserSync.watch('public/**/*.*').on('change', browserSync.reload);
});

gulp.task('dev', gulp.series('build', gulp.parallel('watch', 'serve')));

gulp.task('default', gulp.series('build', 'nodemon', gulp.parallel('watch', 'browser-sync')));


