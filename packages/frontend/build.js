const Bundler = require("parcel-bundler");

const jsFiles = [
  "./src/js/main.js",
  "./src/js/index.js",
  "./src/js/token.js",
  "./src/js/viewUploads.js",
];

const jsOptions = {
  outDir: "./dist/js",
  watch: false,
};

const scssFile = "./src/css/main.scss";

const scssOptions = {
  outDir: "./dist/css",
  watch: false,
};

const jsBundler = new Bundler(jsFiles, jsOptions);
const cssBundler = new Bundler(scssFile, scssOptions);

const bundlers = [
  jsBundler,
  cssBundler
];

bundlers.forEach(async (bundler) => {
  await new Promise(resolve => {
    bundler.on('bundled', resolve)
    bundler.bundle()
  }).catch(e => { })
})