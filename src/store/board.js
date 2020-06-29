import { liveBroadcastService } from "@/core/live-broadcast";

const state = {
  toolType: 1,
  brushThin: 20,
  brushColor: "#ba3136", // 画笔颜色
  textColor: "#0a818c",
  textSize: 450,
  canRedo: 0,
  canUndo: 0,
  fileList: [],
  currentFile: {
    pageCount: 0,
    currentPageIndex: 1,
    scale: 100
  }
};

const mutations = {
  // 设置画笔颜色
  SET_BRUSH_COLOR(state, color) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.brushColor = color;
    liveBroadcastService.boardService.activeBoard.setBrushColor(color);
  },
  SET_BRUSH_THIN(state, num) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.brushThin = num;
    liveBroadcastService.boardService.activeBoard.setBrushThin(num);
  },
  SET_TOOL_PEN(state) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.toolType = 1;
    liveBroadcastService.boardService.activeBoard.setToolType(1);
  },
  SET_TOOL_TEXT(state) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.toolType = 11;
    liveBroadcastService.boardService.activeBoard.setToolType(11);
  },
  SET_TOOL_LASERPEN(state) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.toolType = 3;
    liveBroadcastService.boardService.activeBoard.setToolType(3);
  },
  SET_TOOL_ERASER(state) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.toolType = 2;
    liveBroadcastService.boardService.activeBoard.setToolType(2);
  },
  SET_TOOL_LINE(state) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.toolType = 4;
    liveBroadcastService.boardService.activeBoard.setToolType(4);
  },
  SET_TOOL_OVAL(state) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.toolType = 5;
    liveBroadcastService.boardService.activeBoard.setToolType(5);
  },
  SET_TOOL_RECT(state) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.toolType = 6;
    liveBroadcastService.boardService.activeBoard.setToolType(6);
  },
  // 拖动 zoom-drag
  SET_TOOL_DRAG(state) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.toolType = 12;
    liveBroadcastService.boardService.activeBoard.setToolType(12);
  },
  SET_TEXT_COLOR(state, color) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.textColor = color;
    liveBroadcastService.boardService.activeBoard.setTextColor(color);
  },
  SET_TEXT_SIZE(state, num) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.textSize = num;
    liveBroadcastService.boardService.activeBoard.setTextSize(num);
  },

  CLEAR_BOARD() {
    if (!liveBroadcastService.boardService.activeBoard) return;
    liveBroadcastService.boardService.activeBoard.clear();
  },
  CAN_REDO() {
    if (!liveBroadcastService.boardService.activeBoard) return;
    liveBroadcastService.boardService.activeBoard.redo();
  },
  CAN_UNDO() {
    if (!liveBroadcastService.boardService.activeBoard) return;
    liveBroadcastService.boardService.activeBoard.undo();
  },
  ADD_BOARD() {
    if (!liveBroadcastService.boardService.activeBoard) return;
    liveBroadcastService.boardService.activeBoard.addBoard();
  },
  REMOVE_BOARD() {
    if (!liveBroadcastService.boardService.activeBoard) return;
    liveBroadcastService.boardService.activeBoard.deleteBoard();
  },
  SYNC_STATE(state, data) {
    for (const key in data) {
      state[key] = data[key];
    }
  },
  SET_BOARD_SCALE(state, value) {
    if (!liveBroadcastService.boardService.activeBoard) return;
    state.currentFile.scale = value;
    liveBroadcastService.boardService.activeBoard.setBoardScale(value);
  },
  INIT_STATE(state) {
    state.toolType = 1;
    state.brushThin = 20;
    state.brushColor = "#ba3136";
    state.textColor = "#0a818c";
    state.textSize = 450;
    state.canRedo = 0;
    state.canUndo = 0;
    state.fileList = [];
    state.currentFile.pageCount = 0;
    state.currentFile.currentPageIndex = 1;
    state.currentFile.scale = 100;
  }
};

const actions = {
  boardResize() {
    if (!liveBroadcastService.boardService) return;
    liveBroadcastService.boardService.getActiveBoard().resize();
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
