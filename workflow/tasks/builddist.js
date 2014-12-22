var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');

module.exports = function(){
  return
  gulp.src(['develop/index.html','develop/app.{css,map}'])
      .pipe(gulp.dest('dist'));
  gulp.src('develop/app.js')
      .pipe(uglify())
      .pipe(gulp.dest('dist'));
};





