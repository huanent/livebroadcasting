import { liveBroadcastService } from "@/main";

const state = {
  localAudioStatus: true,
  localVideoStatus: true
};

const getters = {
  localAudioStatus: state => state.localAudioStatus,
  localVideoStatus: state => state.localVideoStatus
};

const mutations = {
  SET_LOCALSTREAM_AUDIO(state, status) {
    if (!liveBroadcastService.localStream) return;
    state.localAudioStatus = status;
    if (status) {
      liveBroadcastService.localStream.unmuteAudio();
    } else {
      liveBroadcastService.localStream.muteAudio();
    }
  },
  SET_LOCALSTREAM_VIDEO(state, status) {
    if (!liveBroadcastService.localStream) return;
    state.localVideoStatus = status;
    if (status) {
      liveBroadcastService.localStream.unmuteVideo();
    } else {
      liveBroadcastService.localStream.muteVideo();
    }
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
