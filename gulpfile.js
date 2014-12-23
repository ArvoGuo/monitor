var gulp = require('gulp');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var config = require('./workflow/config.json');
var sass = require('./workflow/tasks/sass');
var serve = require('./workflow/tasks/serve');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var jsList = ["bower_components/jquery-2.1.3.min/index.js",
  "bower_components/jquery-ui/jquery-ui.min.js",
  "bower_components/echarts/build/dist/echarts-all.js",
  "develop/.tmp/datatimepicker.js",
  "develop/.tmp/Chart.js",
  "develop/.tmp/Page.js",
  "develop/.tmp/intime.js",
  "develop/.tmp/daycount.js",
  "develop/.tmp/init.js",
  "develop/.tmp/cbModule.js",
  "develop/.tmp/app.js"
];
var dependentJs = ["develop/bower_components/jquery-2.1.3.min/index.js",
  "develop/bower_components/jquery-ui/jquery-ui.min.js",
  "develop/bower_components/echarts/build/dist/echarts-all.js"
];
var developJs = [
  "develop/js/datatimepicker.js",
  "develop/js/Chart.js",
  "develop/js/Page.js",
  "develop/js/intime.js",
  "develop/js/daycount.js",
  "develop/js/init.js",
  "develop/js/cbModule.js",
  "develop/js/app.js"
];
var cssList = ['bower_components/bootstrap/dist/css/bootstrap.min.css',
  'bower_components/jquery-ui/themes/ui-lightness/jquery-ui.min.css',
  'develop/datatimepicker.css',
  'develop/sass.css'
];
var jsListShouldCompress = [
  "develop/js/datatimepicker.js",
  "develop/js/Chart.js",
  "develop/js/Page.js",
  "develop/js/intime.js",
  "develop/js/daycount.js",
  "develop/js/init.js",
  "develop/js/cbModule.js",
  "develop/js/app.js"
];
var devJsList = [
  "bower_components/jquery-2.1.3.min/index.js",
  "bower_components/jquery-ui/jquery-ui.min.js",
  "bower_components/echarts/build/dist/echarts-all.js",
  "develop/js/datatimepicker.js",
  "develop/js/Chart.js",
  "develop/js/Page.js",
  "develop/js/intime.js",
  "develop/js/daycount.js",
  "develop/js/init.js",
  "develop/js/cbModule.js",
  "develop/js/app.js"
];
gulp.task('uglifyjs', function() {
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
  gulp.watch('develop/style/**/*.{sass,scss}', ['sass', 'devcss']);
  gulp.watch('develop/js/*', ['devjs']);
};
gulp.task('devcss', function() {
  gulp.src(cssList)
    .pipe(concat('app.css'))
    .pipe(gulp.dest('develop/'));
});
gulp.task('devjs', function() {
  gulp.src(devJsList)
    .pipe(concat('app.js'))
    .pipe(gulp.dest('develop/'));
});
gulp.task('html:dist', ['sass'], function() {
  return gulp.src(['develop/index.html', 'develop/app.{css,map}'])
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

gulp.task('config:dist', function() {

});
gulp.task('dev:mindevjs', function() {
  return gulp.src(developJs)
    .pipe(uglify())
    .pipe(concat('dev.js'))
    .pipe(gulp.dest('develop/.tmp/'));
});
gulp.task('dev:mergejs', function() {
  return gulp.src(dependentJs.concat(['develop/.tmp/dev.js']))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('develop/.tmp/'));
});
gulp.task('dev:cleanjs', function() {
  return gulp.src('develop/.tmp/dev.js', {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('dev:js', function() {
  runSequence('dev:mindevjs',
    'dev:mergejs',
    'dev:cleanjs'
  );
});



gulp.task('sass', sass);
gulp.task('serve', serve);
gulp.task('watch', watch);
gulp.task('build:dist', ['sass', 'uglifyjs', 'concat', 'js:dist', 'html:dist', 'images:dist', 'include:dist']);

gulp.task('default', ['watch', 'sass']);