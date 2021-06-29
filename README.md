# Qomo-Netdisk - 酷猫云盘管理器

> Vue + Vuetify + Electron + VueAxios + VueRouter + Vuex + LowDB

- Node version: v13.12.0
- NPM version: 6.14.4
- Yarn version: 1.22.4

原仓库为位于 Gitee 的私有仓库，由于提交内容包含敏感信息未直接进行仓库迁移

## Project setup

```bash
# change to taobao mirror
# 避免依赖下载失败，将默认源切换为国内源（如淘宝镜像源）
npm config set registry https://registry.npm.taobao.org/
npm config set sass_binary_site=http://npm.taobao.org/mirrors/node-sass
npm config set ELECTRON_MIRROR http://npm.taobao.org/mirrors/electron/

yarn install
```

### Compiles and hot-reloads for development

```bash
yarn serve

# or

yarn start

# for electron

yarn electron:serve
```

### Compiles and minifies for production

```bash
yarn build

# for electron

yarn electron:build
```

### Lints and fixes files

```
yarn lint
```

### Customize configuration

See [Configuration Reference](https://cli.vuejs.org/config/).
