import NormalLayout from "@/layouts/NormalLayout";

const disk = () => import(/* webpackChunkName: 'disk' */ "@/views/Disk");
const login = () =>
  import(/* webpackChunkName: 'diskLogin' */ "@/views/Disk/Login");
const info = () =>
  import(/* webpackChunkName: 'diskInfo' */ "@/views/Disk/Info");

const diskRoutes = [
  {
    path: "disk",
    component: NormalLayout,
    children: [
      {
        path: "/",
        name: "Disk",
        component: disk,
        meta: {
          title: "我的云盘",
          keepAlive: false,
        },
      },
      {
        path: "login",
        name: "Login",
        component: login,
        meta: {
          title: "云盘登录",
          keepAlive: false,
        },
      },
      {
        path: "info",
        name: "Info",
        component: info,
        meta: {
          title: "云盘信息",
          keepAlive: false,
        },
      },
    ],
  },
];

export default diskRoutes;
