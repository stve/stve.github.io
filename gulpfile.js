var gulp = require('gulp');
var gutil = require('gulp-util');

var jshint = require('gulp-jshint');
var sass = require('gulp-sass');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var rename = require('gulp-rename');
var clean = require('gulp-clean');
var compass = require('gulp-compass');
var minify = require('gulp-minify-css');

var assets = './assets'

var targets = {
  scripts: './build/js',
  styles: './build/css',
}

var sources = {
   scripts: './src/js/*.js',
   styles: './src/scss/*.scss'
}

var paths = {
    scripts: [
        './bower_components/symbolset-js/ss-social.js',
        targets.scripts + '/biwr.js'
    ],
    styles: [
        './bower_components/gridism/gridism.css',
        './bower_components/normalize-css/normalize.css',
        targets.styles + '/styles.css'
    ],
    statics: [
        './bower_components/html5shiv/dist/html5shiv.js'
    ]
}

gulp.task('lint', function() {
    gulp.src(sources.scripts)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

gulp.task('clean', function() {
    gulp.src(targets.styles, {read: false})
        .pipe(clean());
    gulp.src(targets.scripts, {read: false})
        .pipe(clean());
    gulp.src(assets, {read: false})
        .pipe(clean());
});

gulp.task('generate', ['clean', 'sass', 'scripts', 'assemble']);

gulp.task('sass', function() {
    gulp.src(sources.styles)
        .pipe(compass({
            config_file: './config.rb',
            css: 'build/css',
            sass: 'src/scss',
            image: 'images'
        }))
});

gulp.task('scripts', function() {
    gulp.src(sources.scripts)
        .pipe(concat('biwr.js'))
        .pipe(gulp.dest(targets.scripts))
});

gulp.task('assemble', function() {
    gulp.src(paths.scripts)
        .pipe(concat('biwr.js'))
        .pipe(gulp.dest(assets))
        .pipe(rename('biwr.min.js'))
        .pipe(uglify())
        .pipe(gulp.dest(assets));

    gulp.src(paths.statics)
        .pipe(gulp.dest(assets));

    gulp.src(paths.styles)
        .pipe(concat('biwr.css'))
        .pipe(gulp.dest(assets))
        .pipe(rename('biwr.min.css'))
        .pipe(minify({}))
        .pipe(gulp.dest(assets));
})

gulp.task('watch', function() {
    gulp.watch(sources.scripts, ['lint', 'scripts']);
    gulp.watch(sources.styles, ['sass']);
});

gulp.task('default', ['lint', 'sass', 'scripts', 'assemble', 'watch']);
