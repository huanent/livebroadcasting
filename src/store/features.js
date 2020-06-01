import { liveBroadcastService } from "../core/live-broadcast/live-broadcast-service";
import { HAND_UP_STATUS } from "../models/handUpStatus";
export const initFeaturesState = function(role) {
  let isTeacher = role === "ROLE_TEACHER";
  return {
    timestamp: 1,
    canControlBoard: isTeacher,
    videoStatus: true,
    audioStatus: true,
    subscribeVideo: true,
    subscribeAudio: isTeacher,
    handUp: HAND_UP_STATUS.NONE,
    globalMessage: true,
    selfMessage: true,
    classing: true
  };
};

const state = {
  timestamp: 1,
  canControlBoard: false,
  videoStatus: true,
  audioStatus: true,
  subscribeVideo: true,
  subscribeAudio: false,
  handUp: HAND_UP_STATUS.NONE,
  globalMessage: true,
  selfMessage: true,
  classing: true
};

const mutations = {
  SET_VIDEO_STATUS(state, status) {
    state.videoStatus = status;
  },
  SET_AUDIO_STATUS(state, status) {
    state.audioStatus = status;
  },
  SET_GLOBAL_MESSAGE(state, status) {
    state.globalMessage = status;
  },
  SET_SELF_MESSAGE(state, status) {
    state.selfMessage = status;
  },
  HAND_UP(state) {
    switch (state.handUp) {
      case HAND_UP_STATUS.NONE:
        state.handUp = HAND_UP_STATUS.UPING;
        break;
      case HAND_UP_STATUS.UPING:
      case HAND_UP_STATUS.SPEAKING:
      case HAND_UP_STATUS.DRAWING:
        state.handUp = HAND_UP_STATUS.NONE;
        break;
      default:
        break;
    }
  },
  SWITCH_SPEAKING(state, value) {
    switch (value) {
      case HAND_UP_STATUS.NONE:
        state.handUp = HAND_UP_STATUS.NONE;
        state.canControlBoard = false;
        state.subscribeAudio = false;
        break;
      case HAND_UP_STATUS.SPEAKING:
        state.subscribeAudio = true;
        state.canControlBoard = false;
        break;
      case HAND_UP_STATUS.DRAWING:
        state.canControlBoard = true;
        break;
      default:
        break;
    }
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
