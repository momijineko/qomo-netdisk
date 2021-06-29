module.exports = {
  devServer: {
    disableHostCheck: false, // 如果为 true 不检查 host 就不能热更新
  },
  transpileDependencies: ["vuetify"],
  // 操作 webpack 配置
  chainWebpack: (config) => {
    config.plugin("html").tap((args) => {
      args[0].title = "酷猫云盘";
      return args;
    });
  },
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "酷猫云盘",
        linux: {
          target: ["deb", "rpm", "AppImage"],
          category: "Application",
        },
      },
    },
  },
};
