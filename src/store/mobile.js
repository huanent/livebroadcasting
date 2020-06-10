const state = {
  showChat: false
};

const mutations = {
  SET_CHAR_VISIBLE(state) {
    state.showChat = !state.showChat;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
