const gulp = require('gulp');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const $ = require('gulp-load-plugins')();
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
const merge = require('merge-stream');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const postcssInlineSvg = require('postcss-inline-svg');
const browserSync = require('browser-sync').create();
const pxtorem = require('postcss-pxtorem');
const	postcssProcessors = [
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
    bootstrap: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js',
    bootstrapmap: './node_modules/bootstrap/dist/js/bootstrap.bundle.min.js.map',
    dest: './js',
    watch: './js/src/*.js'
  },
  twig: {
    src: './templates/**/*.html.twig',
    watch: './templates/**/*.html.twig'
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
};

// move  javascript files into js destination folder
function js () {
  return gulp.src([paths.js.bootstrap, paths.js.bootstrapmap])
    .pipe(gulp.dest(paths.js.dest))
		.pipe(browserSync.stream());
}

//load twig files
function twig () {
  return gulp.src(paths.twig.src)
		.pipe(browserSync.stream());
}

// local mode server
// watching scss/js/twig files
function serve () {

  browserSync.init({
    proxy: 'http://localhost'
  })

  gulp.watch([paths.scss.watch], styles).on('change', browserSync.reload)
  gulp.watch([paths.js.watch], js).on('change', browserSync.reload)
  gulp.watch([paths.twig.watch], twig).on('change', browserSync.reload)
}

const build = gulp.series(styles, js, twig, serve)

exports.styles = styles
exports.js = js
exports.twig = twig
exports.serve = serve
exports.default = build
