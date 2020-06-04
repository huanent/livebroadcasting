import { liveBroadcastService } from "@/core/live-broadcast";

import { enterRoom } from "../core/data/data-service";
import { ROLE } from "../models/role";
import classApi from "../core/data/class";

const state = {
  themeColor: "dark",
  panelType: "board",
  cameraPanelId: null,
  workplaceVisibity: false,
  role: null,
  token: null,
  featuresList: [],
  chatMessages: [],
  cameraPanelVisibity: true,
  roomInfo: null,
  selectedCamera: null,
  selectedMicrophone: null
};
const mutations = {
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
  SET_PANEL_TYPE(state, { type, streamId }) {
    state.panelType = type;
    state.cameraPanelId = streamId;
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

  CLEAR_OFFLINE_USER(state, userId) {
    let timeNow = new Date().getTime();
    var offlineUser = state.featuresList.filter(f => {
      return timeNow - f.timestamp > 30000 || f.__streamId == userId;
    });

    for (const i of offlineUser) {
      state.featuresList.splice(state.featuresList.indexOf(i), 1);
    }
  },
  SET_ROOM_INFO(state, data) {
    state.roomInfo = data;
  },
  SELECT_DEVICES(state, { camera, microphone }) {
    state.selectedCamera = camera;
    state.selectedMicrophone = microphone;
  }
};

const actions = {
  async enterRoom({ commit, rootState }) {
    let res = await enterRoom(
      rootState.account.userInfo.username,
      state.roomInfo.classId
    );
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
  },
  async getRoomInfo({ commit, rootState }, id) {
    let result = await classApi.classGet(id);
    commit("SET_ROOM_INFO", result.data.model);
    let role =
      rootState.account.userInfo.username == result.data.model.createUser
        ? ROLE.TEACHER
        : ROLE.STUDENT;
    commit("SET_ROLE", role);
    commit("features/INIT_STATE", role, { root: true });
  }
};

const getters = {
  isTeacher(state) {
    return state.role == ROLE.TEACHER;
  },
  teacherStreamId(state, getters, rootState) {
    let sublength =
      state.token.id.length - rootState.account.userInfo.username.length;
    let prefix = state.token.id.substring(0, sublength);
    return prefix + state.roomInfo.createUser;
  },
  teacherScreenStreamId(state, getters) {
    return getters.teacherStreamId + "_share_screen";
  }
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters
};
