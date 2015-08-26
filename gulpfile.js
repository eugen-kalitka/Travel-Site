var gulp = require('gulp'),
    minifyCss = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    del = require('del'),
    useref = require('gulp-useref'),
    gulpif = require('gulp-if'),
    plumber = require('gulp-plumber'),
    autoprefixer = require('gulp-autoprefixer'),
    concat = require('gulp-concat'),
    sourcemaps = require('gulp-sourcemaps'),
    runSequence = require('run-sequence'),
    gls = require('gulp-live-server');

var paths = {
    build: {
        html: 'build/',
        js: 'build/js/',
        css: 'build/css/',
        font: 'build/font/',
        images: 'build/img'
    },
    sources: {
        html: 'src/*.html',
        js: 'src/js/*.js',
        css: 'src/css/*.css',
        font: 'src/font/*.*',
        images: 'src/img/*.*',
        htc: 'src/*.htc'
    },
    server: 'app.js'
};

gulp.task('server', function() {
    var server = gls.new('app.js');

    function serverNotify(event) {
        server.notify.call(server, event);
    }

    server.start();

    //restart server when file changes
    gulp.watch([
        paths.build.html + '*.html',
        paths.build.css + '.css',
        paths.build.js + '*.js'
    ], serverNotify);

    gulp.watch(paths.server, function() {
        server.start.call(server);
    });
});

gulp.task('clean', function(cb) {
    del(['build/**/*.*'], cb);
});

gulp.task('copyHtc', function() {
   gulp.src(paths.sources.htc)
       .pipe(gulp.dest(paths.build.html));
});

gulp.task('html' , function() {
    var assets = useref.assets();

    gulp.src(paths.sources.html)
        .pipe(plumber())
        .pipe(assets)
        .pipe(sourcemaps.init())
        .pipe(gulpif('*.js', uglify()))
        .pipe(gulpif('*.css', autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false,
            remove: true
        })))
        .pipe(gulpif('*.css', minifyCss()))
        .pipe(sourcemaps.write())
        .pipe(assets.restore())
        .pipe(useref())
        .pipe(gulp.dest(paths.build.html));
});

gulp.task('fonts', function() {
   gulp.src(paths.sources.font)
       .pipe(plumber())
       .pipe(gulp.dest(paths.build.font));
});

gulp.task('images', function() {
   gulp.src(paths.sources.images)
       .pipe(plumber())
       .pipe(gulp.dest(paths.build.images));
});

gulp.task('watch', function() {
    gulp.watch(paths.sources.html, ['html']);
    gulp.watch(paths.sources.js, ['html']);
    gulp.watch(paths.sources.css, ['html']);
    gulp.watch(paths.sources.font, ['fonts']);
    gulp.watch(paths.sources.images, ['images']);
});

gulp.task('build', function() {
    runSequence('clean', ['html', 'fonts', 'images', 'watch', 'copyHtc']);
});

gulp.task('default', function(cb){
    runSequence('build', ['server'], cb);
});