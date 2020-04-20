import { liveBroadcastService } from "@/main";

const state = {
  //board(涂鸦)
  // drawEnable: true, //是否可以涂鸦
  // synDrawEnable: true, //是否将你画的涂鸦同步给其他人
  // toolType: 1,
  // brushThin: 100,
  // backgroundImage: "背景图",
  // backgroundImageH5: "背景图H5",
  // backgroundColor: "#ff0000",
  // globalBackgroundColor: "#ff0000",
  brushColor: "#0000ff" // 画笔颜色
  // textColor: "#ff0000",
  // textStyle: "#ff0000",
  // textFamily: "sans-serif,serif,monospace",
  // textSize: 320,
  // scaleSize: 100,
  // fitMode: 1,
  // ration: "16:9",
  // canRedo: 0,
  // canUndo: 0
};

const getters = {
  // 获取画笔颜色
  getBrushColor: state => {
    return state.brushColor;
  }
};

const mutations = {
  // 设置画笔颜色
  SET_BRUSH_COLOR(state, color) {
    state.brushColor = this.color;
    this.liveBroadcastService.activeBoard.setBrushColor(color);
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
