var gulp = require('gulp'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	less = require('gulp-less'),
	minifycss = require('gulp-minify-css'),
	ts = require('gulp-typescript'),
	concat = require('gulp-concat-sourcemap'),
	sourcemaps = require('gulp-sourcemaps'),
	eventStream = require('event-stream'),
	uglify = require('gulp-uglify'),
	rename = require('gulp-rename'),
	concat = require('gulp-concat'),
	notify = require('gulp-notify'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	imagemin = require('gulp-imagemin'),
	del = require('del'), 
	debug = require('gulp-debug'),
	insert = require('gulp-insert'),
	runSequence = require('run-sequence').use(gulp);


var config = {
	'env': 'prod',
	'theme' : 'web/app/themes/portfolio/',
	'app': 'app/',
	'dist': 'dist/',
	'bower' : 'web/app/themes/portfolio/vendors/'
};

config.base = config.app;

gulp.task('clean:dist', function (cb) {
  del(['**'], cb);
});

gulp.task('copyfiles', function() {
	gulp.src('*.html')
	.pipe(gulp.dest(config.dist));

	gulp.src('fonts/*.*')
	.pipe(gulp.dest(config.dist+"fonts"));
});

gulp.task('less', function () {
	gulp.src("less/main.less")
		.pipe(plumber())
		.pipe(less().on('error', gutil.log))
		.pipe(gulpif(config.env === 'prod', minifycss()))
		.pipe(gulp.dest(config.theme + "css"));
});

gulp.task('modernizr', function () {
	gulp.src(config.bower+'modernizr/modernizr.js')
		.pipe(plumber())
		.pipe(concat("modernizr.js"))
		.pipe(gulp.dest(config.theme + "js/"));
	

});



gulp.task('libscripts', function () {
	//JS lib list (from bower)
	var src = 	[
			config.bower + "threejs/index.js",
			config.bower + "dat.gui/dat.gui.js",
			config.bower + "page/page.js",
			config.bower + "stats.js/build/stats.min.js",
			config.bower + "webgl-shader-loader-js/ShaderLoader.js",
			config.bower + "three-effectComposer/shaders/ConvolutionShader.js",
			config.bower + "three-effectComposer/shaders/CopyShader.js",
			config.bower + "three-effectComposer/js/postprocessing/RenderPass.js",
			config.bower + "three-effectComposer/js/postprocessing/BloomPass.js",
			config.bower + "three-effectComposer/js/postprocessing/ShaderPass.js",
			config.bower + "three-effectComposer/js/postprocessing/EffectComposer.js",
			config.bower + "greensock/src/uncompressed/TweenMax.js"
		];

		gulp.src(src)
			.pipe(plumber())
			.pipe(concat("vendor.js"))
			.pipe(gulpif(config.env === 'prod', uglify({mangle: true, compress : {drop_console:true}})))
			.pipe(gulp.dest(config.theme+'js'));

});

var tsProject = ts.createProject({
    declarationFiles: true,
    noExternalResolve: false,
    sourceRoot: 'typescript/'
});

gulp.task('scripts', function() {
    var tsResult = gulp.src([
    					'typescript/*.ts', 
    					'typescript/**/*.ts',
    					config.bower + 'DefinitelyTyped/webaudioapi/waa.d.ts',
    					config.bower + 'DefinitelyTyped/dat-gui/dat-gui.d.ts',
    					config.bower + 'DefinitelyTyped/greensock/greensock.d.ts',
    					config.bower + 'DefinitelyTyped/svgjs/svgjs.d.ts',
    					config.bower + 'DefinitelyTyped/stats/stats.d.ts',
    					config.bower + 'DefinitelyTyped/threejs/*.d.ts'
    					])
    					.pipe(sourcemaps.init())
                       	.pipe(ts(tsProject));

    return eventStream.merge(
        tsResult.dts.pipe(gulp.dest('definitions')),
        tsResult.js.pipe(gulp.dest(config.theme + 'js'))
        .pipe(concat('app.js'))   
        .pipe(gulpif(config.env === 'dev', sourcemaps.write()))	
        .pipe(gulpif(config.env === 'prod', uglify({mangle: true, compress : {drop_console:true}})))
    	.pipe(gulp.dest(config.theme+'js/'))
    );
});

gulp.task('shader', function() {
	return gulp.src("shaders/*.shader")
		.pipe(concat('shaders.xml'))
		.pipe(insert.wrap('<shaderList>', '</shaderList>'))
		.pipe(gulp.dest(config.theme+'js'));
});


// Glyphs
var fontName = 'glyph';
gulp.task('font', function(){
	return gulp.src('assets/glyph/*.svg')
		.pipe(iconfontCss({
			fontName: fontName,
			path: 'node_modules/gulp-iconfont-css/templates/_icons.less',
			targetPath: '../../../../../less/generated/glyph.less',
			fontPath: '../fonts/'
		}))
		.pipe(iconfont({
			fontName: fontName
		}))
		.pipe(gulp.dest(config.theme+'fonts/'));
});

gulp.task('watch', function () {
	gulp.watch("less/*.less", ['less']);
    gulp.watch(['typescript/**/*.ts', 'typescript/*.ts'], ['scripts']);
    gulp.watch(['shaders/*.shader'], ['shader']);
    gulp.watch(['js/vendor/webgl-shader-loader-js/ShaderLoader.js'], ['libscripts']);
});

gulp.task('devconfig', function () {
    console.log('set env as dev...');
    config.env = 'dev';
});

gulp.task('dev', ['devconfig','common', 'watch']);

gulp.task('prod', ['common']);

gulp.task('common', function(callback) {
		runSequence( 'font', ['less', 'modernizr', 'libscripts', 'scripts', 'shader'] );
	}
)

gulp.task('default',['prod']);