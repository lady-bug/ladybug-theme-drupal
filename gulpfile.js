let gulp = require('gulp'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  $ = require('gulp-load-plugins')(),
  cleanCss = require('gulp-clean-css'),
  rename = require('gulp-rename'),
  merge = require('merge-stream'),
  postcss = require('gulp-postcss'),
  autoprefixer = require('autoprefixer'),
  postcssInlineSvg = require('postcss-inline-svg'),
  browserSync = require('browser-sync').create(),
  pxtorem = require('postcss-pxtorem'),
	postcssProcessors = [
		postcssInlineSvg({
      removeFill: true,
      paths: ['./node_modules/bootstrap-icons/icons']
    }),
		pxtorem({
			propList: ['font', 'font-size', 'line-height', 'letter-spacing', '*margin*', '*padding*'],
			mediaQuery: true
		})
  ];

const paths = {
  scss: {
    src: ['./scss/global.scss','./scss/print.scss'],
    dest: './css',
    watch: './scss/**/*.scss'
  },
  js: {
    bootstrap: './node_modules/bootstrap/dist/js/bootstrap.min.js',
    bootstrapmap: './node_modules/bootstrap/dist/js/bootstrap.min.js.map',
    jquery: './node_modules/jquery/dist/jquery.min.js',
    popper: './node_modules/popper.js/dist/umd/popper.min.js',
    poppermap: './node_modules/popper.js/dist/umd/popper.min.js.map',
    dest: './js',
    watch: './js/src/*.js'
  }
}

// compile global sass into css destination folder
// auto-inject into browsers
function styles () {
  var tasks = paths.scss.src.map(function(elt){
    return gulp.src([elt])
      .pipe(sourcemaps.init())
      .pipe(sass().on('error', sass.logError))
      .pipe($.postcss(postcssProcessors))
      .pipe(postcss([autoprefixer({
        browsers: [
          'Chrome >= 35',
          'Firefox >= 38',
          'Edge >= 12',
          'Explorer >= 10',
          'iOS >= 8',
          'Safari >= 8',
          'Android 2.3',
          'Android >= 4',
          'Opera >= 12']
      })]))
      .pipe(sourcemaps.write())
      .pipe(gulp.dest(paths.scss.dest))
      .pipe(cleanCss())
      .pipe(rename({ suffix: '.min' }))
      .pipe(gulp.dest(paths.scss.dest))
      .pipe(browserSync.stream());
  });

  return merge(tasks);
}

// move  javascript files into js destination folder
function js () {
  return gulp.src([paths.js.bootstrap, paths.js.bootstrapmap, paths.js.jquery, paths.js.popper, paths.js.poppermap])
    .pipe(gulp.dest(paths.js.dest))
    .pipe(browserSync.stream())
}

// local mode server
// watching scss/js files ... tbd twig files
function serve () {
  browserSync.init({
    proxy: 'http://localhost',
  })

  gulp.watch([paths.scss.watch], styles).on('change', browserSync.reload)
  gulp.watch([paths.js.watch], js).on('change', browserSync.reload)
}

const build = gulp.series(styles, gulp.parallel(js, serve))

exports.styles = styles
exports.js = js
exports.serve = serve
exports.default = build
