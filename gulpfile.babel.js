'use strict';

import plugins  from 'gulp-load-plugins';
import yargs    from 'yargs';
import browser  from 'browser-sync';
import gulp     from 'gulp';
import panini   from 'panini';
import rimraf   from 'rimraf';
import sherpa   from 'style-sherpa';
import yaml     from 'js-yaml';
import fs       from 'fs';

// Load all Gulp plugins into one variable
const $ = plugins();

// Check for --production flag
const PRODUCTION = !!(yargs.argv.production);

// Load settings from settings.yml
const { COMPATIBILITY, PORT, UNCSS_OPTIONS, PATHS } = loadConfig();

function loadConfig() {
  let ymlFile = fs.readFileSync('config.yml', 'utf8');
  return yaml.load(ymlFile);
}

// Build the "dist" folder by running all of the below tasks
gulp.task('build',
 gulp.series(clean, gulp.parallel(sass, babelscript, plainscript, fonts)));

// Build the site, run the server, and watch for file changes
gulp.task('default',
  gulp.series('build', server, watch));

// Delete the "dist" folder
// This happens every time a build starts
function clean(done) {
  rimraf(PATHS.dist, done);
}

// Copy fonts
function fonts() {
  return gulp.src(PATHS.fonts)
    .pipe(gulp.dest(PATHS.dist + '/fonts'));
}

// Compile Sass into CSS
// In production, the CSS is compressed
function sass() {
  return gulp.src('scss/app.scss')
    .pipe($.sourcemaps.init())
    .pipe($.sass({
      includePaths: PATHS.sass
    })
      .on('error', $.sass.logError))
    .pipe($.autoprefixer({
      browsers: COMPATIBILITY
    }))
    .pipe($.if(PRODUCTION, $.rename({ suffix: '.min' })))
    .pipe($.if(PRODUCTION, $.cssnano()))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/css'))
    .pipe(browser.reload({ stream: true }));
}

// Combine Babel (ES6) JavaScript into one file
// In production, the file is minified
function babelscript() {
  return gulp.src(PATHS.babelscript)
    .pipe($.sourcemaps.init())
    .pipe($.babel())
    .pipe($.concat('app.js'))
    .pipe($.if(PRODUCTION, $.rename({ suffix: '.min' })))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/js'));
}

// Combine plain JavaScript (non-ES6) into one file
// In production, the file is minified
function plainscript() {
  return gulp.src(PATHS.plainscript)
    .pipe($.sourcemaps.init())
    .pipe($.concat('custom.js'))
    .pipe($.if(PRODUCTION, $.rename({ suffix: '.min' })))
    .pipe($.if(PRODUCTION, $.uglify()
      .on('error', e => { console.log(e); })
    ))
    .pipe($.if(!PRODUCTION, $.sourcemaps.write()))
    .pipe(gulp.dest(PATHS.dist + '/js'));
}

// Start a server with BrowserSync to preview the site in
function server(done) {
  browser.init({
      proxy: "https://bugitor.dev"
  });
  done();
}

// Watch for changes to static assets, pages, Sass, and JavaScript
function watch() {
  gulp.watch(PATHS.assets, copy);
  gulp.watch('scss/**/*.scss', sass);
  gulp.watch('js/**/*.js', gulp.series(javascript, browser.reload));
}
