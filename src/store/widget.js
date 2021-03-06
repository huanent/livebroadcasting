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
    start: false,
    visible: false,
    value: 1
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
    question: {
      title: "",
      items: []
    },
    statistics: [],
    visible: false,
    answer: {
      result: null
    }
  },
  rush: {
    visible: false,
    status: "waitting",
    name: ""
  },
  video: {
    position: {
      x: 0,
      y: 0
    },
    visible: false,
    src: ""
  },
  award: {
    name: "",
    visible: false
  },
  register: {
    visible: false,
    position: {
      x: 0,
      y: 0
    }
  }
};

const mutations = {
  SET_VISIBLE(state, { name, visible }) {
    state[name].visible = visible;
  },
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
    state.dice.value = 1;
  },
  SET_DICE_START(state, start) {
    state.dice.start = start;
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
  SET_CLICKER_VISIBLE(state, payload) {
    // state.clicker.question = {
    //   title: '',
    //   items: []
    // };
    // state.clicker.statistics = [];
    // state.clicker.answer= null;
    // state.clicker.visible = payload.visible;
    state.clicker = {
      question: {
        title: "",
        items: []
      },
      statistics: [],
      visible: payload.visible,
      answer: {
        result: null
      }
    };
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
  },
  SET_RUSH_STATUS(state, value) {
    state.rush.status = value;
  },
  SET_RUSH_NAME(state, value) {
    state.rush.name = value;
  },
  RUSH_ANSWER(state, value) {
    if (state.rush.status === 'rushable'){
      state.rush.status = 'rushed';
      state.rush.name = value;
    }
  },
  SET_VIDEO_VISIBLE(state, { visible, src }) {
    state.video.visible = visible;
    state.video.src = src;
  },
  SET_AWARD(state, data) {
    state.award = data;
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
