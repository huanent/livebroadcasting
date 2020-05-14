import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";

import { enterRoom } from "../core/data/data-service";
const state = {
  themeColor: "dark",
  teacherId: "",
  activeBoardIndex: 0,
  boardProfiles: [],
  boardTotalPage: 1,
  boardNumber: 1,
  boardScale: 100,
  cameraDeviceList: [],
  microphonesDeviceList: [],
  activeCamera: {},
  activeMicrophones: {},
  panelType: "board",
  workplaceVisibity: false,
  token: null
};

const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_THEME_COLOR(state, color) {
    state.themeColor = color;
  },
  SET_TEACHER_ID(state, id) {
    state.teacherId = id;
  },
  BOARD_PROFILES(state, boardProfiles) {
    state.boardProfiles = boardProfiles;
  },
  async ADD_BOARD_FILE(state, file) {
    await liveBroadcastService.boardService.addBoardFiles(
      file.resultUrl,
      file.title,
      file.pages,
      file.resolution
    );
  },
  DELETE_BOARD_FILE(state, fid) {
    liveBroadcastService.boardService.deleteBoardFile(fid);
  },
  BOARD_INDEX(state, index) {
    state.activeBoardIndex = index;
  },
  async BOARD_TOTAL_PAGE(state, boardTotalPage) {
    state.boardTotalPage = boardTotalPage;
  },
  UPDATE_BOARD_STATE(state, data) {
    state.boardTotalPage = data.boardTotalPage;
    state.boardNumber = data.boardNumber;
    state.boardScale = data.boardScale;
  },
  GET_BOARD_STATE_FROM_BOARD(state) {},
  BOARD_NUMBER(state, boardNumber) {
    state.boardNumber = boardNumber;
  },
  BOARD_NUMBER_INCREASE(state, boardNumber) {
    state.boardNumber++;
    liveBroadcastService.boardService.getActiveBoard().nextBoard();
  },
  BOARD_NUMBER_DECREASE(state, boardNumber) {
    state.boardNumber--;
    liveBroadcastService.boardService.getActiveBoard().prevBoard();
  },
  BOARD_SCALE(state, boardScale) {
    state.boardScale = boardScale;
    liveBroadcastService.boardService
      .getActiveBoard()
      .setBoardScale(state.boardScale);
  },
  BOARD_SCALE_INCREASE(state, stepScale) {
    state.boardScale = state.boardScale + stepScale;
    liveBroadcastService.boardService
      .getActiveBoard()
      .setBoardScale(state.boardScale);
    liveBroadcastService.boardService.getActiveBoard().resize();
  },
  BOARD_SCALE_DECREASE(state, stepScale) {
    state.boardScale = state.boardScale - stepScale;
    liveBroadcastService.boardService
      .getActiveBoard()
      .setBoardScale(state.boardScale);
    liveBroadcastService.boardService.getActiveBoard().resize();
  },
  CAMERA_DEVICE_LIST(state, list) {
    state.cameraDeviceList = list;
  },
  MICROPHONES_DEVICE_LIST(state, list) {
    state.microphonesDeviceList = list;
  },
  ACTIVE_CAMERA(state, device) {
    liveBroadcastService.trtcService.setCamerasDevice(device.deviceId);
    state.activeCamera = device;
  },
  ACTIVE_MICROPHONES(state, device) {
    liveBroadcastService.trtcService.setMicrophonesDevice(device.deviceId);
    state.activeMicrophones = device;
  },
  REMOTE_STREAM_PLAY(state, remote) {
    liveBroadcastService.trtcService.remoteStreamPlay(
      remote.id,
      remote.element
    );
  },
  async SEND_MESSAGE(state, msg) {
    await liveBroadcastService.timService.sendMessage(msg);
  },
  SET_PANEL_TYPE(state, panelType) {
    state.panelType = panelType;
  },
  SET_WORKPLACE_VISIBILITY(state, status) {
    state.workplaceVisibity = status;
  }
};

const actions = {
  async enterRoom({ commit, rootState }, roomId) {
    let res = await enterRoom(rootState.account.userInfo.username, roomId);
    commit("SET_TOKEN", res.data);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
