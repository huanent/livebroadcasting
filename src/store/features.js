import store from "@/store";
import { liveBroadcastService } from "../core/live-broadcast/live-broadcast-service";
export const initFeaturesState = function(role) {
  let isTeacher = role === "ROLE_TEACHER";
  return {
    timestamp: 1,
    canControlBoard: isTeacher,
    videoStatus: true,
    audioStatus: true,
    subscribeVideo: true,
    subscribeAudio: true,
    handUp: isTeacher
  };
};

const state = {
  timestamp: 1,
  canControlBoard: false,
  videoStatus: true,
  audioStatus: true,
  subscribeVideo: true,
  subscribeAudio: false,
  handUp: false
};

const mutations = {
  SET_VIDEO_STATUS(state, status) {
    state.videoStatus = status;
  },
  SET_AUDIO_STATUS(state, status) {
    state.audioStatus = status;
  },
  HAND_UP(state) {
    state.handUp = true;
  },
  INIT_STATE(state, role) {
    let data = initFeaturesState(role);
    for (let i in data) {
      state[i] = data[i];
    }
  },
  SET_TIMESTAMP(state, data) {
    state.timestamp = data;
  }
};

const actions = {
  manualControlFeatures({ commit }, { id, propName, value }) {
    liveBroadcastService.timService.sendSystemMsg("STATE_SYNC", id, {
      value: value,
      path: ["features", propName]
    });
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
