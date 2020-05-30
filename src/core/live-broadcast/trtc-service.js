import TRTC from "trtc-js-sdk";
import store from "@/store";
import { Emitter } from "../emit";
import { ROLE } from "../../models/role";
import { enterRoom } from "../data/data-service.js";

export class TrtcService {
  localStream;
  remoteStreams = [];
  shareScreenStream;
  mainClient;
  shareScreenClient;
  mainToken;

  async checkSupported() {
    let isSupport = await TRTC.checkSystemRequirements();
    let isSupportScreen = TRTC.isScreenShareSupported();

    if (!isSupport && !isSupportScreen) {
      return await store.dispatch("tips/browserNotSupport");
    }
  }

  listenHandler(client) {
    client.on("stream-added", async e => {
      let exist = this.remoteStreams.find(f => f.getId() == e.stream.getId());
      if (!exist) this.remoteStreams.push(e.stream);
      await client.unsubscribe(e.stream);
    });

    client.on("stream-removed", e => {
      this.remoteStreams = this.remoteStreams.filter(
        f => f.getId() != e.stream.getId()
      );
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
    return store.getter.workplace.isTeacher;
  }

  createClient(token) {
    return TRTC.createClient({
      mode: "live",
      sdkAppId: token.appId,
      userId: token.id,
      userSig: token.userSig
    });
  }

  async setCamera(deviceId) {
    if (!this.localStream) return;
    return await this.localStream.switchDevice("video", deviceId);
  }
  async setMicrophone(deviceId) {
    if (!this.localStream) return;
    return await this.localStream.switchDevice("audio", deviceId);
  }

  getRemoteStream(id) {
    return this.remoteStreams.find(f => f.getUserId() == id);
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
    this.localStream = TRTC.createStream({ audio: true, video: true });
    this.localStream.setVideoProfile(this.isTeacher ? "720p" : "480p");

    try {
      await this.localStream.initialize();
      await this.mainClient.publish(this.localStream);
    } catch (error) {
      store.dispatch("tips/notAccessDevice");
    }
  }

  async destroy() {
    if (this.mainClient) await this.mainClient.leave();
    if (this.shareScreenClient) await this.shareScreenClient.leave();
  }

  async shareScreenStreamPlay(data, role) {
    data.el.innerHTML = "";
    if (role && role === ROLE.STUDENT) {
      let stream;
      stream = this.getShareStream();
      if (stream && stream.play) {
        this.copyStreamPlay(
          stream,
          data.el,
          stream.userId_,
          { video: true, audio: false },
          {
            width: 1920,
            height: 1080,
            frameRate: 30,
            bitrate: 3200
          }
        );
        this.coverPlayStyle(stream);
      } else {
        setTimeout(() => {
          this.shareScreenStreamPlay(data, role);
        }, 300);
      }
    } else {
      let stream = this.localShareScreenStream;
      if (stream && stream.play) {
        stream.play(data.el);
        this.coverPlayStyle(stream);
      } else {
        await this.initShareScreen();
        this.shareScreenStreamPlay(data, role);
      }
    }
  }
  coverPlayStyle(stream, objectFit) {
    if (!objectFit) {
      objectFit = "contain";
    }
    stream.div_.style.backgroundColor = "";
    if (stream.div_.children[0]) {
      stream.div_.children[0].style.objectFit = objectFit;
      stream.div_.style.display = "flex";
      stream.div_.style.justifyContent = "center";
      stream.div_.style.alignItems = "center";
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
  async shareScreenStreamStopPlay(data, role) {
    if (role && role === ROLE.STUDENT) {
      let stream = this.getShareStream();
      if (stream && stream.stop) {
        this.copyStreamStopPlay(stream.userId_);
        this.clearShareStream();
      }
    } else {
      let stream = this.localShareScreenStream;
      if (stream) {
        stream.stop();
        this.shareScreenClient.unpublish(stream);
        stream.close();
        this.shareScreenClient.leave();
        this.localShareScreenStream = undefined;
        this.shareScreenClient = undefined;
        data.el.innerHTML = "";
      }
    }
  }
  async initShareScreen() {
    this.shareScreenClient = await this.createShareClient();
    if (!store.state.electron.onElectronClient) {
      this.localShareScreenStream = TRTC.createStream({
        audio: false,
        screen: true
      });
    } else {
      let stream = await this.getElectronStream();
      const audioTrack = stream.getAudioTracks()[0];
      const videoTrack = stream.getVideoTracks()[0];

      this.localShareScreenStream = TRTC.createStream({
        audioSource: audioTrack,
        videoSource: videoTrack,
        mirror: false
      });
    }

    this.localShareScreenStream.setScreenProfile("4k");
    await this.localShareScreenStream.initialize();
    await this.shareScreenClient.publish(this.localShareScreenStream);
    return this.localShareScreenStream;
  }
  hasRemoteAudio(id) {
    return this.remoteStreamList[id]
      ? this.remoteStreamList[id].hasAudio()
      : false;
  }
  hasRemoteVideo(id) {
    return this.remoteStreamList[id]
      ? this.remoteStreamList[id].hasVideo()
      : false;
  }
  async subscribeRemoteStream(rawUserId, options) {
    if (!options) {
      options = {
        video: store.state.features.subscribeVideo,
        audio: false
      };
    }
    let stream = this.getRemoteStreamByUserId(rawUserId);
    let regex = /.*(share_screen)$/;
    if (regex.test(stream.userId_)) {
      options.audio = false;
    }
    if (removeUserIdPrefix(stream.userId_) === store.state.workplace.teachId) {
      if (!store.state.remoteStream.teacherStreamReady) {
        store.commit("remoteStream/TEACHER_STREAM_READY", true);
      }
      options.audio = true;
      options.video = true;
    }
    if (stream) {
      let client = this.clientList["default"];
      await client.subscribe(stream, options);
    }
  }
  async unsubscribeRemoteStream(rawUserId) {
    if (removeUserIdPrefix(rawUserId) === store.state.workplace.teachId) {
      store.commit("remoteStream/TEACHER_STREAM_READY", false);
    }
  }
  getShareStream() {
    let keys = Object.keys(this.remoteStreamList);
    let findKey = keys.find(key => {
      if (/.*(share_screen)$/.test(key)) {
        return true;
      }
    });
    let stream = this.getRemoteStreamByUserId(findKey);
    if (stream) {
      return stream;
    }
  }
  clearShareStream() {
    let keys = Object.keys(this.remoteStreamList);
    keys.forEach(key => {
      if (/.*(share_screen)$/.test(key)) {
        delete this.remoteStreamList[key];
      }
    });
  }

  async createShareClient() {
    let res = await enterRoom(
      store.state.account.userInfo.username + "_share_screen",
      this.token.classId
    );
    const shareClient = TRTC.createClient({
      mode: "live",
      sdkAppId: res.data.model.appId,
      userId: res.data.model.id,
      userSig: res.data.model.userSig
    });
    // 指明该 shareClient 默认不接收任何远端流 （它只负责发送屏幕分享流）
    shareClient.setDefaultMuteRemoteStreams(true);
    await shareClient.join({ roomId: res.data.model.classId });
    return shareClient;
  }
}
