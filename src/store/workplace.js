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
  activeMicrophones: {}
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
  activeMicrophones: state => state.activeMicrophones
};

const mutations = {
  // 设置画笔颜色
  BOARD_PROFILES(state, boardProfiles) {
    state.boardProfiles = boardProfiles;
  },
  async ADD_BOARD_FILE(state, file) {
    await liveBroadcastService.addBoardFiles(
      file.resultUrl,
      file.title,
      file.pages,
      file.resolution
    );
  },
  DELETE_BOARD_FILE(state, fid) {
    liveBroadcastService.deleteBoardFile(fid);
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
  REMOTE_STREAM_PLAY(state, remote) {
    liveBroadcastService.remoteStreamPlay(remote.id, remote.element);
  },
  async SEND_MESSAGE(state, msg) {
    await liveBroadcastService.sendMessage(msg);
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations
};
