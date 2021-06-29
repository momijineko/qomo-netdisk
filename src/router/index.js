import Vue from "vue";
import VueRouter from "vue-router";
import appRoutes from "./app/index";

Vue.use(VueRouter);

const router = new VueRouter({
  mode: "hash",
  base: process.env.BASE_URL,
  routes: [...appRoutes],
});

export default router;
