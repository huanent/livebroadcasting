const state = {
  isMobile: false
};

const getters = {
  isMobile: state => state.isMobile
};

const mutations = {
  SET_IS_MOBILE(state, status) {
    state.isMobile = status;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
