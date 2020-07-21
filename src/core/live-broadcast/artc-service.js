import store from "@/store";
import { Emitter } from "../emit";
import { enterRoom } from "../data/data-service.js";
import { requestDeviceAccess } from "../utils";
import { ASSIST_TOKEN } from "../../models/constants";

export class ArtcService {
  localStream;
  remoteStreams = [];
  assistStream;

  mainClient;
  assistClient;

  mainToken;
  assistToken;

  async checkSupported() {
    let isSupport = AgoraRTC.checkSystemRequirements();

    if (!isSupport) {
      return await store.dispatch("tips/browserNotSupport");
    }
  }

  listenHandler(client) {
    client.on("stream-added", async e => {
      let id = e.stream.streamId;

      if (this.assistToken && this.assistToken.id == id) return;
      this.mainClient.subscribe(e.stream);
      let exist = this.remoteStreams.find(f => f.streamId == id);
      if (!exist) this.remoteStreams.push(e.stream);
    });

    client.on("stream-updated", e => {
      let id = e.stream.streamId;
      this.remoteStreams = this.remoteStreams.filter(f => f.streamId != id);
      this.remoteStreams.push(e.stream);
    });

    client.on("peer-leave", e => {
      let userId = e.stream.streamId;

      this.remoteStreams = this.remoteStreams.filter(f => f.streamId != userId);

      store.commit("workplace/CLEAR_OFFLINE_USER", userId);
    });
  }

  getCameras = async () => {
    let devices = await new Promise((rs, rj) => AgoraRTC.getDevices(rs, rj));
    return devices.filter(f => f.kind == "videoinput");
  };

  getMicrophones = async () => {
    let devices = await new Promise((rs, rj) => AgoraRTC.getDevices(rs, rj));
    return devices.filter(f => f.kind == "audioinput");
  };

  isTeacher() {
    return store.getters["workplace/isTeacher"];
  }

  createClient() {
    return AgoraRTC.createClient({
      mode: "live",
      codec: "h264"
    });
  }

  async setCamera(deviceId, mute) {
    if (!this.localStream) return;

    await new Promise((rs, rj) =>
      this.localStream.switchDevice("video", deviceId, rs, rj)
    );

    if (!mute) this.localStream.muteVideo();
  }

  async setMicrophone(deviceId, mute) {
    if (!this.localStream) return;

    await new Promise((rs, rj) =>
      this.localStream.switchDevice("audio", deviceId, rs, rj)
    );

    if (!mute) this.localStream.muteAudio();
  }

  getRemoteStream(id) {
    return this.remoteStreams.find(f => f.streamId == id);
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
      this.assistClient = this.createClient({
        mode: "rtc",
        codec: "h264"
      });

      await new Promise((rs, rj) =>
        this.assistClient.init(this.assistToken.agoraAppId, rs, rj)
      );

      await new Promise((rs, rj) =>
        this.assistClient.join(
          this.assistToken.agoraUserSig,
          this.assistToken.classId.toString(),
          this.assistToken.id,
          rs,
          rj
        )
      );
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
    if (this.assistClient)
      await new Promise((rs, rj) => this.assistClient.leave(rs, rj));
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

      this.assistStream = AgoraRTC.createStream({
        videoSource: videoTrack,
        video: true,
        audio: false,
        mirror: false
      });
    } else {
      this.assistStream = AgoraRTC.createStream({
        streamID: this.assistToken.id,
        audio: false,
        video: false,
        screen: true
      });
    }

    this.assistStream.setScreenProfile("720p_1");
    await new Promise((rs, rj) => this.assistStream.init(rs, rj));
    this.assistClient.publish(this.assistStream);
  }

  async subscribe(stream, audio, video) {
    await this.mainClient.subscribe(stream, {
      audio: audio,
      video: video
    });
  }

  async init(token) {
    AgoraRTC.Logger.setLogLevel(AgoraRTC.Logger.ERROR);
    this.checkSupported();
    this.mainToken = token;
    this.mainClient = this.createClient();

    await new Promise((rs, rj) =>
      this.mainClient.init(token.agoraAppId, rs, rj)
    );

    await new Promise((rs, rj) =>
      this.mainClient.join(
        token.agoraUserSig,
        token.classId.toString(),
        token.id,
        rs,
        rj
      )
    );

    this.listenHandler(this.mainClient);
    let access = await requestDeviceAccess();

    this.localStream = AgoraRTC.createStream({
      streamID: token.id,
      audio: !!access.audio,
      video: !!access.video
    });

    this.localStream.setVideoProfile("240p_1");

    try {
      await new Promise((rs, rj) => this.localStream.init(rs, rj));
      this.mainClient.publish(this.localStream);

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
      if (this.mainClient)
        await new Promise((rs, rj) => this.mainClient.leave(rs, rj));
      if (this.shareScreenClient)
        await new Promise((rs, rj) => this.shareScreenClient.leave(rs, rj));
      if (this.localStream) this.localStream.close();
    } catch (error) {
      console.error("销毁artc失败", error);
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
