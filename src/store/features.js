import store from "@/store";
export const initFeaturesState = function(role) {
  let isTeacher = role === "ROLE_TEACHER";
  return {
    timestamp: 1,
    cameraPanelVisibity: isTeacher,
    cameraPanelToggleButtonVisibity: isTeacher,
    canClickboardTabs: isTeacher,
    canControlBoard: isTeacher
  };
};
const state = initFeaturesState();

const mutations = {
  SET_CAMERA_PANEL_VISIBILITY(state, status) {
    state.cameraPanelVisibity = status;
  },
  INIT_STATE(state, role) {
    let data = initFeaturesState(role);
    for (let i in data) {
      state[i] = data[i];
    }
    console.log(state);
  },
  SET_TIMESTAMP(state, data) {
    state.timestamp = data;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
