import store from "@/store";
export const initFeaturesState = function(role) {
  let isTeacher = role === "ROLE_TEACHER";
  return {
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
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
