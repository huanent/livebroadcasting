const state = {
  isMobile: false
};

const mutations = {
  SET_IS_MOBILE(state, status) {
    state.isMobile = status;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
