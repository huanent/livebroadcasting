import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
import { Emitter } from "../core/emit";
import de from "element-ui/src/locale/lang/de";

const state = {
  audioLevel: 0.0,
  isInit: false,
  localStreamReady: false
};

const mutations = {
  LOCAL_STREAM_READY(state, status) {
    state.localStreamReady = status;
  },
  SET_AUDIOLEVEL(state) {
    if (!liveBroadcastService) return;
    let level = liveBroadcastService.trtcService.getAudioLevel();
    state.audioLevel = level;
  },
  LOCAL_STREAM_PLAY(state, data) {
    liveBroadcastService.trtcService.localStreamPlay(data);
  },
  LOCAL_STREAM_STOP_PLAY(state, data) {
    liveBroadcastService.trtcService.localStreamStopPlay(data);
  },
  TEACHER_REMOTE_STREAM_PLAY(state, elemntOrId) {
    liveBroadcastService.trtcService.teacherStreamPlay(elemntOrId);
  },
  TEACHER_REMOTE_STREAM_STOP_PLAY(state) {
    liveBroadcastService.trtcService.teacherStreamStopPlay();
  },
  EMIT_SELECTED_STREAM(state, stream) {
    Emitter.emit("selected-stream", stream);
  },
  INIT_STATE(state) {
    state.audioLevel = 0.0;
    state.isInit = false;
    state.localStreamReady = false;
  }
};

const actions = {
  switchAudio(state, status) {
    if (!liveBroadcastService.trtcService.localStream) return;
    if (status) {
      liveBroadcastService.trtcService.localStream.unmuteAudio();
    } else {
      liveBroadcastService.trtcService.localStream.muteAudio();
    }
  },
  switchVideo(state, status) {
    if (!liveBroadcastService.trtcService.localStream) return;
    if (status) {
      liveBroadcastService.trtcService.localStream.unmuteVideo();
    } else {
      liveBroadcastService.trtcService.localStream.muteVideo();
    }
  }
};
export default {
  namespaced: true,
  state,
  mutations,
  actions
};
