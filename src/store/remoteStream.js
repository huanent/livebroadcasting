import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";

const state = {
  remoteStreamList: [],
  teacherStreamReady: false
};

const mutations = {
  TEACHER_STREAM_READY(state, status) {
    state.teacherStreamReady = status;
  },
  SET_REMOTE_STREAM_LIST(state, remoteStreamList) {
    state.remoteStreamList = remoteStreamList;
  },
  ADD_REMOTE_STREAM(state, remoteStreamList) {
    state.remoteStreamList.push(remoteStreamList);
  },
  REMOTE_STREAM_PLAY(state, remote) {
    liveBroadcastService.trtcService.remoteStreamPlay(
      remote.id,
      remote.element,
      remote.options && remote.options
    );
  },
  MUTE_AUDIO(state, data) {
    const list = state.remoteStreamList;
    list.forEach(element => {
      if (element.userId === data.userId) {
        element.hasAudio = data.status;
      }
    });
  },
  MUTE_VIDEO(state, data) {
    const list = state.remoteStreamList;
    list.forEach(element => {
      if (element.userId === data.userId) {
        element.hasVideo = data.status;
      }
    });
  },
  SET_REMOTE_AUDIO(state, data) {
    liveBroadcastService.timService
      .sendSystemMsg("SET_REMOTE_AUDIO", [data.userId], data.status)
      .then(() => {
        const list = state.remoteStreamList;
        list.forEach(element => {
          if (element.userId === data.userId) {
            element.hasAudio = data.status;
          }
        });
      });
  },
  INIT_STATE(state) {
    state.remoteStreamList = [];
  },
  SET_REMOTE_VIDEO(state, data) {
    liveBroadcastService.timService
      .sendSystemMsg("SET_REMOTE_VIDEO", [data.userId], data.status)
      .then(() => {
        const list = state.remoteStreamList;
        list.forEach(element => {
          if (element.userId === data.userId) {
            element.hasVideo = data.status;
          }
        });
      });
  }
};
export default {
  namespaced: true,
  state,
  mutations
};
