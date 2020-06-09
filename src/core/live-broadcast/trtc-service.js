// import TRTC from "trtc-js-sdk";
import store from "@/store";
import { Emitter } from "../emit";
import { enterRoom } from "../data/data-service.js";
import { requestDeviceAccess } from "../utils";
import { ASSIST_TOKEN } from "../../models/constants";

export class TrtcService {
  localStream;
  remoteStreams = [];
  assistStream;

  mainClient;
  assistClient;

  mainToken;
  assistToken;

  async checkSupported() {
    let isSupport = await TRTC.checkSystemRequirements();
    let isSupportScreen = TRTC.isScreenShareSupported();

    if (!isSupport && !isSupportScreen) {
      return await store.dispatch("tips/browserNotSupport");
    }
  }

  listenHandler(client) {
    client.on("stream-added", async e => {
      let id = e.stream.getUserId();

      if (this.assistToken && this.assistToken.id == id) {
        client.unsubscribe(e.stream);
      } else {
        let exist = this.remoteStreams.find(f => f.getUserId() == id);
        if (!exist) this.remoteStreams.push(e.stream);
      }
    });

    client.on("stream-updated", e => {
      let id = e.stream.getUserId();
      this.remoteStreams.filter(f => f.getUserId() != id);
      this.remoteStreams.push(e.stream);
    });

    client.on("stream-removed", e => {
      let userId = e.stream.getUserId();

      this.remoteStreams = this.remoteStreams.filter(
        f => f.getUserId() != userId
      );

      store.commit("workplace/CLEAR_OFFLINE_USER", userId);
    });
  }

  getCameras = () => TRTC.getCameras();
  getMicrophones = () => TRTC.getMicrophones();

  isTeacher() {
    return store.getters["workplace/isTeacher"];
  }

  createClient(token) {
    return TRTC.createClient({
      mode: "live",
      sdkAppId: token.appId,
      userId: token.id,
      userSig: token.userSig
    });
  }

  async setCamera(deviceId, mute) {
    if (!this.localStream) return;
    await this.localStream.switchDevice("video", deviceId);
    if (!mute) this.localStream.muteVideo();
  }

  async setMicrophone(deviceId, mute) {
    if (!this.localStream) return;
    await this.localStream.switchDevice("audio", deviceId);
    if (!mute) this.localStream.muteAudio();
  }

  getRemoteStream(id) {
    return this.remoteStreams.find(f => f.getUserId() == id);
  }

  async createAssistToken() {
    if (!this.assistToken) {
      let result = await enterRoom(
        store.state.account.userInfo.username + ASSIST_TOKEN,
        this.mainToken.classId
      );

      this.assistToken = result.data.model;
    }
  }

  async createAssistClient() {
    if (!this.assistClient) {
      this.assistClient = this.createClient(this.assistToken);
      this.assistClient.setDefaultMuteRemoteStreams(true);
      await this.assistClient.join({
        roomId: this.assistToken.classId
      });
    }
  }

  async releaseAssistStream() {
    if (this.assistStream) {
      this.assistStream.close();

      if (this.assistClient) {
        try {
          await this.assistClient.unpublish(this.assistStream);
        } catch (error) {
          console.log(error);
        }
      }

      this.assistStream == null;
    }
  }

  async releaseAssistClient() {
    if (this.assistClient) await this.assistClient.leave();
    this.assistClient = null;
  }

  async startShareScreen() {
    await this.createAssistToken();
    await this.createAssistClient();
    await this.createScreenStream();
  }

  async stopShareScreen() {
    await this.releaseAssistStream();
    await this.releaseAssistClient();
  }

  async createScreenStream() {
    await this.releaseAssistStream();

    if (store.state.electron.onElectronClient) {
      let stream = await this.getElectronStream();
      const videoTrack = stream.getVideoTracks()[0];

      this.assistStream = TRTC.createStream({
        videoSource: videoTrack,
        mirror: false
      });
    } else {
      this.assistStream = TRTC.createStream({
        audio: false,
        screen: true
      });
    }

    this.assistStream.setScreenProfile("1080p");
    await this.assistStream.initialize();
    await this.assistClient.publish(this.assistStream);
  }

  async subscribe(stream, audio, video) {
    await this.mainClient.subscribe(stream, {
      audio: audio,
      video: video
    });
  }

  async init(token) {
    TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.ERROR);
    this.checkSupported();
    this.mainToken = token;
    this.mainClient = this.createClient(token);
    await this.mainClient.join({ roomId: token.classId.toString() });
    this.listenHandler(this.mainClient);
    let access = await requestDeviceAccess();

    this.localStream = TRTC.createStream({
      audio: !!access.audio,
      video: !!access.video
    });

    this.localStream.setVideoProfile(this.isTeacher() ? "720p" : "480p");

    try {
      await this.localStream.initialize();
      await this.mainClient.publish(this.localStream);

      let selectedDevices = {
        camera: this.localStream.getVideoTrack().label,
        microphone: this.localStream.getAudioTrack().label
      };

      store.commit("workplace/SELECT_DEVICES", selectedDevices);
    } catch (error) {
      store.dispatch("tips/notAccessDevice");
    }
  }

  async destroy() {
    try {
      if (this.mainClient) await this.mainClient.leave();
      if (this.shareScreenClient) await this.shareScreenClient.leave();
      if (this.localStream) this.localStream.close();
    } catch (error) {
      console.error("销毁trtc失败", error);
    }
  }

  getElectronStream() {
    return new Promise(resolve => {
      store.commit("electron/STREAM_SELECT_VISIBILITY", true);
      Emitter.once("selected-stream", stream => {
        resolve(stream);
      });
    });
  }
}
