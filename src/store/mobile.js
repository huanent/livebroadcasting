const state = {
  showChat: false,
  showSetting: false
};

const mutations = {
  SET_VISIBLE(state, prop) {
    for (const key in state) {
      if (key.startsWith("show")) {
        state[key] = false;
      }
    }

    state[prop] = !state[prop];
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
