const gulp = require("gulp");
const minifyCSS = require("gulp-csso");
const less = require("gulp-less");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");

gulp.task("css", () => gulp.src("Public/CSS/*.less")
                           .pipe(less())
                           .pipe(minifyCSS())
                           .pipe(gulp.dest("Public/CSS")));

gulp.task("js", () => gulp.src("Public/JS/main.js")
                          .pipe(sourcemaps.init())
                          .pipe(babel())
                          .pipe(sourcemaps.write("."))
                          .pipe(gulp.dest("Public/JS/dev")));



gulp.task("default", [
    "css", "js"
]);