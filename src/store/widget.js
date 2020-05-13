const state = {
  timer: {
    visible: false,
    started: false,
    seconds: 15 * 60
  }
};

const mutations = {
  SET_TIMER_VISIBLE(state, visible) {
    state.timer.visible = visible;
    state.timer.started = false;
    state.timer.seconds = 15 * 60;
  },
  START_TIMER(state, payload) {
    state.timer.started = payload.started;
    state.timer.seconds = payload.seconds;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
