var lazyReq = require('lazy-req')(require),
    gulp = require('gulp'),
    _ = require('lodash'),
    fs = require('fs'),
	gulpif = require('gulp-if'),
	gutil = require('gulp-util'),
	watch = require('gulp-watch'),
	plumber = require('gulp-plumber'),
	less = require('gulp-less'),
	minifycss = require('gulp-minify-css'),
	modernizr = require('gulp-modernizr'),
	concat = require('gulp-concat-sourcemap'),
	sourcemaps = require('gulp-sourcemaps'),
	uglify = require('gulp-uglify'),
	concat = require('gulp-concat'),
	iconfont = require('gulp-iconfont'),
	iconfontCss = require('gulp-iconfont-css'),
	debug = require('gulp-debug'),
	runSequence = require('run-sequence').use(gulp),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    browserify = require('browserify'),
    watchify = require('watchify');

var vendorExternal = [
    { require: "detect-dom-ready" },
    { require: "dom-select" },
    { require: "dom-classes" },
    { require: "raf" },
    { require: "glslify" },
    { require: "gsap/src/uncompressed/TweenLite" },
    { require: "gsap/src/uncompressed/plugins/ScrollToPlugin" },
    { require: "gsap/src/uncompressed/easing/EasePack" },
    { require: "three" },
    { require: "noisejs" }
];

var config = {
	'env': 'prod',
	'theme' : 'web/app/themes/portfolio/'
};

config.base = config.app;

gulp.task('less', function () {
	return gulp.src("less/main.less")
		.pipe(plumber())
		.pipe(less().on('error', gutil.log))
		.pipe(gulpif(config.env === 'prod', minifycss()))
		.pipe(gulp.dest(config.theme + "css"));
});

gulp.task('modernizr', function() {
    return gulp.src([config.theme + "js/vendors.js", config.theme + "js/app.js", config.theme + "css/main.css"])
    .pipe(concat('temp'))
    .pipe(modernizr({
        "options" : [
            "setClasses",
            "addTest",
            "html5printshiv",
            "testProp",
            "fnBind",
            "mq",
            "prefixed"
        ],
        'tests': [
            'csstransforms3d',
            'preserve3d',
            'touchevents'
        ],
        "crawl" : true
    }))
    .pipe(gulpif(config.env === 'prod', uglify({mangle: true, compress : {drop_console:true}})))
    .pipe(gulp.dest(config.theme + 'js/'));
})

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


gulp.task('build-vendor', function () {
  var bVendor = browserify({
        debug: config.env === 'dev'
    });

    vendorExternal.forEach(function(external) {
        bVendor.require(external.require);
    });

    return bVendor.bundle()
        .pipe(source('vendor.js'))
        .pipe(buffer())
        .pipe(gulpif(config.env === 'prod', uglify({mangle: true, compress : {drop_console:true}})))
        .on('error', gutil.log)
        .pipe(gulp.dest(config.theme + 'js'));
});



function rebundle(bundler) {
    console.log('-> bundle...')
    return bundler.bundle()        
    .on('error', gutil.log)
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(config.theme + 'js'));
}

gulp.task('build-app-prod', function() {

    var browserifyOptions = {
        entries: ['./js/index.js']
    };

    var bApp = browserify(browserifyOptions)
                .transform("babelify", { presets: ["es2015"] })
                .transform('glslify');

    vendorExternal.forEach(function(external) {
        bApp.external(external.require);
    });

    return rebundle(bApp);
});

gulp.task('build-app', function () {

    var browserifyOptions = {
        entries: ['./js/index.js'],
        debug: config.env === 'dev',
        cache: {},
        packageCache: {}
    };

    var bApp = browserify(browserifyOptions)
                .transform("babelify", { presets: ["es2015"] })
                .transform('glslify');

    vendorExternal.forEach(function(external) {
        bApp.external(external.require);
    });

    var watcher = watchify(bApp);

    if(config.env === 'dev') {
        watcher.on('log', function(message) {
            console.log('-> watchify', message);
        });
        
        watcher.on('update', function() {
            rebundle(watcher);
        });
    }

    return rebundle(watcher);

});

gulp.task('watch', function () {
	gulp.watch("less/*.less", ['less']);
    // gulp.watch(['./js/**/*.js', './js/**/*.glsl'], ['build-app']);
});

gulp.task('devconfig', function () {
    console.log('set env as dev...');
    config.env = 'dev';
});

gulp.task('dev', function(callback) {
    runSequence(['devconfig','build-vendor', 'build-app', 'less', 'watch'], 'modernizr' );
});

gulp.task('prod', function(callback) {
    runSequence(['build-vendor', 'build-app-prod', 'less'], 'modernizr' );
});

gulp.task('default',['prod']);
