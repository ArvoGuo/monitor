var gulp = require('gulp');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');


var componentJs = [
  "develop/bower_components/jquery-2.1.3.min/index.js",
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
var componentCss = [
  "develop/bower_components/bootstrap/dist/css/bootstrap.min.css"
];



gulp.task('dev:mindevjs', function() {
  return gulp.src(developJs)
    .pipe(uglify())
    .pipe(concat('dev.js'))
    .pipe(gulp.dest('develop/.tmp/'));
});
gulp.task('dev:mergejs', function() {
  return gulp.src(componentJs.concat(['config/devconfig.js','develop/.tmp/dev.js']))
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


gulp.task('dev:sass', function() {
  return gulp.src('develop/style/app.sass')
    .pipe(sass())
    .pipe(rename('dev.css'))
    .pipe(gulp.dest('develop/.tmp/'));
});
gulp.task('dev:mergecss', function() {
  return gulp.src(['develop/.tmp/dev.css', 'develop/style/dependence/*.css'].concat(componentCss))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('develop/.tmp/'));
});

gulp.task('dev:cleancss', function() {
  return gulp.src('develop/.tmp/dev.css', {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('dev:css', function() {
  runSequence(
    'dev:sass',
    'dev:mergecss',
    'dev:cleancss'
  );
});

gulp.task('dev:js', function() {
  runSequence('dev:mindevjs',
    'dev:mergejs',
    'dev:cleanjs'
  );
});

gulp.task('dev', ['dev:css', 'dev:js']);

gulp.task('serve', ['dev'], function() {
  browserSync({
    server: {
      baseDir: ['develop/.tmp', 'develop/']
    },
    files: [
      'develop/index.html',
      'develop/.tmp/*',
    ]
  });
  watch('develop/style/**/*.{sass,scss}', function(event, done) {
    gulp.start('dev:css', function() {
    });
  }).pipe(plumber());
  watch('develop/js/*',function (event,done) {
    gulp.start('dev:js',function(){
    });
  }).pipe(plumber());
});



gulp.task('prod:mindevjs', function() {
  return gulp.src(developJs)
    .pipe(uglify())
    .pipe(concat('prod.js'))
    .pipe(gulp.dest('dist/'));
});
gulp.task('prod:mergejs', function() {
  return gulp.src(componentJs.concat(['config/prodconfig.js','dist/prod.js']))
    .pipe(concat('app.js'))
    .pipe(gulp.dest('dist/'));
});
gulp.task('prod:cleanjs', function() {
  return gulp.src('dist/prod.js', {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('prod:sass', function() {
  return gulp.src('develop/style/app.sass')
    .pipe(sass())
    .pipe(rename('prod.css'))
    .pipe(gulp.dest('dist/'));
});
gulp.task('prod:mergecss', function() {
  return gulp.src(['dist/prod.css', 'develop/style/dependence/*.css'].concat(componentCss))
    .pipe(concat('app.css'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('prod:cleancss', function() {
  return gulp.src('dist/prod.css', {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('prod:css', function() {
  runSequence(
    'prod:sass',
    'prod:mergecss',
    'prod:cleancss'
  );
});

gulp.task('prod:js',function(){
  runSequence('prod:mindevjs',
    'prod:mergejs',
    'prod:cleanjs'
  );
});

gulp.task('prod:html',function(){
  gulp.src('develop/index.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('prod:include',function(){
  gulp.src('develop/include/*')
    .pipe(gulp.dest('dist/include'));
});

gulp.task('serve:prod',['build:dist'],function(){
  browserSync({
    server: {
      baseDir: ['dist']
    },
    files: [
      'dist/*',
    ]
  });
});

//prod
gulp.task('build:dist',['prod:js','prod:css','prod:html','prod:include']);
gulp.task('default', ['serve']);







