var gulp = require('gulp');
var gutil = require('gulp-util');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');

gulp.task('lint', function() {
    gulp.src('./javascripts/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('sass', function() {
    gulp.src('./sass/*.scss')
        .pipe(sass())
        .pipe(gulp.dest('./css'));
});

gulp.task('scripts', function() {
    gulp.src('./js', {read: false})
        .pipe(clean());

    gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));

    gulp.src('./vendor/js/**/*.js', {base: './vendor/js/'})
        .pipe(gulp.dest('./js/'));

    gulp.src('./src/js/*.js')
        .pipe(concat('biwr.js'))
        .pipe(gulp.dest('./js'))
        .pipe(rename('biwr.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch('./javascript/*.js', ['lint', 'scripts']);
    gulp.watch('./sass/*.scss', ['sass']);
});

// Default Task
gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
