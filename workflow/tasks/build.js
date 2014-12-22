var gulp = require('gulp');
var concat = require('gulp-concat');
var jsList = ["./bower_components/jquery-2.1.3.min/index.js",
              "./bower_components/jquery-ui/jquery-ui.min.js",
              "./bower_components/echarts/build/dist/echarts-all.js",
              "./.tmp/*.js"
              ];

var cssList = ['./bower_components/bootstrap/dist/css/bootstrap.min.css',
                './bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min.css',
                'develop/sass.css'];
module.exports = function(){
  gulp.src(jsList)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('develop/'));
  gulp.src(cssList)
    .pipe(concat('app.css'))
    .pipe(gulp.dest('develop/'));
};





