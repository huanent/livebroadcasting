import { liveBroadcastService } from "@/main";

const state = {
  localAudioStatus: true,
  localVideoStatus: true,
  audioLevel: 0.0
};

const getters = {
  localAudioStatus: state => state.localAudioStatus,
  localVideoStatus: state => state.localVideoStatus,
  audioLevel: state => state.audioLevel
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
  },
  SET_AUDIOLEVEL(state) {
    if (!liveBroadcastService) return;
    let level = liveBroadcastService.getAudioLevel();
    state.audioLevel = level;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
