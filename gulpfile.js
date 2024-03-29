const gulp = require("gulp");
// const dartSass = require('sass');
const nodeSass = require("node-sass");
const gulpSass = require("gulp-sass");
const sass = gulpSass(nodeSass);
const postcss = require("gulp-postcss");
const del = require("del");
const rollup = require("gulp-better-rollup");
const { babel } = require("@rollup/plugin-babel");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const uglify = require("rollup-plugin-uglify");
const commonjs = require('rollup-plugin-commonjs');

var distTarget = "./hugo/assets/dist";

var css = {
	src: "src/sass/style.scss",
	sassOpts: {
		outputStyle: "nested",
		precision: 3,
    errLogToConsole: true,
    includePaths: ['node_modules']
	},
	processors: [
		require("autoprefixer"),
		// require('css-mqpacker'),
		require("cssnano"),
	],
};

//Setup Basic Actions

gulp.task("clean", () => {
	return del([distTarget]);
});

gulp.task("styles", () => {
	return gulp
		.src(css.src)
		.pipe(sass(css.sassOpts))
		.pipe(postcss(css.processors))
		.pipe(gulp.dest(`${distTarget}/css`));
});

gulp.task("scripts", () => {
  return gulp
		.src("src/js/app.js")
		.pipe(
			rollup(
				{
					plugins: [
						nodeResolve({
							browser: true,
						}),
						commonjs(),
						babel({ 
							babelHelpers: 'bundled', 
							presets: ['@babel/preset-env'],
							exclude: 'node_modules/**'
						}),
						uglify.uglify(), 
					],
				},
				{
					format: "iife",
				}
			)
		)
		.pipe(gulp.dest(`${distTarget}/js`));
});

//Useful Tasks
gulp.task("build", gulp.series(["clean", "styles", "scripts"]));

gulp.task("watch", () => {
	gulp.watch("src/**", (done) => {
		gulp.series(["clean", "styles", "scripts"])(done);
	});
});