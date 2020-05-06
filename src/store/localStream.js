import { liveBroadcastService } from "@/main";

const state = {
  localAudioStatus: true,
  localVideoStatus: true,
  audioLevel: 0.0,
  isInit: false,
  selfCameraStatus: true
};

const getters = {
  localAudioStatus: state => state.localAudioStatus,
  localVideoStatus: state => state.localVideoStatus,
  audioLevel: state => state.audioLevel,
  isInit: state => state.isInit,
  selfCameraStatus: state => state.selfCameraStatus
};

const mutations = {
  SET_LOCALSTREAM_AUDIO(state, status) {
    if (!liveBroadcastService.trtcService.localStream) return;
    state.localAudioStatus = status;
    if (status) {
      liveBroadcastService.trtcService.localStream.unmuteAudio();
    } else {
      liveBroadcastService.trtcService.localStream.muteAudio();
    }
  },
  SET_LOCALSTREAM_VIDEO(state, status) {
    if (!liveBroadcastService.trtcService.localStream) return;
    state.localVideoStatus = status;
    if (status) {
      liveBroadcastService.trtcService.localStream.unmuteVideo();
    } else {
      liveBroadcastService.trtcService.localStream.muteVideo();
    }
  },
  SET_AUDIOLEVEL(state) {
    if (!liveBroadcastService) return;
    let level = liveBroadcastService.trtcService.getAudioLevel();
    state.audioLevel = level;
  },
  LOCAL_STREAM_PLAY(state, elemntOrId) {
    liveBroadcastService.trtcService.localStreamPlay(elemntOrId);
  },
  LOCAL_STREAM_STOP_PLAY(state) {
    liveBroadcastService.trtcService.localStreamStopPlay();
  },
  IS_INIT(state) {
    state.isInit = true;
  },
  SELF_CAMERA_STATUS(state, status) {
    state.selfCameraStatus = status;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
