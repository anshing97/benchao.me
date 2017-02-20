var gulp        = require('gulp'),
    clean       = require('gulp-clean'),
    jade        = require('gulp-jade'),
    postcss     = require('gulp-postcss'),
    connect     = require('gulp-connect'),
    scss        = require('postcss-scss'),
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

gulp.task('css', function() {
    var processors = [
        require('postcss-strip-inline-comments'),
        require('autoprefixer'),
        require('cssnext'),
        require('precss')
    ];
    return gulp.src('src/scss/**/*.scss')
        .pipe(postcss(processors, {syntax: scss}))
        .pipe(gulp.dest('build/css'));
});

gulp.task('connect', function() {
    connect.server({
        root: 'build/',
        livereload: true
    });
});

gulp.task('watch', function() {
    gulp.watch('src/scss/**/*.scss', ['css']);
    gulp.watch('src/templates/**/*.jade', ['html']);
    gulp.watch('src/assets/**/*', ['assets']);
});


gulp.task('default', function() {
    sequence('clean',
             ['html', 'css', 'assets'],
             'connect',
             'watch');
});
