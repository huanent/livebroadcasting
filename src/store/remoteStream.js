import { liveBroadcastService } from "@/main";

const state = {
  remoteStreamList: []
};

const getters = {
  remoteStreamList: state => state.remoteStreamList
};

const mutations = {
  SET_REMOTE_STREAM_LIST(state, remoteStreamList) {
    state.remoteStreamList = remoteStreamList;
  },
  ADD_REMOTE_STREAM(state, remoteStreamList) {
    state.remoteStreamList.push(remoteStreamList);
  },
  REMOTE_STREAM_PLAY(state, remote) {
    liveBroadcastService.trtcService.remoteStreamPlay(
      remote.id,
      remote.element
    );
  },
  SET_REMOTE_AUDIO(state, data) {
    liveBroadcastService.timService.sendSystemMsg(
      "SET_REMOTE_AUDIO",
      data.userId,
      data.status
    );
  },
  SET_REMOTE_VIDEO(state, data) {
    liveBroadcastService.timService.sendSystemMsg(
      "SET_REMOTE_VIDEO",
      data.userId,
      data.status
    );
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations
};
