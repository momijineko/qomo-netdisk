import NormalLayout from "@/layouts/NormalLayout";

const setting = () => import(/* webpackChunkName: 'setting' */ "@/views/Setting");
const disk = () =>
  import(/* webpackChunkName: 'settingDisk' */ "@/views/Setting/Disk");

const settingRoutes = [
  {
    path: "setting",
    component: NormalLayout,
    children: [
      {
        path: "/",
        name: "Setting",
        component: setting,
        meta: {
          title: "设置",
          keepAlive: false,
        },
      },
      {
        path: "disk",
        name: "DiskManage",
        component: disk,
        meta: {
          title: "云盘管理",
          keepAlive: false,
        },
      },
    ],
  },
];

export default settingRoutes;
