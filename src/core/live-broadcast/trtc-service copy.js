import TRTC from "trtc-js-sdk";
import store from "@/store";
import { Emitter } from "../emit";
import { ROLE } from "../../models/role";
import { enterRoom } from "../data/data-service.js";
import { requestDeviceAccess } from "../utils";

export class TrtcService {
  localStream;
  remoteStreams = [];
  subscribedStreams = [];
  shareScreenStream;
  mainClient;
  shareScreenClient;
  mainToken;

  async init(token) {
    this.mainToken = token;
    let isSupport = await TRTC.checkSystemRequirements();
    let isSupportScreen = TRTC.isScreenShareSupported();

    if (!isSupport && !isSupportScreen) {
      return await store.dispatch("tips/browserNotSupport");
    }

    this.mainClient = this.createClient(token);
    await this.mainClient.join({ roomId: token.classId.toString() });
    this.listenHandler(this.mainClient);
    let options = {
      userId: this.token.id,
      mirror: false,
      video: false,
      audio: false
    };
    let { cameraId, microphoneId } = await this.getDefaultDevice();
    let access = await requestDeviceAccess();
    if (access.audio) {
      options.audio = store.state.features.audioStatus;
      options.microphoneId = microphoneId;
    } else {
      if (store.state.account.role === ROLE.TEACHER) {
        return await store.dispatch("tips/cameraError");
      }
    }

    if (access.video) {
      options.video = store.state.features.videoStatus;
      options.cameraId = cameraId;
    } else {
      if (store.state.account.role === ROLE.TEACHER) {
        return await store.dispatch("tips/microphonesError");
      }
    }

    this.localStream = TRTC.createStream(options);

    localStream.setVideoProfile({
      width: 1920,
      height: 1080,
      frameRate: 5,
      bitrate: 1600
    });

    await localStream.initialize();
    await this.mainClient.publish(localStream);
    if (this.localStream) {
      store.commit("localStream/LOCAL_STREAM_READY", true);
    }
  }
  async destroy() {
    if (this.mainClient) await this.mainClient.leave();
    if (this.shareScreenClient) await this.shareScreenClient.leave();
  }
  async getDefaultDevice() {
    let re = {};
    try {
      let cameraDeviceList = await TRTC.getCameras();

      let activeCamera = cameraDeviceList.find(device => device.deviceId);
      if (activeCamera) {
        let cameraId = activeCamera.deviceId;
        store.commit("workplace/ACTIVE_CAMERA", activeCamera);
        re["cameraId"] = cameraId;
      }
    } catch (e) {
      console.log(e);
    }

    try {
      let microphones = await TRTC.getMicrophones();
      let activeMicrophone = microphones.find(device => device.deviceId);
      if (activeMicrophone) {
        let microphoneId = activeMicrophone.deviceId;
        store.commit("workplace/ACTIVE_MICROPHONES", activeMicrophone);
        re["microphoneId"] = microphoneId;
      }
    } catch (e) {
      console.log(e);
    }

    return re;
  }
  getAudioLevel() {
    if (this.localStream) {
      return this.localStream.getAudioLevel();
    }
    return 0.0;
  }
  createClient(token) {
    return TRTC.createClient({
      mode: "live",
      sdkAppId: token.appId,
      userId: token.id,
      userSig: token.userSig
    });
  }
  async setCamerasDevice(deviceId) {
    return await this.localStream.switchDevice("video", deviceId);
  }
  async setMicrophonesDevice(deviceId) {
    return await this.localStream.switchDevice("'audio'", deviceId);
  }
  play(videoEl, mediaStream) {
    videoEl.srcObject = null;
    videoEl.srcObject = mediaStream;
  }
  localStreamPlay(data) {
    let stream;
    let role = store.state.account.role;
    if (!data.isCopy) {
      this.play(data.el, this.localStream.mediaStream_);
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
    this.play(elmentOrId, stream.mediaStream_);
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
    /*    elmentOrId.innerHTML = "";*/
    if (!options) {
      options = { video: true, audio: true };
    }
    let stream = this.getRemoteStreamByUserId(id);
    stream.play(elmentOrId);
    this.coverPlayStyle(stream, "contain");
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
  getStreamProfile() {
    let temp = [];
    for (let i in this.remoteStreamList) {
      let regex = /.*(share_screen)$/;
      let stream = this.remoteStreamList[i].stream;
      let isShareScreen = regex.test(stream.userId_);
      let isTeacher =
        removeUserIdPrefix(stream.userId_) === store.state.workplace.teachId;
      if (isShareScreen) {
        this.remoteShareScreenStream = stream;
      } else if (isTeacher) {
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
  listenHandler(client) {
    client.on("stream-added", async e => {
      let exist = this.remoteStreams.find(f.getId() == e.stream.getId());
      if (!exist) this.remoteStreams.push(e.stream);
      client.unsubscribe(e.stream);
    });

    client.on("stream-subscribed", event => {
      let exist = this.subscribedStreams.find(f.getId() == e.stream.getId());
      if (!exist) this.subscribedStreams.push(event.stream);
    });

    client.on("stream-removed", e => {
      client.unsubscribe(e.stream);
      this.remoteStreams = this.remoteStreams.filter(
        f.getId() != e.stream.getId()
      );
      this.subscribedStreams = this.subscribedStreams.filter(
        f.getId() != e.stream.getId()
      );
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
