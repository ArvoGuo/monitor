var gulp = require('gulp');
var fs = require('fs');
var clean = require('gulp-clean');
var runSequence = require('run-sequence');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var plumber = require('gulp-plumber');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var browserSync = require('browser-sync');
var handlebars = require('gulp-compile-handlebars');
var rev = require('gulp-rev');
var cjson = ['config/devconfig.js', 'config/prodconfig.js'];
var config = {};
config.model = cjson[0];

var componentJs = [
  "develop/bower_components/jquery-2.1.3.min/index.js",
  "develop/bower_components/echarts/build/dist/echarts-all.js"
];
var componentCss = [
  "develop/bower_components/bootstrap/dist/css/bootstrap.min.css"
];
var developJs = [
  "develop/js/class/*.js",
  "develop/js/global/*.js",
  "develop/js/components/*.js",
  "develop/js/module/*.js",
  "develop/js/controller/cbModule.js",
  "develop/js/default/app.js"
];

gulp.task('dev:mindevjs', function() {
  return gulp.src(developJs)
    // .pipe(uglify())
    .pipe(concat('dev.js'))
    .pipe(gulp.dest('develop/.tmp/'));
});
gulp.task('dev:mergejs', function() {
  return gulp.src(componentJs.concat([config.model, 'develop/.tmp/dev.js']))
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
    gulp.start('dev:css', function() {});
  }).pipe(plumber());
  watch('develop/js/**/*', function(event, done) {
    gulp.start('dev:js', function() {});
  }).pipe(plumber());
});



gulp.task('prod:mindevjs', function() {
  return gulp.src(developJs)
    .pipe(uglify())
    .pipe(concat('prod.js'))
    .pipe(gulp.dest('dist/'));
});
gulp.task('prod:mergejs', function() {
  return gulp.src(componentJs.concat([config.model, 'dist/prod.js']))
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

gulp.task('prod:js', function() {
  runSequence('prod:mindevjs',
    'prod:mergejs',
    'prod:cleanjs'
  );
});

gulp.task('prod:html', function() {
  return gulp.src('develop/index.html')
    .pipe(gulp.dest('dist/'));
});

gulp.task('prod:include', function() {
  return gulp.src('develop/include/*')
    .pipe(gulp.dest('dist/include'));
});

gulp.task('serve:dist', function() {
  browserSync({
    server: {
      baseDir: ['dist']
    },
    files: [
      'dist/*',
      'dist/**/*'
    ]
  });
});

gulp.task('rev:fest', function() {
  return gulp.src(['dist/app.css', 'dist/app.js'], {
      base: 'dist'
    })
    .pipe(rev())
    .pipe(gulp.dest('dist/app'))
    .pipe(rev.manifest())
    .pipe(gulp.dest('dist/app'));
});
var handlebarOpts = {
  helpers: {
    assetPath: function(path, context) {
      return 'app/' + context.data.root[__dirname + '/dist/' + path];
    }
  }
};

gulp.task('rev:compile', function() {
  var manifest = JSON.parse(fs.readFileSync('./dist/app/rev-manifest.json', 'utf8'));
  return gulp.src('develop/index.hbs')
    .pipe(handlebars(manifest, handlebarOpts))
    .pipe(rename('index.html'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('rev:clean', function() {
  return gulp.src(['dist/app/rev-manifest.json', 'dist/app.js', 'dist/app.css'], {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});

gulp.task('hash:dist', function() {
  runSequence('rev:fest', 'rev:compile', 'rev:clean');
});
gulp.task('dist:clean', function() {
  return gulp.src('dist/*', {
      read: false
    })
    .pipe(clean({
      force: true
    }));
});
//prod
// gulp.task('build:dist', function() {
//   config.model = cjson[1];
//   runSequence('dist:clean', 'prod:js', 'prod:css', 'prod:html', 'prod:include', 'hash:dist');
// });
gulp.task('build:dist', function() {
  config.model = cjson[1];
  runSequence('dist:clean', 'prod:mindevjs',
    'prod:mergejs',
    'prod:cleanjs',
    'prod:sass',
    'prod:mergecss',
    'prod:cleancss',
    'prod:html',
    'prod:include',
    'rev:fest', 'rev:compile', 'rev:clean'
  );
});

gulp.task('build:dist:prod', function() {
  config.model = cjson[1];
  runSequence('dist:clean', 'prod:mindevjs',
    'prod:mergejs',
    'prod:cleanjs',
    'prod:sass',
    'prod:mergecss',
    'prod:cleancss',
    'prod:html',
    'prod:include',
    'rev:fest', 'rev:compile', 'rev:clean'
  );
});


gulp.task('build:dist:dev', function() {
  config.model = cjson[0];
  runSequence('dist:clean', 'prod:mindevjs',
    'prod:mergejs',
    'prod:cleanjs',
    'prod:sass',
    'prod:mergecss',
    'prod:cleancss',
    'prod:html',
    'prod:include',
    'rev:fest', 'rev:compile', 'rev:clean'
  );
});
gulp.task('default', ['serve']);