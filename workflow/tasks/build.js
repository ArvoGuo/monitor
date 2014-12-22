var gulp = require('gulp');
var concat = require('gulp-concat');
var jsList = ["develop/bower_components/jquery-2.1.3.min/index.js",
              "develop/bower_components/jquery-ui/jquery-ui.min.js",
              "develop/bower_components/echarts/build/dist/echarts-all.js",
              "develop/.tmp/*.js"
              ];

var cssList = ['develop/bower_components/bootstrap/dist/css/bootstrap.min.css',
                'develop/bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min.css',
                'develop/sass.css'];
module.exports = function(){
  gulp.src(jsList)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('develop/'));
  gulp.src(cssList)
    .pipe(concat('app.css'))
    .pipe(gulp.dest('develop/'));
};





