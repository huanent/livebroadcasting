import { liveBroadcastService } from "@/main";

const state = {};

const getters = {};

const mutations = {
  async LOCAL_SHARE_SCREEN_PLAY(state, elemntOrId) {
    liveBroadcastService.trtcService.localShareScreenStreamPlay(elemntOrId);
  },
  LOCAL_SHARE_SCREEN_STOP_PLAY(state) {
    liveBroadcastService.trtcService.localShareScreenStreamStopPlay();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
