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
  manualControlFeatures({ commit }, payload) {
    if (payload.propName) {
      liveBroadcastService.timService.sendSystemMsg("STATE_SYNC", payload.id, {
        value: payload.value,
        path: ["features", payload.propName]
      });
    } else {
      let value = payload.value.map(m => ({
        value: m.value,
        path: ["features", m.propName]
      }));

      liveBroadcastService.timService.sendSystemMsg(
        "STATE_SYNC",
        payload.id,
        value
      );
    }
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
