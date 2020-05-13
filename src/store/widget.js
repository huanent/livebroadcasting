const state = {
  timer: {
    position: {
      x: 0,
      y: 0
    },
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
  },
  UPDATE_POSITION(state, payload) {
    if (payload.position) state[payload.name].position = payload.position;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
