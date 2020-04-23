const state = {
  activeBoardIndex: 0,
  boardProfiles: [],
  boardTotalPage: 1,
  boardNumber: 1,
  boardScale: 100
};

const getters = {
  activeBoardIndex: state => {
    return state.activeBoardIndex;
  },
  boardProfiles: state => {
    return state.boardProfiles;
  },
  boardTotalPage: state => {
    return state.boardTotalPage;
  },
  boardNumber: state => {
    return state.boardNumber;
  },
  boardScale: state => {
    return state.boardScale;
  }
};

const mutations = {
  // 设置画笔颜色
  BOARD_PROFILES(state, boardProfiles) {
    state.boardProfiles = boardProfiles;
  },
  BOARD_INDEX(state, index) {
    state.activeBoardIndex = index;
  },
  BOARD_TOTAL_PAGE(state, boardTotalPage) {
    state.boardTotalPage = boardTotalPage;
  },
  BOARD_NUMBER(state, boardNumber) {
    state.boardNumber = boardNumber;
  },
  BOARD_NUMBER_INCREASE(state, boardNumber) {
    state.boardNumber++;
    liveBroadcastService.getActiveBoard().nextBoard();
  },
  BOARD_NUMBER_DECREASE(state, boardNumber) {
    state.boardNumber--;
    liveBroadcastService.getActiveBoard().prevBoard();
  },
  BOARD_SCALE(state, boardScale) {
    state.boardScale = boardScale;
    /*    liveBroadcastService.getActiveBoard().setBoardScale(state.boardScale);
    liveBroadcastService.getActiveBoard().reset();*/
  },
  BOARD_SCALE_INCREASE(state, stepScale) {
    state.boardScale = state.boardScale + stepScale;
    /*    liveBroadcastService.getActiveBoard().setBoardScale(state.boardScale);
    liveBroadcastService.getActiveBoard().reset();*/
  },
  BOARD_SCALE_DECREASE(state, stepScale) {
    state.boardScale = state.boardScale - stepScale;
    /*    liveBroadcastService.getActiveBoard().setBoardScale(state.boardScale);
    liveBroadcastService.getActiveBoard().reset();*/
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations
};
