// MAIN REQUIRED
const {src, dest, parallel, watch} = require('gulp');

const fileinclude = require('gulp-file-include');
const twig = require('gulp-twig');
const del = require('del');

// Browser-sync
const browserSync = require('browser-sync').create();

function browsersync() {
    browserSync.init({
        server: { baseDir: 'public/' },
        notify: true,
        online: true
    });
}

exports.browsersync = browsersync;





// Images
const imagemin = require('gulp-imagemin');
const newer = require('gulp-newer');

function images() {
    return src('src/assets/images/**/*')
    .pipe(newer('public/assets/images/**/*'))
    .pipe(imagemin())
    .pipe(dest('public/assets/images/'))
}

function cleanImg() {
    return del(('public/assets/images/**/*', { force: true }));
}

exports.images = images;
exports.cleanImg = cleanImg;





// HTMLS
const htmlBeautify = require('gulp-html-beautify');
function htmls() {
    return src('src/pages/*.htm')
    .pipe(twig())
    .pipe(htmlBeautify())
    .pipe(dest('public/'))
    .pipe(browserSync.stream())
}

exports.htmls = htmls;





// Styles
const less = require('gulp-less');
const cleancss = require('gulp-clean-css');
const autoprefixer = require('gulp-autoprefixer');

function styles() {
    return src('src/assets/less/**/*.less',)
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(less())
    .pipe(autoprefixer({ overrideBrowserslist: ['last 10 versions'], grid: true }))
    .pipe(cleancss(( { level: { 1: { specialComments: 0 } }, format: 'beautify' } )))
    .pipe(dest('public/assets/css'))
    .pipe(browserSync.stream())
}

exports.styles = styles;





// Scripts
// const concat = require('gulp-concat');
// const uglify = require('gulp-uglify-es').default;

function scripts() {
    return src('src/assets/js/**/*.js')
    .pipe(fileinclude({
        prefix: '@@',
        basepath: '@file'
    }))
    .pipe(dest('public/assets/js/'))
    .pipe(browserSync.stream())
}

exports.scripts = scripts;





// SERVICES
function clearPublic() {
    return del('public/**/*', { force: true })
}

function startWatch() {
    watch('src/assets/less/**/*.less', styles);
    watch('src/assets/js/**/*.js', scripts);
    watch('src/**/*.htm',htmls);
    // watch('public/**/*.html').on('change', browserSync.reload);
    watch('src/assets/images/**/*').on('change', images);
}

exports.clearPublic = clearPublic;
exports.default = parallel(htmls, styles, scripts, images, browsersync, startWatch);
