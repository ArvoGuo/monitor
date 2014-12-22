var gulp = require('gulp');
var requireDir = require('require-dir');
var clean = require('gulp-clean');
var config = require('./workflow/config.json');
var sass = require('./workflow/tasks/sass');
var serve = require('./workflow/tasks/serve');
var uglifyjs = require('./workflow/tasks/uglifyjs');
var build = require('./workflow/tasks/build');
// var builddist = require('./workflow/tasks/builddist');
var watch = function() {
  gulp.watch('develop/style/**/*.{sass,scss}', ['sass']);
};
gulp.task('clean', function () {
    return gulp.src('dist/*', {read: false})
        .pipe(clean());
});
gulp.task('html:dist',['sass'], function() {
  return gulp.src(['develop/index.html','develop/app.{css,map}','develop/config.json'])
    .pipe(gulp.dest('dist'));
});
gulp.task('include:dist',function(){
  return gulp.src('develop/include/*')
    .pipe(gulp.dest('dist/include'));
});
gulp.task('images:dist',function(){
  return gulp.src('develop/bower_components/jquery-ui/themes/ui-lightness/images/*')
    .pipe(gulp.dest('dist/images'));
});
gulp.task('js:dist',['uglifyjs'], function() {
  return gulp.src('develop/app.js')
    .pipe(gulp.dest('dist'));
});



gulp.task('sass', sass);
gulp.task('serve', serve);
gulp.task('watch', watch);
gulp.task('uglifyjs',uglifyjs);
gulp.task('build', ['sass','uglifyjs'], build);
gulp.task('build:dist', ['build', 'clean', 'js:dist','html:dist','images:dist','include:dist']);

gulp.task('default', ['watch', 'sass', 'serve']);