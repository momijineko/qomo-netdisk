import Vue from "vue";
import axios from "./plugins/axios";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import vuetify from "./plugins/vuetify";
import db from "./db";

Vue.prototype.$db = db;
Vue.prototype.$axios = axios;
Vue.config.productionTip = false;

// 动态路由标题
router.beforeEach((to, from, next) => {
  if (to.meta.title && to.path != "/") {
    document.title = to.meta.title + " - 酷猫云盘";
  } else {
    document.title = to.meta.title;
  }
  next();
});

new Vue({
  router,
  store,
  vuetify,
  db,
  axios,
  render: (h) => h(App),
}).$mount("#app");
