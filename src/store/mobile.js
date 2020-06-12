const state = {
  showChat: false,
  showSetting: false,
  showBoardTool: false,
  hideSidebar: false,
  showFiles: false,
};

const mutations = {
  SET_VISIBLE(state, prop) {
    for (const key in state) {
      if (key.startsWith("show") && key != prop) {
        state[key] = false;
      }
    }

    state[prop] = !state[prop];
  },
  TOGGLE_SIDEBAR(state) {
    state.hideSidebar = !state.hideSidebar
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
