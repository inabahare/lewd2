const gulp = require("gulp");
const minifyCSS = require("gulp-csso");
const less = require("gulp-less");
const babel = require("gulp-babel");
const sourcemaps = require("gulp-sourcemaps");
const watch = require("gulp-watch");
const copy = require("gulp-copy");

gulp.task("css", () => watch("src/Public/CSS/main.less", () => gulp.src("src/Public/CSS/main.less")
                                                                   .pipe(less().on("error", e => console.log(e)))
                                                                   .pipe(minifyCSS())
                                                                   .pipe(gulp.dest("build/Public/CSS"))));

gulp.task("js", () => watch("src/**/*.js", () => gulp.src("src/**/*.js")
                                                     .pipe(sourcemaps.init())
                                                     .pipe(babel().on("error", e => console.log(e)))
                                                     .pipe(sourcemaps.write("."))
                                                     .pipe(gulp.dest("build"))));

gulp.task("move-views", () => watch("src/views/**/*.hbs", () => gulp.src("src/views/**/*.hbs")
                                                                    .pipe(gulp.dest("build/views/"))));


gulp.task("default", [
    "css", "js", "move-views"
]);