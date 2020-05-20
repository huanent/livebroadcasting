import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";

import { enterRoom } from "../core/data/data-service";
import { ROLE } from "../models/role";

const state = {
  themeColor: "dark",
  activeBoardIndex: 0,
  boardProfiles: [],
  boardTotalPage: 1,
  boardNumber: 1,
  boardScale: 100,
  activeCamera: null,
  activeMicrophones: null,
  panelType: "board",
  workplaceVisibity: false,
  role: null,
  token: null,
  featuresList: [],
  chatMessages: []
};
const mutations = {
  SET_TOKEN(state, token) {
    state.token = token;
  },
  SET_ROLE(state, role) {
    state.role = role;
  },
  SET_THEME_COLOR(state, color) {
    state.themeColor = color;
  },
  ADD_CHAT_MESSAGE(state, msg) {
    state.chatMessages.push(msg);
  },
  QUIT_SERVICE() {
    liveBroadcastService && liveBroadcastService.destroy();
  },
  async ADD_BOARD_FILE(state, file) {
    await liveBroadcastService.boardService.addBoardFiles(
      file.resultUrl,
      file.title,
      file.pages,
      file.resolution
    );
  },
  ACTIVE_CAMERA(state, device) {
    state.activeCamera = device;
  },
  ACTIVE_MICROPHONES(state, device) {
    state.activeMicrophones = device;
  },
  SET_PANEL_TYPE(state, panelType) {
    state.panelType = panelType;
  },
  SET_WORKPLACE_VISIBILITY(state, status) {
    state.workplaceVisibity = status;
  },
  INIT_STATE(state) {
    state = {
      themeColor: "dark",
      activeBoardIndex: 0,
      boardProfiles: [],
      boardTotalPage: 1,
      boardNumber: 1,
      boardScale: 100,
      activeCamera: null,
      activeMicrophones: null,
      panelType: "board",
      workplaceVisibity: false,
      role: null,
      token: null,
      featuresList: [],
      chatMessages: []
    };
  }
};

const actions = {
  async enterRoom({ commit, rootState }, query) {
    const role =
      query.createUser == rootState.account.username
        ? ROLE.TEACHER
        : ROLE.STUDENT;

    commit("SET_ROLE", role);
    let res = await enterRoom(rootState.account.userInfo.username, query.id);
    commit("SET_TOKEN", res.data);
  },
  switchCamera({ commit }, device) {
    if (!device.deviceId) return;
    commit("ACTIVE_CAMERA", device);
    liveBroadcastService.trtcService.setCamerasDevice(device.deviceId);
  },
  switchMicrophones({ commit }, device) {
    if (!device.deviceId) return;
    commit("ACTIVE_MICROPHONES", device);
    liveBroadcastService.trtcService.setMicrophonesDevice(device.deviceId);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
