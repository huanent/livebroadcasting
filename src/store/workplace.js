import { liveBroadcastService } from "@/main";
import account, { ROLE } from "./account";
import {
  responseState,
  switchWorkplaceType,
  syncState
} from "../core/live-broadcast/tim-message/send";
const state = {
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
  cameraPanelVisibity: true
};

const getters = {
  activeBoardIndex: state => state.activeBoardIndex,
  boardProfiles: state => state.boardProfiles,
  boardTotalPage: state => state.boardTotalPage,
  boardNumber: state => state.boardNumber,
  boardScale: state => state.boardScale,
  cameraDeviceList: state => state.cameraDeviceList,
  microphonesDeviceList: state => state.microphonesDeviceList,
  activeCamera: state => state.activeCamera,
  activeMicrophones: state => state.activeMicrophones,
  role: state => state.role,
  panelType: state => state.panelType,
  workplaceVisibity: state => state.workplaceVisibity,
  cameraPanelVisibity: state => state.cameraPanelVisibity
};

const mutations = {
  // 设置画笔颜色
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
    mutations.SEND_BOARD_STATE();
  },
  SEND_BOARD_STATE(state) {
    responseState("ROLE_NOT_TEACHER").then(() => {});
  },
  BOARD_NUMBER(state, boardNumber) {
    state.boardNumber = boardNumber;
    mutations.SEND_BOARD_STATE();
  },
  BOARD_NUMBER_INCREASE(state, boardNumber) {
    state.boardNumber++;
    liveBroadcastService.boardService.getActiveBoard().nextBoard();
    mutations.SEND_BOARD_STATE();
  },
  BOARD_NUMBER_DECREASE(state, boardNumber) {
    state.boardNumber--;
    liveBroadcastService.boardService.getActiveBoard().prevBoard();
    mutations.SEND_BOARD_STATE();
  },
  BOARD_SCALE(state, boardScale) {
    state.boardScale = boardScale;
    liveBroadcastService.boardService
      .getActiveBoard()
      .setBoardScale(state.boardScale);
    liveBroadcastService.boardService.getActiveBoard().reset();
    mutations.SEND_BOARD_STATE();
  },
  BOARD_SCALE_INCREASE(state, stepScale) {
    state.boardScale = state.boardScale + stepScale;
    liveBroadcastService.boardService
      .getActiveBoard()
      .setBoardScale(state.boardScale);
    liveBroadcastService.boardService.getActiveBoard().resize();
    mutations.SEND_BOARD_STATE();
  },
  BOARD_SCALE_DECREASE(state, stepScale) {
    state.boardScale = state.boardScale - stepScale;
    liveBroadcastService.boardService
      .getActiveBoard()
      .setBoardScale(state.boardScale);
    liveBroadcastService.boardService.getActiveBoard().resize();
    mutations.SEND_BOARD_STATE();
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
  async SEND_PANEL_TYPE(state) {
    if (account.state.role !== ROLE.STUDENT) {
      await switchWorkplaceType(state.panelType);
    }
  },
  async SYNC_STATE(state) {
    await syncState();
  },
  SET_WORKPLACE_VISIBILITY(state, status) {
    state.workplaceVisibity = status;
  },
  SET_CAMERA_PANEL__VISIBILITY(state, status) {
    state.cameraPanelVisibity = status;
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations
};
