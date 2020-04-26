import { liveBroadcastService } from "@/main";

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
  remoteStreamList: []
};

const getters = {
  activeBoardIndex: state => {
    return state.activeBoardIndex;
  },
  boardProfiles: state => {
    return state.boardProfiles;
  },
  boardTotalPage: state => {
    return state.boardTotalPage;
  },
  boardNumber: state => {
    return state.boardNumber;
  },
  boardScale: state => {
    return state.boardScale;
  },
  cameraDeviceList: state => {
    return state.cameraDeviceList;
  },
  microphonesDeviceList: state => {
    return state.microphonesDeviceList;
  },
  activeCamera: state => {
    return state.activeCamera;
  },
  activeMicrophones: state => {
    return state.activeMicrophones;
  },
  remoteStreamList: state => {
    return state.remoteStreamList;
  }
};

const mutations = {
  // 设置画笔颜色
  BOARD_PROFILES(state, boardProfiles) {
    state.boardProfiles = boardProfiles;
  },
  BOARD_INDEX(state, index) {
    state.activeBoardIndex = index;
  },
  BOARD_TOTAL_PAGE(state, boardTotalPage) {
    state.boardTotalPage = boardTotalPage;
  },
  BOARD_NUMBER(state, boardNumber) {
    state.boardNumber = boardNumber;
  },
  BOARD_NUMBER_INCREASE(state, boardNumber) {
    state.boardNumber++;
    liveBroadcastService.getActiveBoard().nextBoard();
  },
  BOARD_NUMBER_DECREASE(state, boardNumber) {
    state.boardNumber--;
    liveBroadcastService.getActiveBoard().prevBoard();
  },
  BOARD_SCALE(state, boardScale) {
    state.boardScale = boardScale;
    /*    liveBroadcastService.getActiveBoard().setBoardScale(state.boardScale);
    liveBroadcastService.getActiveBoard().reset();*/
  },
  BOARD_SCALE_INCREASE(state, stepScale) {
    state.boardScale = state.boardScale + stepScale;
    liveBroadcastService.getActiveBoard().setBoardScale(state.boardScale);
    liveBroadcastService.getActiveBoard().resize();
  },
  BOARD_SCALE_DECREASE(state, stepScale) {
    state.boardScale = state.boardScale - stepScale;
    liveBroadcastService.getActiveBoard().setBoardScale(state.boardScale);
    liveBroadcastService.getActiveBoard().resize();
  },
  CAMERA_DEVICE_LIST(state, list) {
    state.cameraDeviceList = list;
  },
  MICROPHONES_DEVICE_LIST(state, list) {
    state.microphonesDeviceList = list;
  },
  ACTIVE_CAMERA(state, device) {
    liveBroadcastService.setCamerasDevice(device.deviceId);
    state.activeCamera = device;
  },
  ACTIVE_MICROPHONES(state, device) {
    liveBroadcastService.setMicrophonesDevice(device.deviceId);
    state.activeMicrophones = device;
  },
  SET_REMOTE_STREAM_LIST(state, remoteStreamList) {
    state.remoteStreamList = remoteStreamList;
  },
  ADD_REMOTE_STREAM(state, remoteStreamList) {
    state.remoteStreamList.push(remoteStreamList);
  },
  REMOTE_STREAM_PLAY(state, id, elemetId) {
    liveBroadcastService.remoteStreamPlay(id, elemetId);
  },
  async SEND_MESSAGE(msg) {
    await liveBroadcastService.sendMessage(msg);
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations
};
