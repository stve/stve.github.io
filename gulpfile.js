var gulp = require('gulp');
var gutil = require('gulp-util');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var compass = require('gulp-compass');

gulp.task('lint', function() {
    gulp.src('./src/js/*.js')
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', function() {
    gulp.src('./css', {read: false})
        .pipe(clean());
    gulp.src('./js', {read: false})
        .pipe(clean());
});

gulp.task('generate', ['clean', 'sass', 'scripts']);

gulp.task('sass', function() {
    gulp.src('./css', {read: false})
        .pipe(clean());

    gulp.src('./src/scss/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            sass: 'src/scss',
            image: 'images'
        }))
        .pipe(gulp.dest('/tmp'));
});

gulp.task('scripts', function() {
    gulp.src('./js', {read: false})
        .pipe(clean());

    gulp.src('./vendor/js/**/*.js', {base: './vendor/js/'})
        .pipe(gulp.dest('./js/'));

    gulp.src('./src/js/*.js')
        .pipe(concat('biwr.js'))
        .pipe(gulp.dest('./js'))
        .pipe(rename('biwr.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest('./js'));
});

gulp.task('watch', function() {
    gulp.watch('./src/js//*.js', ['lint', 'scripts']);
    gulp.watch('./src/scss/*.scss', ['sass']);
});

gulp.task('default', ['lint', 'sass', 'scripts', 'watch']);
