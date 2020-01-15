'use strict';

let gulp = require('gulp'),
  plumber = require('gulp-plumber'),
  sass = require('gulp-sass'),
  uglify = require('gulp-uglify'),
  rigger = require('gulp-rigger'),
  sourcemaps = require('gulp-sourcemaps'),
  concat = require('gulp-concat'),
  csso = require('gulp-csso'),
  prefixer = require('gulp-autoprefixer'),
  imagemin = require('gulp-imagemin'),
  browserSync = require("browser-sync"),
  reload = browserSync.reload,
  pug = require('gulp-pug');

let path = {
  src: {
    html: 'app/**/*.html',
    js: 'app/*.js',
    style: 'app/css/*.+(scss|css)',
    img: 'app/img/**/*.*'
  },
  dest: {
    html: 'dest/',
    js: 'dest/',
    css: 'dest/css',
    img: 'dest/img'
  },
  clean: './dest'
};

let config = {
  server: {
      baseDir: "./dest"
  },
  tunnel: false,
  host: 'localhost',
  port: 9000,
  logPrefix: "Frontend"
};

gulp.task('webserver', function () {
  browserSync(config);
});
  

gulp.task('html_build', () => {
  gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.dest.html))
    .pipe(reload({stream: true})); 
});


gulp.task('style_build', () => {
  return gulp.src(path.src.style)
    .pipe(sourcemaps.init())
    .pipe(sass().on('error', sass.logError))
    .pipe(prefixer())
    .pipe(concat('main.css'))
    .pipe(csso())
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(path.dest.css))
    .pipe(reload({stream: true}));
});

gulp.task('js_build', () => {
  gulp.src(path.src.js)
    .pipe(rigger())
    .pipe(sourcemaps.init())
    .pipe(uglify())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(path.dest.js))
    .pipe(reload({stream: true})); 
});

gulp.task('img_build', () => {
  gulp.src(path.src.img)
    .pipe(imagemin({
      progressive: true
    }))
    .pipe(gulp.dest(path.dest.img))
    .pipe(reload({stream: true}));
});

gulp.task('watch', () => {
  gulp.watch('app/**/*.css', gulp.parallel('style_build'));
  gulp.watch('app/**/*.html', gulp.parallel('html_build'));
  gulp.watch('app/*.js', gulp.parallel('js_build'));
  gulp.watch('app/img/**/*.*', gulp.parallel('img_build'));
});


gulp.task('default', gulp.parallel(
  'html_build',
  'js_build',
  'style_build',
  'img_build',
  'webserver'
));