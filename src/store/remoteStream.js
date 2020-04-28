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
    liveBroadcastService.remoteStreamPlay(remote.id, remote.element);
  },
  MUTE_REMOTE_AUDIO(state, id) {
    state.remoteStreamList[id].hasAudio = true;
    liveBroadcastService.muteRemoteAudio(id);
  },
  UNMUTE_REMOTE_AUDIO(state, id) {
    state.remoteStreamList[id].hasAudio = false;
    liveBroadcastService.unmuteRemoteAudio(id);
  },
  MUTE_REMOTE_VIDEO(state, id) {
    state.remoteStreamList[id].hasVideo = true;
    liveBroadcastService.muteRemoteVideo(id);
  },
  UNMUTE_REMOTE_VIDEO(state, id) {
    state.remoteStreamList[id].hasVideo = false;
    liveBroadcastService.unmuteRemoteVideo(id);
  }
};
export default {
  namespaced: true,
  state,
  getters,
  mutations
};
