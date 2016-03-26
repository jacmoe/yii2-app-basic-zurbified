'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import rimraf   from 'rimraf';
import yaml     from 'js-yaml';
import fs       from 'fs';
import del      from 'del';

// Load all Gulp plugins into one variable
const $ = plugins();

// Load settings from settings.yml
const { COMPATIBILITY, UNCSS_OPTIONS, PATHS } = loadConfig();

function loadConfig() {
    let ymlFile = fs.readFileSync('config.yml', 'utf8');
    return yaml.load(ymlFile);
}

var sassOptions = {
    errLogToConsole: true,
    outputStyle: 'expanded',
    includePaths: PATHS.sass
};

var autoprefixerOptions = {
    browsers: COMPATIBILITY
};

// Styles
gulp.task('styles', function() {
    return gulp.src('scss/all.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass(sassOptions).on('error', sass.logError))
    .pipe($.autoprefixer(autoprefixerOptions))
    .pipe($.sourcemaps.write('.', { sourceRoot: '../../scss/' }))
    .pipe(gulp.dest('web/css'))
    .pipe($.if('*.css', rename({ suffix: '.min' })))
    .pipe($.if('*.css', $.cssnano()))
    .pipe($.if('*.css', gulp.dest('web/css')))
    .pipe($.if('*.css', $.notify({ message: 'Styles task complete' })));
});

// Scripts
gulp.task('scripts', function() {
    return gulp.src(PATHS.javascript)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat('all.js'))
    .pipe($.sourcemaps.write('.', { sourceRoot: '../../js/' }))
    .pipe(gulp.dest('web/js'))
    .pipe($.if('*.js', $.rename({ suffix: '.min' })))
    .pipe($.if('*.js', $.uglify()))
    .pipe($.if('*.js', gulp.dest('web/js')))
    .pipe($.if('*.js', $.notify({ message: 'Scripts task complete' })));
});

// Copy fonts
gulp.task('fonts', function() {
    return gulp.src([
        'vendor/bower/font-awesome/fonts/*'
    ])
    .pipe(gulp.dest('./web/fonts'));
});

// Clean
gulp.task('clean', function() {
    return del(['web/css/*', 'web/js/*', 'web/fonts/*']);
});

// Build the "web" folder by running all of the above tasks
gulp.task('build', function(callback) {
    runSequence('clean', ['styles', 'scripts', 'fonts'], callback);
});

// Watch
gulp.task('watch', function() {

    // Initialize Browsersync
    browsersync.init({
        proxy: "http://foundationtest.dev"
    });

    // Watch .scss files
    gulp.watch('scss/**/*.scss', ['styles']);

    // Watch .js files
    gulp.watch('js/**/*.js', ['scripts']);

    // Watch image files
    //gulp.watch('img/**/*', ['images']);

    // Watch any view files in 'views', reload on change
    gulp.watch(['views/**/*.php']).on('change', browsersync.reload);

    // Watch any files in 'web', reload on change
    gulp.watch(['web/js/*']).on('change', browsersync.reload);
    gulp.watch(['web/css/*']).on('change', browsersync.reload);
});

gulp.task('default', ['build', 'watch'], function() {});
