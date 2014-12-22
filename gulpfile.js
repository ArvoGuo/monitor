var gulp = require('gulp');
var requireDir = require('require-dir');
var config = require('./workflow/config.json');
var sass = require('./workflow/tasks/sass');
var serve = require('./workflow/tasks/serve');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jsList = ["bower_components/jquery-2.1.3.min/index.js",
  "bower_components/jquery-ui/jquery-ui.min.js",
  "bower_components/echarts/build/dist/echarts-all.js",
  "develop/.tmp/Chart.js",
  "develop/.tmp/Page.js",
  "develop/.tmp/intime.js",
  "develop/.tmp/daycount.js",
  "develop/.tmp/init.js",
  "develop/.tmp/cbModule.js",
  "develop/.tmp/app.js"
];
var cssList = ['bower_components/bootstrap/dist/css/bootstrap.min.css',
  'bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min.css',
  'develop/sass.css'
];
var jsListShouldCompress = ["develop/js/Chart.js",
  "develop/js/Page.js",
  "develop/js/intime.js",
  "develop/js/daycount.js",
  "develop/js/init.js",
  "develop/js/cbModule.js",
  "develop/js/app.js"
];
gulp.task('uglifyjs',function(){
  return gulp.src(jsListShouldCompress)
    .pipe(uglify())
    .pipe(gulp.dest('develop/.tmp/'));
});
gulp.task('concat', function() {
  gulp.src(jsList)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('develop/'));
  gulp.src(cssList)
    .pipe(concat('app.css'))
    .pipe(gulp.dest('develop/'));
});
var watch = function() {
  gulp.watch('develop/style/**/*.{sass,scss}', ['sass']);
};
gulp.task('html:dist', ['sass'], function() {
  return gulp.src(['develop/index.html', 'develop/app.{css,map}', 'develop/config.json'])
    .pipe(gulp.dest('dist'));
});
gulp.task('include:dist', function() {
  return gulp.src('develop/include/*')
    .pipe(gulp.dest('dist/include'));
});
gulp.task('images:dist', function() {
  return gulp.src('bower_components/jquery-ui/themes/ui-lightness/images/*')
    .pipe(gulp.dest('dist/images'));
});
gulp.task('js:dist', function() {
  return gulp.src('develop/app.js')
    .pipe(gulp.dest('dist'));
});



gulp.task('sass', sass);
gulp.task('serve', serve);
gulp.task('watch', watch);
gulp.task('build:dist', ['sass','uglifyjs','concat', 'js:dist', 'html:dist', 'images:dist', 'include:dist']);

gulp.task('default', ['watch', 'sass', 'serve']);