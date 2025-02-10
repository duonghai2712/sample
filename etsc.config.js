// eslint-disable-next-line @typescript-eslint/no-var-requires
const esbuildPluginTsc = require("esbuild-plugin-tsc");

module.exports = {
  outDir: "./dist",
  esbuild: {
    minify: false,
    target: "es2017",
    plugins: [esbuildPluginTsc()],
  },
  assets: {
    baseDir: "src",
    outDir: "./dist",
    filePatterns: ["**/*.json", "**/*.proto"],
  },
};
