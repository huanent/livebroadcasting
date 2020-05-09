const state = {
  onElectronClient: false
};

const getters = {
  onElectronClient: state => state.onElectronClient
};

const mutations = {
  RTC_AVAIABLED(state) {
    state.onElectronClient = true;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
