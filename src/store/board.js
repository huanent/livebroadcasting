import { liveBroadcastService } from "@/main";

const state = {
  //board(涂鸦)
  // drawEnable: true, //是否可以涂鸦
  // synDrawEnable: true, //是否将你画的涂鸦同步给其他人
  toolType: 1,
  brushThin: 100,
  // backgroundImage: "背景图",
  // backgroundImageH5: "背景图H5",
  // backgroundColor: "#ff0000",
  // globalBackgroundColor: "#ff0000",
  brushColor: "#BABA81", // 画笔颜色
  textColor: "#000000",
  // textStyle: "#ff0000",
  // textFamily: "sans-serif,serif,monospace",
  textSize: 320,
  // scaleSize: 100,
  // fitMode: 1,
  // ration: "16:9",
  canRedo: 0,
  canUndo: 0
};

const getters = {
  // 获取画笔颜色
  brushColor: state => {
    return state.brushColor;
  },
  brushThin: state => {
    return state.brushThin;
  },
  toolType: state => {
    return state.toolType;
  },
  textColor: state => {
    return state.textColor;
  },
  textSize: state => {
    return state.textSize;
  }
};

const mutations = {
  // 设置画笔颜色
  SET_BRUSH_COLOR(state, color) {
    state.brushColor = this.color;
    liveBroadcastService.activeBoard.setBrushColor(color);
  },
  SET_BRUSH_THIN(state, num) {
    state.brushThin = num;
    liveBroadcastService.activeBoard.setBrushThin(num);
  },
  SET_TOOL_PEN(state) {
    if (!liveBroadcastService || !liveBroadcastService.activeBoard) {
      return;
    }
    state.toolType = 1;
    liveBroadcastService.activeBoard.setToolType(1);
  },
  SET_TOOL_TEXT(state) {
    state.toolType = 11;
    liveBroadcastService.activeBoard.setToolType(11);
  },
  SET_TOOL_LASERPEN(state) {
    state.toolType = 3;
    liveBroadcastService.activeBoard.setToolType(3);
  },
  SET_TOOL_ERASER(state) {
    state.toolType = 2;
    liveBroadcastService.activeBoard.setToolType(2);
  },
  SET_TOOL_LINE(state) {
    state.toolType = 4;
    liveBroadcastService.activeBoard.setToolType(4);
  },
  SET_TOOL_OVAL(state) {
    state.toolType = 5;
    liveBroadcastService.activeBoard.setToolType(5);
  },
  SET_TOOL_RECT(state) {
    state.toolType = 6;
    liveBroadcastService.activeBoard.setToolType(6);
  },
  // 拖动 zoom-drag
  SET_TOOL_DRAG(state) {
    state.toolType = 12;
    liveBroadcastService.activeBoard.setToolType(12);
  },
  SET_TEXT_COLOR(state, color) {
    state.textColor = this.color;
    liveBroadcastService.activeBoard.setTextColor(color);
  },
  SET_TEXT_SIZE(state, num) {
    state.textSize = num;
    liveBroadcastService.activeBoard.setTextSize(num);
  },

  CLEAR_BOARD() {
    liveBroadcastService.activeBoard.clear();
  },
  CAN_REDO() {
    liveBroadcastService.activeBoard.redo();
  },
  CAN_UNDO() {
    liveBroadcastService.activeBoard.undo();
  },
  ADD_BOARD() {
    liveBroadcastService.addBoard();
  }
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};