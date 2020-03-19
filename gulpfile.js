/*
 *
 * Gulp 4.0.0 Tasks
 * @desc : Compile SASS to CSS, Pug to HTML and watch for SCSS, JS, HTML changes
 * @author: Sanath Kashyap
 * @company: Moonraft Innovation Pvt Ltd
 *
 */

"use strict";

// Dependencies
const gulp = require('gulp');
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const browserSync = require('browser-sync').create();

//Paths
var scssSrcPath = './src/**/*.scss';
var pugSrcPath = './src/**/*.pug'
var jsSrcPath = './src/**/*.js';
var destFolder = "./build";
var fontsPath = './src/assets/fonts/**/*.{ttf,woff,eof}';
var imagesPath = './src/assets/images/**/*.{svg,gif,jpg,png}';

//Compile SASS to CSS
function genCss() {
    return gulp
        // Destination of source files
        .src(scssSrcPath)
        // Initialize sourcemaps before compilation starts
        // .pipe(sourcemaps.init())
        // Use sass with the files found, and log any errors
        .pipe(sass())
        // Log errors in cmd
        .on("error", sass.logError)
        // Use postcss with autoprefixer and compress the compiled file using cssnano
        // .pipe(postcss([autoprefixer(), cssnano()]))
        // Now add/write the sourcemaps
        // .pipe(sourcemaps.write('.'))
        // Destination for the compiled file
        .pipe(gulp.dest(destFolder))
        // Add browsersync stream pipe after compilation
        .pipe(browserSync.stream());
}

//Compile Pug to HTML
function genHtml() {
    return gulp
        // Destination of source file
        .src(pugSrcPath)
        // Convert the obtained pug file into HTML
        .pipe(pug({
            doctype: 'html',
            pretty: true
        }))
        // Destination for the compiled file
        .pipe(gulp.dest(destFolder));
}

//Copy JS to build folder
function copyJs() {
    return gulp
        // Destination of source file
        .src(jsSrcPath)
        // Destination for the compiled file
        .pipe(gulp.dest(destFolder));
}

function copyFonts() {
    return gulp.src(fontsPath)
        .pipe(gulp.dest('./build/assets/fonts'));
}

function copyImages() {
    return gulp.src(imagesPath)
        .pipe(gulp.dest('./build/assets/images'));
}

function copyToFirebase() {
    return gulp.src('./build/**')
        .pipe(gulp.dest('./y'));
}

function watch() {
    // You can tell browserSync to use this directory and serve it as a mini-server
    browserSync.init({
        server: {
            baseDir: "./build",
            index: 'pages/index.html'
        }
        // If you are already serving your website locally using something like apache
        // You can use the proxy setting to proxy that instead
        // proxy: "yourlocal.dev"
    });
    // gulp.watch takes in the location of the files to watch for changes
    // and the name of the function we want to run on change

    // Compile chnaged scss files
    gulp.watch(scssSrcPath, genCss);
    // Reload page on pug change
    gulp.watch(pugSrcPath, genHtml).on('change', browserSync.reload);
    // Reload page on js change
    gulp.watch(jsSrcPath, copyJs).on('change', browserSync.reload);
    gulp.watch(fontsPath, copyFonts).on('change', browserSync.reload);
    gulp.watch(imagesPath, copyImages).on('change', browserSync.reload);
}

var genFiles = gulp.parallel(genCss, copyJs);
var genAssets = gulp.parallel(copyFonts, copyImages, copyToFirebase);
var build = gulp.series(genAssets, genHtml, genFiles, watch);

exports.style = genCss;
exports.genHtml = genHtml;
exports.copyJs = copyJs;
exports.watch = watch;
exports.build = build;
exports.default = build;
