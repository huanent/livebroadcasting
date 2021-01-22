import { liveBroadcastService } from "../core/live-broadcast";
import { HAND_UP_STATUS } from "../models/handUpStatus";
import { ROLE } from "../models/role";
export const initFeaturesState = function(role) {
  let isTeacher = role === ROLE.TEACHER;
  return {
    timestamp: 1,
    canControlBoard: isTeacher,
    videoStatus: true,
    audioStatus: true,
    subscribeVideo: isTeacher,
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
        liveBroadcastService.trtcService.toAudience();
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
        state.subscribeVideo = false;
        liveBroadcastService.trtcService.toAudience();
        break;
      case HAND_UP_STATUS.SPEAKING:
        state.subscribeAudio = true;
        state.subscribeVideo = true;
        state.canControlBoard = false;
        liveBroadcastService.trtcService.publish();
        break;
      case HAND_UP_STATUS.DRAWING:
        state.subscribeAudio = true;
        state.subscribeVideo = true;
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
  },
  SET_SUBSCRIBE_AUDIO(state, data) {
    state.subscribeAudio = data;
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
