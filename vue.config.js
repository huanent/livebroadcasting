const path = require("path");
// const isDev = process.env.NODE_ENV === "development";
function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  devServer: {
    overlay: {
      warnings: false,
      errors: false
    },
    proxy: {
      "/api": {
        target: "http://oa.jinrui.kooboo.site",
        changeOrigin: true
      }
    }
  },
  css: {
    sourceMap: true,
    loaderOptions: {
      scss: {
        prependData: `@import "~@/assets/style/variable.scss";`
      }
    }
  },
  productionSourceMap: false,
  pluginOptions: {
    i18n: {
      locale: "en",
      fallbackLocale: "en",
      localeDir: "locales",
      enableInSFC: false
    }
  },
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("./src"))
      .set("@c", resolve("./src/components"))
      .set("@v", resolve("./src/views"))
      .set("@style", resolve("./src/assets/style"));
    config.plugin("html").tap(options => {
      options[0].title = "live boardcasting";
      return options;
    });
    config.entry.app = ["babel-polyfill", "./src/main.js"];
  }
};
