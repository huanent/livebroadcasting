import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";

import { enterRoom } from "../core/data/data-service";
import { ROLE } from "../models/role";
import classApi from "../core/data/class";

const state = {
  themeColor: "dark",
  activeCamera: null,
  activeMicrophones: null,
  panelType: "board",
  workplaceVisibity: false,
  role: null,
  token: null,
  teachId: null,
  featuresList: [],
  chatMessages: [],
  cameraPanelVisibity: false,
  roomInfo: null
};
const mutations = {
  SET_TEACHER_ID(state, id) {
    state.teachId = id;
  },
  SET_CAMERA_PANEL_VISIBILITY(state, status) {
    state.cameraPanelVisibity = status;
  },
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
    const data = {
      themeColor: "dark",
      activeCamera: null,
      activeMicrophones: null,
      panelType: "board",
      workplaceVisibity: false,
      role: null,
      token: null,
      featuresList: [],
      chatMessages: []
    };
    for (let i in data) {
      state[i] = data[i];
    }
  },

  CLEAR_OFFLINE_USER(state) {
    let timeNow = new Date().getTime();
    var offlineUser = state.featuresList.filter(
      f => timeNow - f.timestamp > 30000
    );

    for (const i of offlineUser) {
      state.featuresList.splice(state.featuresList.indexOf(i), 1);
    }
  },
  SET_ROOM_INFO(state, data) {
    state.roomInfo = data;
  }
};

const actions = {
  async enterRoom({ commit, rootState }, query) {
    const role =
      query.createUser == rootState.account.username
        ? ROLE.TEACHER
        : ROLE.STUDENT;
    commit("SET_TEACHER_ID", query.createUser);
    commit("SET_ROLE", role);
    let res = await enterRoom(rootState.account.userInfo.username, query.id);
    commit("SET_TOKEN", res.data.model);
    return res;
  },
  async destroyRoom() {
    if (liveBroadcastService) {
      return await liveBroadcastService.destroy();
    }
  },
  async switchCamera({ commit }, device) {
    if (!device.deviceId) return;
    commit("ACTIVE_CAMERA", device);
    return await liveBroadcastService.trtcService.setCamerasDevice(
      device.deviceId
    );
  },
  async switchMicrophones({ commit }, device) {
    if (!device.deviceId) return;
    commit("ACTIVE_MICROPHONES", device);
    return await liveBroadcastService.trtcService.setMicrophonesDevice(
      device.deviceId
    );
    liveBroadcastService.trtcService.setMicrophonesDevice(device.deviceId);
  },
  async getRoomInfo({ commit }, id) {
    let result = await classApi.classGet(id);
    commit("SET_ROOM_INFO", result.data.model);
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions
};
