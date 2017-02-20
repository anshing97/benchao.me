var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    jade        = require('gulp-jade'),
    postcss     = require('gulp-postcss'),
    connect     = require('gulp-connect'),
    sass        = require('gulp-sass'),
    stylelint   = require('stylelint'),
    reporter    = require('postcss-reporter'),
    sequence    = require('run-sequence'),
    merge       = require('merge-stream');

gulp.task('clean', function () {
    return gulp.src('build/', {read: false})
        .pipe(clean());
});

gulp.task('html', function() {
    return gulp.src('src/templates/*.jade')
        .pipe(jade())
        .pipe(gulp.dest('build/'));
});

gulp.task('assets', function(){

  var png = gulp.src('src/assets/**/*.png')
    .pipe(gulp.dest('build/assets'));

  var jpg = gulp.src('src/assets/**/*.jpg')
    .pipe(gulp.dest('build/assets'));

  return merge(png, jpg);
});


gulp.task("lint", function() {
    var processors = [
        stylelint(),
        reporter({
            clearMessages: true,
            throwError: true
        })
    ];
    var scss = require('postcss-scss');

    return gulp.src('src/scss/**/*.scss')
        .pipe(postcss(processors,{syntax:scss}));
});

gulp.task('css', function() {
    processors = [
        require('autoprefixer'),
        require('css-mqpacker'),
        require('cssnano')
    ];
    return gulp.src('src/scss/**/*.scss')
        .pipe(sass())
        .pipe(postcss(processors))
        .pipe(gulp.dest('build/css'));
});

gulp.task('connect', function() {
    connect.server({
        root: 'build/',
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['lint','css']);
    gulp.watch('src/templates/**/*.jade', ['html']);
    gulp.watch('src/assets/**/*', ['assets']);
});


gulp.task('default', function() {
    sequence('clean',
             'lint',
             ['html', 'css', 'assets'],
             'connect',
             'watch');
});
