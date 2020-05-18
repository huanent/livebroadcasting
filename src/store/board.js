import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";

const state = {
  toolType: 1,
  brushThin: 20,
  brushColor: "#ba3136", // 画笔颜色
  textColor: "#222222",
  textSize: 320,
  canRedo: 0,
  canUndo: 0,
  drawEnable: false,
  fileList: [],
  currentFile: {
    pageCount: 0,
    currentPageIndex: 1,
    scale: 100
  }
};

const mutations = {
  SET_DRAW_ENABLE(state, status) {
    state.drawEnable = Boolean(status);
  },
  // 设置画笔颜色
  SET_BRUSH_COLOR(state, color) {
    state.brushColor = this.color;
    liveBroadcastService.boardService.activeBoard.setBrushColor(color);
  },
  SET_BRUSH_THIN(state, num) {
    state.brushThin = num;
    liveBroadcastService.boardService.activeBoard.setBrushThin(num);
  },
  SET_TOOL_PEN(state) {
    if (
      !liveBroadcastService ||
      !liveBroadcastService.boardService.activeBoard
    ) {
      return;
    }
    state.toolType = 1;
    liveBroadcastService.boardService.activeBoard.setToolType(1);
  },
  SET_TOOL_TEXT(state) {
    state.toolType = 11;
    liveBroadcastService.boardService.activeBoard.setToolType(11);
  },
  SET_TOOL_LASERPEN(state) {
    state.toolType = 3;
    liveBroadcastService.boardService.activeBoard.setToolType(3);
  },
  SET_TOOL_ERASER(state) {
    state.toolType = 2;
    liveBroadcastService.boardService.activeBoard.setToolType(2);
  },
  SET_TOOL_LINE(state) {
    state.toolType = 4;
    liveBroadcastService.boardService.activeBoard.setToolType(4);
  },
  SET_TOOL_OVAL(state) {
    state.toolType = 5;
    liveBroadcastService.boardService.activeBoard.setToolType(5);
  },
  SET_TOOL_RECT(state) {
    state.toolType = 6;
    liveBroadcastService.boardService.activeBoard.setToolType(6);
  },
  // 拖动 zoom-drag
  SET_TOOL_DRAG(state) {
    state.toolType = 12;
    liveBroadcastService.boardService.activeBoard.setToolType(12);
  },
  SET_TEXT_COLOR(state, color) {
    state.textColor = this.color;
    liveBroadcastService.boardService.activeBoard.setTextColor(color);
  },
  SET_TEXT_SIZE(state, num) {
    state.textSize = num;
    liveBroadcastService.boardService.activeBoard.setTextSize(num);
  },

  CLEAR_BOARD() {
    liveBroadcastService.boardService.activeBoard.clear();
  },
  CAN_REDO() {
    liveBroadcastService.boardService.activeBoard.redo();
  },
  CAN_UNDO() {
    liveBroadcastService.boardService.activeBoard.undo();
  },
  ADD_BOARD() {
    liveBroadcastService.boardService.addBoard();
  },
  SYNC_STATE(state, data) {
    for (const key in data) {
      state[key] = data[key];
    }
  },

  SCALE_BOARD(state, value) {
    liveBroadcastService.boardService.activeBoard.setBoardScale(value);
    state.currentFile.scale = value;
  },
  PAGING(state, index) {
    if (index > state.currentFile.currentPageIndex) {
      liveBroadcastService.boardService.activeBoard.nextBoard(true);
    } else if (index < state.currentFile.currentPageIndex) {
      liveBroadcastService.boardService.activeBoard.prevBoard(true);
    }
    state.currentFile.currentPageIndex = index;
  },
  DELETE_BOARD(state, file) {
    state.fileList = state.fileList.filter(f => f != file);
    state.currentFile = state.fileList[state.fileList.length - 1];
    liveBroadcastService.boardService.activeBoard.deleteFile(file.fid);
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
