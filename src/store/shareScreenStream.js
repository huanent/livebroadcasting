import { liveBroadcastService } from "@/main";

import account from "./account";
const state = {};

const getters = {};

const mutations = {
  async SHARE_SCREEN_PLAY(state, elemntOrId) {
    await liveBroadcastService.trtcService.shareScreenStreamPlay(
      elemntOrId,
      account.state.role
    );
  },
  SHARE_SCREEN_STOP_PLAY(state) {
    liveBroadcastService.trtcService.shareScreenStreamStopPlay(
      account.state.role
    );
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
