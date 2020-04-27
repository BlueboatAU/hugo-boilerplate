const gulp = require('gulp');
const sass = require('gulp-sass');
const babel = require('gulp-babel');
const postcss = require('gulp-postcss');
const del = require('del');
// const uglify = require('gulp-uglify');
// const concat = require('gulp-concat');
// const rename = require("gulp-rename");


var distTarget = './hugo/assets/dist'

var css = {
  src         : 'src/sass/style.scss',
  sassOpts: {
    outputStyle     : 'nested',
    precision       : 3,
    errLogToConsole : true
  },
  processors: [
    require('autoprefixer'),
    // require('css-mqpacker'),
    require('cssnano')
  ]
};


//Setup Basic Actions


gulp.task('clean', () => {
    return del([
        distTarget,
    ]);
});

gulp.task('styles', () => {
  return gulp.src(css.src)
    .pipe(sass(css.sassOpts))
    .pipe(postcss(css.processors))
    .pipe(gulp.dest(`${distTarget}/css`));
});



gulp.task('scripts', () => {
	return gulp.src('src/js/app.js')
		.pipe(babel({
			presets: ['@babel/preset-env']
		}))
		.pipe(gulp.dest(`${distTarget}/js`))
});

//
// gulp.task('scripts', () => {
//   return gulp.src('src/js/app.js')
//     .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
//     .pipe(gulp.dest(`${distTarget}/js`));
// });

//Useful Tasks
gulp.task('build', gulp.series(['clean','styles','scripts']));

gulp.task('watch', () => {
    gulp.watch('src/**', (done) => {
        gulp.series(['clean','styles','scripts'])(done);
    });
});
