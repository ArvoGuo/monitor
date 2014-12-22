var gulp = require('gulp');
var uglify = require('gulp-uglify');

var jsListShouldCompress = ["develop/js/Chart.js",
  "develop/js/Page.js",
  "develop/js/intime.js",
  "develop/js/daycount.js",
  "develop/js/init.js",
  "develop/js/cbModule.js"
];
module.exports = function() {
  return gulp.src(jsListShouldCompress)
    .pipe(uglify())
    .pipe(gulp.dest('develop/.tmp/'));
};