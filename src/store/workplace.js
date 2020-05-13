import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
import account, { ROLE } from "./account";
import {
  responseState,
  switchWorkplaceType,
  syncState
} from "../core/live-broadcast/tim-message/send";
const state = {
  roomId: "",
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
  cameraPanelVisibity: true,
  timerWidget: {
    visible: false,
    started: false,
    seconds: 15 * 60
  }
};

const mutations = {
  SET_ROOM_ID(state, id) {
    state.roomId = id;
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
  },
  SET_CAMERA_PANEL__VISIBILITY(state, status) {
    state.cameraPanelVisibity = status;
  },
  SET_TIMER_VISIBLE(state, visible) {
    state.timerWidget.visible = visible;
    state.timerWidget.started = false;
    state.timerWidget.seconds = 15 * 60;
  },
  START_TIMER(state, payload) {
    state.timerWidget.started = payload.started;
    state.timerWidget.seconds = payload.seconds;
  },
  MERGE_STATE(state, data) {
    for (let i in data) {
      state[i] = data[i];
    }
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
