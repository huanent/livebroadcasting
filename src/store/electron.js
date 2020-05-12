const state = {
  onElectronClient: false,
  streamSelectVisibility: false
};

const mutations = {
  RTC_AVAIABLED(state) {
    state.onElectronClient = true;
  },
  STREAM_SELECT_VISIBILITY(state, status) {
    state.streamSelectVisibility = status;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
