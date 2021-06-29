<template>
  <!-- 页面入口文件 -->
  <keep-alive v-if="$route.meta.keepAlive">
    <router-view></router-view>
  </keep-alive>

  <!-- 不需要被缓存的路由入口 -->
  <router-view v-else></router-view>
</template>

<script>
export default {
  name: "qomo-netdisk",
  mounted: () => {},
};
</script>

<style>
body {
  /* 全局禁用双击选中 */
  user-select: none;
}
.v-card__text {
  user-select: text;
}

code {
  font-family: "Fira Code", Consolas, "DejaVu Sans Mono", Consolas,
    "Courier New", monospace, "Nimbus Mono L", "Luxi Mono", "Courier New" !important;
  font-weight: 500 !important;
}

/* 预览文件时 json文件的格式化 固定宽度 */
.v-card__text > code {
  padding: 10px;
  width: inherit;
  overflow: hidden;
}
</style>
