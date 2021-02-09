const gulp = require('gulp');
const sass = require('gulp-sass');
sass.compiler = require('sass');
const shell = require('gulp-shell');
const Fiber = require('fibers');
const sourcemaps = require('gulp-sourcemaps');
const $ = require('gulp-load-plugins')();
const cleanCss = require('gulp-clean-css');
const rename = require('gulp-rename');
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
    src: './scss/compile/*.scss',
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
    watch: './templates/'
  },
	config: {
		drush: '../../../vendor/bin/drush'
	}
}

function drushcr () {
	return gulp.src(paths.twig.watch,{read: false})
		.pipe(shell([paths.config.drush + ' cache:rebuild --cache-clear']));
}

// compile global sass into css destination folder
// auto-inject into browsers
function styles () {
	//from sass compilation options
  //--output-style compressed --source-map true --source-map-contents true --precision 6
  return gulp.src(paths.scss.src)
    .pipe(sourcemaps.init())
    .pipe(sass({
      fiber: Fiber,
      outputStyle: 'compressed',
      precision: 6,
      sourceMap: true,
      sourceMapContent: true
    }).on('error', sass.logError))
    .pipe($.postcss(postcssProcessors))
    .pipe(postcss([autoprefixer({})]))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.scss.dest))
    .pipe(cleanCss())
    .pipe(rename({ suffix: '.min' }))
    .pipe(gulp.dest(paths.scss.dest))
		.pipe(browserSync.stream());
};

// move  javascript files into js destination folder
function js () {
  return gulp.src([paths.js.bootstrap, paths.js.bootstrapmap])
    .pipe(gulp.dest(paths.js.dest))
		.pipe(browserSync.stream());
}

// local mode server
// watching scss/js/twig files
function serve () {

  browserSync.init({
    proxy: 'http://localhost'
  })

  gulp.watch([paths.scss.watch], styles).on('all', browserSync.reload)
  gulp.watch([paths.js.watch], js).on('all', browserSync.reload)
  gulp.watch([paths.twig.watch], drushcr).on('all', browserSync.reload)
}

const build = gulp.series(styles, js, serve)

exports.styles = styles
exports.js = js
exports.serve = serve
exports.default = build
