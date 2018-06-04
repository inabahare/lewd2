const gulp = require("gulp");
const minifyCSS = require("gulp-csso");
const less = require("gulp-less");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const watch = require("gulp-watch");
const copy = require("gulp-copy");
const notify = require("gulp-notify");
const plumber = require("gulp-plumber");
const del = require("del");
require("babel-core/register");
require("babel-polyfill");

const paths = {
    styles: {
        src:"src/Public/CSS/main.less",
        dest: "build/Public/CSS",
    },
    js: {
        src: "src/**/*.js",
        dest: "build",
    },
    moveViews: {
        src: "src/views/**/*.hbs",
        dest: "build/views/",
    }
}

const handler = {
    errorHandler: err => notify.onError({
                                         title: "Gulp error in: " + err.plugin,
                                         message: err.toString(),
                                        })(err),
};

const clean = () => del(["build"]);

const styles = () => gulp.src(paths.styles.src)
                         .pipe(plumber(handler))
                         .pipe(less())
                         .pipe(minifyCSS())
                         .pipe(gulp.dest(paths.styles.dest));

const scripts = () => gulp.src(paths.js.src)
                          .pipe(plumber(handler))
                          .pipe(sourcemaps.init())
                          .pipe(babel())
                          .pipe(sourcemaps.write("."))
                          .pipe(gulp.dest(paths.js.dest));

const views = () => gulp.src(paths.moveViews.src)
                        .pipe(gulp.dest(paths.moveViews.dest));

const build = gulp.series(clean, gulp.parallel(styles, scripts, views));

const watcher = () => {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.js.src, scripts);
    gulp.watch(paths.moveViews.src, views)
}

gulp.task("build", build);
gulp.task("watch", watcher);
gulp.task("default", build);
