// 基于 applayout 布局下的路由
import Home from "@/views/Home";
import AppLayout from "@/layouts/AppLayout";
import NormalLayout from "@/layouts/NormalLayout";
import diskRoutes from './disk' // disk 页面路由
import settingRoutes from './setting' // setting 页面路由

// route level code-splitting
// this generates a separate chunk (about.[hash].js) for this route
// which is lazy-loaded when the route is visited.
const about = () => import(/* webpackChunkName: 'about' */ "@/views/About");
const search = () => import(/* webpackChunkName: 'search' */ "@/views/Search");

const appRoutes = [
  // app 布局路由
  {
    path: "/",
    component: AppLayout,
    children: [
      {
        path: "/",
        name: "Home",
        component: Home,
        meta: {
          title: "酷猫云盘",
          keepAlive: false,
        },
      },
      {
        path: "about",
        name: "About",
        component: about,
        meta: {
          title: "关于",
          keepAlive: false,
        },
      },
      ...diskRoutes,
      ...settingRoutes
    ],
  },
  // normal 布局路由
  {
    path: "/search",
    component: NormalLayout,
    children: [
      {
        path: "/",
        name: "Search",
        component: search,
        meta: {
          title: "搜索",
          keepAlive: false,
        },
      },
    ],
  },
];

export default appRoutes;
