"use strict";

const APP = "src";

const gulp = require("gulp");
const server = require("gulp-server-livereload");

const fileInclude = require("gulp-file-include");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const rename = require("gulp-rename");
const sourcemaps = require("gulp-sourcemaps");
const postcss = require("gulp-postcss");
const autoprefixer = require("autoprefixer");

const fileIncludeSettings = {
  prefix: "@@",
  basepath: "@file",
};

gulp.task("includeFiles", function () {
  return gulp
    .src("./src/*.html")
    .pipe(fileInclude(fileIncludeSettings))
    .pipe(gulp.dest("./"));
});

gulp.task("sass", function () {
  return gulp
    .src("./src/scss/*.scss")
    .pipe(sourcemaps.init())
    .pipe(sass().on("error", sass.logError))
    .pipe(postcss([autoprefixer()]))
    .pipe(gulp.dest("./"));
});

function buildStyles() {
  return gulp
    .src(`./${APP}/scss/pages/*.scss`)
    .pipe(sourcemaps.init())
    .pipe(
      sass({
        includePaths: ["node_modules"],
      }).on("error", sass.logError)
    )
    .pipe(gulp.dest(`./${APP}/styles`))
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(rename({ suffix: ".min" }))
    .pipe(sourcemaps.write(`./`))
    .pipe(gulp.dest(`./${APP}/styles`));
}

exports.buildStyles = buildStyles;

exports.default = gulp.series(buildStyles, "includeFiles", function () {
  gulp.src("./").pipe(
    server({
      livereload: true,
      open: true,
      defaultFile: "index.html",
    })
  );

  gulp.watch(`./${APP}/scss/**/*.scss`, gulp.series(buildStyles));
  gulp.watch("./src/*.html", gulp.series("includeFiles"));
});
