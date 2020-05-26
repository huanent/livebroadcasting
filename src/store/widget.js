const state = {
  timer: {
    position: {
      x: 0,
      y: 0
    },
    visible: false,
    started: false,
    seconds: 15 * 60
  },
  dice: {
    position: {
      x: 0,
      y: 0
    },
    visible: false,
    value: 0
  },
  draw: {
    position: {
      x: 0,
      y: 0
    },
    visible: false,
    list: [],
    started: false
  },
  answer: {
    position: {
      x: 0,
      y: 0
    },
    visible: false,
    list: [],
    started: false
  },
  clicker: {
    question: null,
    statistics: [],
    visible: false,
    answer: {
      result: null
    }
  },
  rush: {
    visible: false,
    started: false,
    name: ""
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
  },
  SET_DICE_VISIBLE(state, visible) {
    state.dice.visible = visible;
    state.dice.value = 0;
  },
  SET_DICE_VALUE(state, value) {
    state.dice.value = value;
  },
  SET_DRAW_VISIBLE(state, visible) {
    state.draw.visible = visible;
    state.draw.started = false;
  },
  SET_DRAW_LIST(state, list) {
    var rendomList = [];
    for (let i = 0; i < 20; i++) {
      let rendomItem = list[Math.floor(Math.random() * list.length)];
      rendomList.push(rendomItem);
    }
    state.draw.list = rendomList;
  },
  STAR_DRAW(state, value) {
    state.draw.started = value;
  },
  SET_CLICKER_VISIBLE(state, visible) {
    state.clicker.visible = visible;
    state.clicker.question = null;
    state.clicker.statistics = [];
  },
  START_CLICKER(state, question) {
    state.clicker.question = question;
  },
  SET_CLICKER_ANSWER(state, result) {
    state.clicker.answer = {
      result: result
    };
  },
  SET_RUSH_VISIBLE(state, visible) {
    state.rush.visible = visible;
    state.rush.queue = [];
  },
  SET_RUSH_START(state, value) {
    state.rush.started = value;
    state.rush.name = null;
  },
  SET_RUSH_NAME(state, value) {
    state.rush.name = value;
    state.rush.started = false;
  },
  RUSH_ANSWER(state, value) {
    if (state.rush.name || state.rush.started == false) return;
    state.rush.name = value;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
