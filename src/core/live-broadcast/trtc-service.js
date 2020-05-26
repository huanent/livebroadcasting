import TRTC from "trtc-js-sdk";
import store from "@/store";
import { Emitter } from "../emit";
import { ROLE } from "../../models/role";
import { enterRoom } from "../data/data-service.js";
import config from "../state-sync/config";
import { liveBroadcastService } from "./live-broadcast-service";
import { getStateValue } from "../state-sync";

export class TrtcService {
  localStream;
  remoteStreamList = {};
  remoteStreamListProfile = {};
  clientList = {};
  localShareScreenStream;
  shareScreenClient;
  liveBroadcastService;
  localStreamTypeCache;
  streamCopy = {};
  token;
  constructor() {}

  async init(roomId, liveBroadcastService) {
    TRTC.Logger.setLogLevel(TRTC.Logger.LogLevel.ERROR);
    this.liveBroadcastService = liveBroadcastService;
    this.token = store.state.workplace.token;
    let client = this.createClient(
      "default",
      this.token.id,
      this.token.userSig
    );
    await this.joinroom();
    let { cameraId, microphoneId } = await this.getDefaultDevice();
    const localStream = TRTC.createStream({
      userId: this.token.id,
      audio: store.state.features.videoStatus,
      video: store.state.features.audioStatus,
      microphoneId: microphoneId,
      cameraId: cameraId,
      mirror: false
    });
    this.localStream = localStream;

    await localStream.initialize();
    localStream.setVideoProfile({
      width: 1920,
      height: 1080,
      frameRate: 5,
      bitrate: 1600
    });
    await client.publish(localStream);
    store.commit("localStream/IS_INIT");
  }
  destroy() {
    for (let i in this.clientList) {
      let client = this.clientList[i];
      client && client.leave();
    }
  }
  async getDefaultDevice() {
    let mediaDevices = await navigator.mediaDevices.enumerateDevices();

    let cameraDeviceList = await TRTC.getCameras();

    let microphonesDeviceList = await TRTC.getMicrophones();

    if (cameraDeviceList[0] && microphonesDeviceList[0]) {
      let activeCameraDevice = JSON.parse(
        JSON.stringify({
          kind: cameraDeviceList[0].kind,
          deviceId: cameraDeviceList[0].deviceId,
          label: cameraDeviceList[0].label
        })
      );

      let activeMicrophonesDevice = JSON.parse(
        JSON.stringify({
          kind: microphonesDeviceList[0].kind,
          deviceId: microphonesDeviceList[0].deviceId,
          label: microphonesDeviceList[0].label
        })
      );
      let cameraId = activeCameraDevice.deviceId;
      let microphoneId = activeMicrophonesDevice.deviceId;
      store.commit("workplace/ACTIVE_CAMERA", activeCameraDevice);
      store.commit("workplace/ACTIVE_MICROPHONES", activeMicrophonesDevice);
      return { cameraId, microphoneId };
    }
  }
  getAudioLevel() {
    if (this.localStream) {
      return this.localStream.getAudioLevel();
    }
    return 0.0;
  }
  createClient(key, userId, userSig) {
    this.clientList[key] = TRTC.createClient({
      mode: "live",
      sdkAppId: this.token.appId,
      userId: this.token.id,
      userSig: this.token.userSig
    });
    return this.clientList[key];
  }
  async setCamerasDevice(deviceId) {
    let localStream = this.localStream;
    localStream.switchDevice("video", deviceId).then(() => {
      return true;
    });
  }
  async setMicrophonesDevice(deviceId) {
    let localStream = this.localStream;
    localStream.switchDevice("'audio'", deviceId).then(() => {
      return true;
    });
  }
  localStreamPlay(data) {
    data.el.innerHTML = "";
    let stream;
    let role = store.state.account.role;
    if (!data.isCopy) {
      stream = this.localStream;
      if (stream && stream.play) {
        stream.play(data.el);
        this.coverPlayStyle(stream, "contain");
      }
    } else {
      if (role === ROLE.TEACHER) {
        stream = this.localStream;
        if (stream && stream.userId_) {
          this.copyStreamPlay(stream, data.el, stream.userId_);
        }
      } else {
        stream = this.getRemoteStreamByUserId(store.state.workplace.teachId);
        if (stream && stream.userId_) {
          this.copyStreamPlay(stream, data.el, stream.userId_);
        }
      }
    }
  }
  localStreamStopPlay(data) {
    if (!data.isCopy) {
      this.localStream.stop();
      this.localStreamTypeCache = undefined;
    } else {
      this.copyStreamStopPlay(this.localStream.userId_);
    }
  }
  async copyStreamPlay(stream, elmentOrId, id, options, videoProfile) {
    elmentOrId.innerHTML = "";
    let mediaStream = stream.mediaStream_;

    let createStreamOptions = { mirror: false };
    if (!options) {
      options = { video: true, audio: true };
    }
    if (options.video) {
      const videoTrack = mediaStream.getVideoTracks()[0];
      Object.assign(createStreamOptions, { videoSource: videoTrack });
    }
    if (options.audio) {
      let audioTracks = mediaStream.getAudioTracks()[0];
      Object.assign(createStreamOptions, {
        audioSource: audioTracks
      });
    }
    let newStream = TRTC.createStream(createStreamOptions);
    await newStream.initialize();
    if (!videoProfile) {
      videoProfile = {
        width: 1920,
        height: 1080,
        frameRate: 5,
        bitrate: 1600
      };
    }
    newStream.setVideoProfile(videoProfile);
    this.streamCopy[id] = newStream;
    this.streamCopy[id].play(elmentOrId);
    this.coverPlayStyle(this.streamCopy[id]);
    return newStream;
  }
  copyStreamStopPlay(id) {
    let stream = this.streamCopy[id];
    if (stream) {
      let parent = stream.div_.parentElement;
      stream.stop();
      if (parent) {
        parent.innerHTML = "";
      }
    }
  }
  teacherStreamPlay(elmentOrId) {
    elmentOrId.innerHTML = "";

    let stream = this.getRemoteStreamByUserId(store.state.workplace.teachId);
    if (stream && stream.play) {
      stream.play(elmentOrId);
      this.coverPlayStyle(stream);
    }
  }
  teacherStreamStopPlay() {
    let stream = this.getRemoteStreamByUserId(store.state.workplace.teachId);
    if (stream && stream.stop) {
      stream.stop();
    }
  }
  getRemoteStreamByUserId(id) {
    if (!id) return;
    if (
      !this.remoteStreamList[id] &&
      this.remoteStreamList[addUserIdPrefix(id)]
    ) {
      id = addUserIdPrefix(id);
    }
    if (this.remoteStreamList[id] && this.remoteStreamList[id].stream) {
      let stream = this.remoteStreamList[id].stream;
      if (stream && stream.play) {
        return stream;
      }
    }
  }
  remoteStreamPlay(id, elmentOrId, options) {
    elmentOrId.innerHTML = "";
    if (!options) {
      options = { video: true, audio: true };
    }
    let stream = this.getRemoteStreamByUserId(id);
    stream.play(elmentOrId);
    this.coverPlayStyle(stream, "fill");
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
      options.audio = true;
    }
    if (stream) {
      let client = this.clientList["default"];
      await client.subscribe(stream, options);
    }
  }
  getStreamProfile() {
    let temp = [];
    for (let i in this.remoteStreamList) {
      let regex = /.*(share_screen)$/;
      let stream = this.remoteStreamList[i].stream;
      let con = regex.test(stream.userId_);

      if (con) {
        this.remoteShareScreenStream = stream;
      } else {
        temp.push({
          userId: removeUserIdPrefix(stream.userId_),
          rawUserId: stream.userId_,
          id: stream.id_
        });
      }
    }
    return temp;
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
  async joinroom() {
    let client = this.clientList["default"];

    await client.join({ roomId: this.token.classId.toString() });
    this.listenHandler(client);
  }
  listenHandler(client) {
    let self = this;
    client.on("stream-added", async event => {
      const remoteStream = event.stream;
      self.remoteStreamList[remoteStream.userId_] = {
        stream: remoteStream,
        status: "added"
      };
      await this.subscribeRemoteStream(remoteStream.userId_);
    });

    client.on("stream-subscribed", event => {
      const remoteStream = event.stream;
      this.remoteStreamListProfile = this.getStreamProfile();
      store.commit(
        "remoteStream/SET_REMOTE_STREAM_LIST",
        self.remoteStreamListProfile
      );
    });

    // 监听‘stream-updated’事件
    client.on("stream-updated", event => {});
    // 远端用户启用/关闭音频通知
    client.on("mute-audio", event => {});
    client.on("unmute-audio", event => {});
    // 远端用户启用/关闭视频通知
    client.on("mute-video", event => {});
    client.on("unmute-video", event => {});
    client.on("stream-removed", event => {
      const remoteStream = event.stream;
      if (self.remoteStreamList[remoteStream.userId_]) {
        delete self.remoteStreamList[remoteStream.userId_];
      }
      self.remoteStreamListProfile = this.getStreamProfile();
      store.commit(
        "remoteStream/SET_REMOTE_STREAM_LIST",
        self.remoteStreamListProfile
      );
    });
    client.on("peer-join", event => {});
    client.on("peer-leave", event => {});
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
const removeUserIdPrefix = function(userId) {
  if (userId.indexOf("kblive_") === 0) {
    return userId.substring(7);
  }
  return userId;
};
const addUserIdPrefix = function(userId) {
  if (userId.indexOf("kblive_") !== 0) {
    return "kblive_" + userId;
  }
  return userId;
};
