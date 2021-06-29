import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    path: "C:/Users/momijineko",
    // 预留一个默认json，防止渲染时报错
    diskInfo: [
      {
        name: "Home",
        used: "0 B",
        total: 0,
        pcent: "100%",
      },
    ],
    netdiskInfo: [], // 云盘配额信息
    userInfo: [], // 云盘账号信息
    mvpath: {}, // 复制和剪切用到的路径 type1是复制，type2是粘贴
  },
  mutations: {
    setPath: (state, path) => {
      state.path = path;
    },
    setDiskInfo: (state, diskInfo) => {
      state.diskInfo = diskInfo;
    },
    setNetdiskInfo: (state, netdiskInfo) => {
      state.netdiskInfo = netdiskInfo;
    },
    setUserInfo: (state, userInfo) => {
      state.userInfo = userInfo;
    },
    setMvpath: (state, mvpath) => {
      state.mvpath = mvpath;
    },
  },
  actions: {},
  modules: {},
});
