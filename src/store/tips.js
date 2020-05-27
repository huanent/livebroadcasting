import { app } from "../main";
const state = {};
const mutations = {};
let setTimeoutPromise = function(cb, time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(cb());
    }, time);
  });
};
const actions = {
  async cameraError({ commit, dispatch }, preload) {
    app.$message.error("获取摄像头失败，摄像头可能被占用或者发生故障");
    return await dispatch("redirectIndex");
  },
  async microphonesError({ commit, dispatch }, preload) {
    app.$message.error("获取麦克风失败，麦克风可能被占用或者发生故障");
    return await dispatch("redirectIndex");
  },
  async browserNotSupport({ commit, dispatch }, preload) {
    app.$message.error("当前浏览器版本太低，请下载最新的谷歌浏览器");
    return setTimeoutPromise(() => {
      window.open("https://www.google.cn/chrome/", "_self");
    }, 3000);
  },
  async notAccessDevice({ commit, dispatch }, preload) {
    app.$message.error("未获得设备权限，请在浏览器分别打开麦克风和摄像头权限");

  },
  async redirectIndex() {
    return await setTimeoutPromise(() => {
      app.$router.push("/");
    }, 3000);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
