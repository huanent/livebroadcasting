const state = {
  activeBoardIndex: 0,
  boardProfiles: []
};

const getters = {};

const mutations = {
  // 设置画笔颜色
  SET_BOARD_PROFILES(state, boardProfiles) {
    state.boardProfiles = boardProfiles;
  },
  SET_BOARD_index(state, index) {
    state.activeBoardIndex = index;
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
