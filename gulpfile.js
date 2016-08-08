var gulp   = require('gulp'),
    clean  = require('gulp-clean'),
    jade   = require('gulp-jade'),
    sass   = require('gulp-sass'),
    connect = require('gulp-connect');

gulp.task('clean', function () {
  return gulp.src('build/', {read: false})
    .pipe(clean());
});

gulp.task('build-templates', function() {
    return gulp.src('src/templates/**/*.jade')
        .pipe(jade()) 
        .pipe(gulp.dest('build/'));
});

gulp.task('build-styles', function() {
  return gulp.src('src/scss/**/*.scss')
    .pipe(sass())
    .pipe(gulp.dest('build/css'));
});

gulp.task('connect', function() {
  connect.server({
    root: 'build/',
    livereload: true
  });
});

gulp.task('watch', function() {
  gulp.watch('src/scss/**/*.scss', ['build-styles']);
  gulp.watch('src/templates/**/*.jade', ['build-templates']);

});


gulp.task('default', ['clean','build-templates','build-styles','connect','watch']);
