var gulp = require('gulp'),
    plumber = require('gulp-plumber'),
    rename = require('gulp-rename'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    minifycss = require('gulp-clean-css'),
    browserSync = require('browser-sync');

const pathes = {
        libs: ["node_modules/d3/build/d3.*"],
        css: ["src/css/**/*.css"],
        js: ["src/js/**/*.js"],
        html: ["src/**/*.html", "src/**/*.htm"],
        images: ["src/images/**/*"],
        data: ["data/**/*"],
        target: "./dist"
      };

gulp.task('browser-sync', function() {
  browserSync({
    server: {
       baseDir: pathes.target
    }
  });
});

gulp.task('bs-reload', function () {
  browserSync.reload();
});

gulp.task('images', function(){
  gulp.src(pathes.images)
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    .pipe(gulp.dest(pathes.target + '/images/'));
});

gulp.task('html', function(){
  gulp.src(pathes.html)
  .pipe(gulp.dest(pathes.target + '/'))
});

gulp.task('css', function(){
  gulp.src(pathes.css)
    .pipe(autoprefixer('last 2 versions'))
    .pipe(gulp.dest(pathes.target + '/css/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(minifycss())
    .pipe(gulp.dest(pathes.target + '/css/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('libs', function() {
  gulp.src(pathes.libs)
    .pipe(gulp.dest(pathes.target + "/lib/"))
});

gulp.task('js', function(){
  return gulp.src(pathes.js)
    .pipe(plumber({
      errorHandler: function (error) {
        console.log(error.message);
        this.emit('end');
    }}))
    .pipe(concat('main.js'))
    .pipe(gulp.dest(pathes.target + '/js/'))
    .pipe(rename({suffix: '.min'}))
    .pipe(uglify())
    .pipe(gulp.dest(pathes.target + '/js/'))
    .pipe(browserSync.reload({stream:true}))
});

gulp.task('data', function(){
  gulp.src(pathes.data)
    .pipe(gulp.dest(pathes.target + '/data/'))
})

gulp.task('build', ['data', 'html', 'js', 'css', 'libs']);

gulp.task('default', ['build', 'browser-sync'], function(){
  gulp.watch(pathes.html, ['html']);
  gulp.watch(pathes.css, ['css']);
  gulp.watch(pathes.js, ['js']);
  gulp.watch(pathes.target + "/**/*", ['bs-reload']);
});