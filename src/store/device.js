const state = {
  isMobile: false,
  isHorizontal: false
};

const mutations = {
  SET_IS_MOBILE(state, status) {
    state.isMobile = status;
  },
  SET_IS_HORIZONTAL(state, status) {
    state.isHorizontal = status;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
