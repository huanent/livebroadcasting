// import TRTC from "trtc-js-sdk";
import store from "@/store";
import { Emitter } from "../emit";
import { enterRoom } from "../data/data-service.js";
import { requestDeviceAccess } from "../utils";

export class TrtcService {
  localStream;
  remoteStreams = [];
  shareScreenStream;
  mainClient;
  shareScreenClient;
  mainToken;
  shareScreenToken;

  async checkSupported() {
    let isSupport = await TRTC.checkSystemRequirements();
    let isSupportScreen = TRTC.isScreenShareSupported();

    if (!isSupport && !isSupportScreen) {
      return await store.dispatch("tips/browserNotSupport");
    }
  }

  listenHandler(client) {
    client.on("stream-added", async e => {
      let exist = this.remoteStreams.find(
        f => f.getUserId() == e.stream.getUserId()
      );
      if (!exist) this.remoteStreams.push(e.stream);
      await this.unsubscribe(e.stream);
    });

    client.on("stream-removed", e => {
      let userId = e.stream.getUserId();

      this.remoteStreams = this.remoteStreams.filter(
        f => f.getUserId() != userId
      );

      store.commit("workplace/CLEAR_OFFLINE_USER", userId);
    });
  }

  async getDefaultDevice() {
    let camera = null;
    let microphone = null;

    try {
      let cameraDeviceList = await TRTC.getCameras();
      let microphones = await TRTC.getMicrophones();
      camera = cameraDeviceList.find(device => device.deviceId);
      microphone = microphones.find(device => device.deviceId);
    } catch (e) {
      console.error(e);
    }

    return { camera, microphone };
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

  async startShareScreen() {
    if (!this.shareScreenToken) {
      let result = await enterRoom(
        store.state.account.userInfo.username + "_share_screen",
        this.mainToken.classId
      );

      this.shareScreenToken = result.data.model;
    }

    if (!this.shareScreenClient) {
      this.shareScreenClient = this.createClient(this.shareScreenToken);
      this.shareScreenClient.setDefaultMuteRemoteStreams(true);
      await this.shareScreenClient.join({
        roomId: this.shareScreenToken.classId
      });
    }

    if (!this.shareScreenStream) await this.createScreenStream();
    return this.shareScreenStream;
  }

  async stopShareScreen() {
    await this.shareScreenClient.unpublish(this.shareScreenStream);
    this.shareScreenStream.close();
    this.shareScreenStream = null;
  }

  async createScreenStream() {
    if (store.state.electron.onElectronClient) {
      let stream = await this.getElectronStream();
      const videoTrack = stream.getVideoTracks()[0];

      this.shareScreenStream = TRTC.createStream({
        videoSource: videoTrack,
        mirror: false
      });
    } else {
      this.shareScreenStream = TRTC.createStream({
        audio: false,
        screen: true
      });
    }

    this.shareScreenStream.setScreenProfile("720p");
    await this.shareScreenStream.initialize();
    await this.shareScreenClient.publish(this.shareScreenStream);
  }

  async subscribe(stream, audio, video) {
    await this.mainClient.subscribe(stream, {
      audio: audio,
      video: video
    });
  }

  async unsubscribe(stream) {
    await this.mainClient.unsubscribe(stream);
  }

  async copyStream(stream, mirror = false) {
    let copedStream = TRTC.createStream({
      audioSource: stream.getAudioTrack(),
      videoSource: stream.getVideoTrack(),
      mirror: mirror
    });

    await copedStream.initialize();
    return copedStream;
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

    this.localStream.setVideoProfile(this.isTeacher ? "720p" : "480p");

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
