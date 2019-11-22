// Initialize Modules
var { src, dest, watch, series } = require("gulp");
var sass = require("gulp-sass");
var uglify = require("gulp-uglify");
var plumber = require("gulp-plumber");
var wait = require("gulp-wait");
var rename = require("gulp-rename");

// File Path Variables
const files = {
  scssPath: "scss/styles.scss",
  jsPath: "js/scripts.js",
  cssDest: "./css",
  jsDest: "./js"
};

// SASS
function compileScss() {
  return src(files.scssPath)
    .pipe(wait(250))
    .pipe(sass({ outputStyle: "compressed" }).on("error", sass.logError))
    .pipe(dest(cssDest));
}

// JS
function compileJs() {
  return src(files.jsPath)
    .pipe(
      plumber(
        plumber({
          errorHandler: function(err) {
            console.log(err);
            this.emit("end");
          }
        })
      )
    )
    .pipe(
      uglify({
        output: {
          comments: "/^!/"
        }
      })
    )
    .pipe(rename({ extname: ".min.js" }))
    .pipe(dest(jsDest));
}

// Watch
function watchFiles() {
  watch(jsPath, series(compileJs));
  watch(scssPath, series(compileScss));
}

// Default
exports.default = series(compileScss, compileJs, watchFiles);
