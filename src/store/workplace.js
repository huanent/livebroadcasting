const state = {
  activeBoardIndex: 0,
  boardProfiles: []
};

const getters = {
  activeBoardIndex: state => {
    return state.activeBoardIndex;
  },
  boardProfiles: state => {
    return state.boardProfiles;
  }
};

const mutations = {
  // 设置画笔颜色
  BOARD_PROFILES(state, boardProfiles) {
    state.boardProfiles = boardProfiles;
  },
  BOARD_INDEX(state, index) {
    state.activeBoardIndex = index;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations
};
