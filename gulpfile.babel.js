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

const paths = {
    styles: {
        src:"Public/CSS/main.less",
        dest: "Public/CSS",
    },
    js: {
        src: ["src/**/*.js",],
        dest: "build",
    }
}

const handler = {
    errorHandler: err => notify.onError({
                                         title: "Gulp error in: " + err.plugin,
                                         message: err.lineNumber + err.toString(),
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



const build = gulp.series(clean, gulp.parallel(styles, scripts));

const watcher = () => {
    gulp.watch(paths.styles.src, styles);
    gulp.watch(paths.js.src, scripts);
}

gulp.task("build", build);
gulp.task("watch", watcher);
gulp.task("default", build);
