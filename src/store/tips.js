import { app } from "../main";
const state = {};
const mutations = {};

const actions = {
  cameraError({ commit, dispatch }, preload) {
    app.$message.error("获取摄像头失败，摄像头可能被占用或者发生故障");
    dispatch("redirectIndex");
  },
  microphonesError({ commit, dispatch }, preload) {
    app.$message.error("获取麦克风失败，麦克风可能被占用或者发生故障");
    dispatch("redirectIndex");
  },
  redirectIndex() {
    setTimeout(() => {
      app.$router.push("/");
    }, 2000);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
