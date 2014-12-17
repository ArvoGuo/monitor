'use strict';
var gulp = require('gulp');
var requireDir = require('require-dir');
var config = require('./workflow/config.json');
var sass = require('./workflow/tasks/sass');
var serve = require('./workflow/tasks/serve');
var watch = function(){
  gulp.watch('develop/style/**/*.{sass,scss}',['sass'])
};
gulp.task('sass',sass);
gulp.task('serve',serve);
gulp.task('watch',watch);

gulp.task('default',['watch','sass','serve'])
