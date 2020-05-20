import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";

import account from "./account";
const state = {};

const mutations = {
  async SHARE_SCREEN_PLAY(state, data) {
    await liveBroadcastService.trtcService.shareScreenStreamPlay(
      data,
      account.state.role
    );
  },
  SHARE_SCREEN_STOP_PLAY(state, data) {
    liveBroadcastService.trtcService.shareScreenStreamStopPlay(
      data,
      account.state.role
    );
  },
  INIT_STATE(state) {
    state = {};
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
