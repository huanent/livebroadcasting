import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
import { Emitter } from "../core/emit";

const state = {
  localAudioStatus: true,
  localVideoStatus: true,
  audioLevel: 0.0,
  isInit: false
};

const mutations = {
  SET_LOCALSTREAM_AUDIO(state, status) {
    if (!liveBroadcastService.trtcService.localStream) return;
    state.localAudioStatus = status;
    if (status) {
      liveBroadcastService.trtcService.localStream.unmuteAudio();
    } else {
      liveBroadcastService.trtcService.localStream.muteAudio();
    }
  },
  SET_LOCALSTREAM_VIDEO(state, status) {
    if (!liveBroadcastService.trtcService.localStream) return;
    state.localVideoStatus = status;
    if (status) {
      liveBroadcastService.trtcService.localStream.unmuteVideo();
    } else {
      liveBroadcastService.trtcService.localStream.muteVideo();
    }
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
  IS_INIT(state) {
    state.isInit = true;
  },
  EMIT_SELECTED_STREAM(state, stream) {
    Emitter.emit("selected-stream", stream);
  }
};

export default {
  namespaced: true,
  state,
  mutations
};
