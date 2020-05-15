import TRTC from "trtc-js-sdk";
import store from "@/store";
import { Emitter } from "../emit";
import { ROLE } from "../../store/account";
import { enterRoom } from "../data/data-service.js";

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
  constructor() {}

  token;
  async init(roomId, liveBroadcastService) {
    this.liveBroadcastService = liveBroadcastService;
    this.token = store.state.workplace.token;
    let client = this.createClient(
      "default",
      this.token.id,
      this.token.userSig
    );
    await this.joinroom();
    const localStream = TRTC.createStream({
      userId: this.token.id,
      audio: store.state.localStream.localAudioStatus,
      video: store.state.localStream.localVideoStatus,
      mirror: false
    });
    this.localStream = localStream;
    await localStream.initialize();
    localStream.setVideoProfile("1080p");
    await client.publish(localStream);
    store.commit("localStream/IS_INIT");
  }
  async initCameraDeviceList() {
    TRTC.getCameras().then(devices => {
      store.commit("workplace/CAMERA_DEVICE_LIST", devices);
    });
  }
  async initMicrophonesDeviceList() {
    TRTC.getMicrophones().then(devices => {
      store.commit("workplace/MICROPHONES_DEVICE_LIST", devices);
    });
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

  localStreamPlay(data) {
    let stream;
    let role = store.state.account.role;
    if (!data.isCopy) {
      stream = this.localStream;
      if (stream && stream.play) {
        stream.play(data.el);
        this.coverPlayStyle(stream);
      }
    } else {
      if (role === ROLE.TEACHER) {
        stream = this.localStream;
        if (stream && stream.userId_) {
          this.copyStreamPlay(stream, data.el, stream.userId_);
        }
      } else {
        stream = this.getRemoteStreamByUserId(
          this.liveBroadcastService.teacherStreamUserId
        );
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
  async copyStreamPlay(stream, elmentOrId, id, options) {
    let mediaStream = stream.mediaStream_;

    let createStreamOptions = { mirror: false };
    if (!options) {
      options = { video: true, audio: false };
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
    this.streamCopy[id] = newStream;
    this.streamCopy[id].play(elmentOrId);
    this.coverPlayStyle(this.streamCopy[id]);
    return true;
  }
  copyStreamStopPlay(id) {
    let stream = this.streamCopy[id];
    if (stream) {
      stream.stop();
    }
  }
  teacherStreamPlay(elmentOrId) {
    let stream = this.getRemoteStreamByUserId(
      this.liveBroadcastService.teacherStreamUserId
    );
    if (stream && stream.play) {
      stream.play(elmentOrId);
      this.coverPlayStyle(stream);
    }
  }
  teacherStreamStopPlay() {
    let stream = this.getRemoteStreamByUserId(
      this.liveBroadcastService.teacherStreamUserId
    );
    if (stream && stream.stop) {
      stream.stop();
    }
  }
  getRemoteStreamByUserId(id) {
    if (!this.remoteStreamList[id] && this.remoteStreamList["kblive_" + id]) {
      id = "kblive_" + id;
    }
    if (this.remoteStreamList[id] && this.remoteStreamList[id].stream) {
      let stream = this.remoteStreamList[id].stream;
      if (stream && stream.play) {
        return stream;
      }
    }
  }
  remoteStreamPlay(id, elmentOrId) {
    let stream = this.getRemoteStreamByUserId(id);
    if (stream) {
      this.copyStreamPlay(stream, elmentOrId, "v_" + stream.userId_, {
        video: true,
        audio: true
      });
    }
  }

  async shareScreenStreamPlay(data, role) {
    data.el.innerHTML = "";
    if (role && role === ROLE.STUDENT) {
      let stream;
      stream = this.getShareStream();
      if (stream && stream.play) {
        stream.play(data.el);
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
  coverPlayStyle(stream) {
    stream.div_.style.backgroundColor = "";
    if (stream.div_.children[0]) {
      stream.div_.children[0].style.objectFit = "contain";
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
        stream.stop();
        this.clearShareStream();
        data.el.innerHTML = "";
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

    this.localShareScreenStream.setScreenProfile("1080p");
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
  subscribeRemoteStream(userId) {
    if (this.remoteStreamList[userId].status === "added") {
      this.remoteStreamList[userId].status = "subscribed";
      let client = this.clientList["default"];
      client.subscribe(this.remoteStreamList[userId].stream);
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
          userId: stream.userId_,
          id: stream.id_,
          hasAudio: stream.hasAudio(),
          hasVideo: stream.hasVideo()
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
    client
      .join({ roomId: this.token.classId.toString() })
      .catch(error => {
        console.error("进房失败 " + error);
      })
      .then(async () => {
        console.log("进房成功");
        await this.initCameraDeviceList();
        await this.initMicrophonesDeviceList();
        this.listenHandler(client);
      });
  }
  listenHandler(client) {
    let self = this;
    client.on("stream-added", event => {
      const remoteStream = event.stream;
      console.log("远端流增加: " + remoteStream.id_);
      //role是学生只订阅分享屏幕流和老师端语音视频流
      console.log(remoteStream);
      self.remoteStreamList[remoteStream.userId_] = {
        stream: remoteStream,
        status: "added"
      };
      this.subscribeRemoteStream(remoteStream.userId_);
      /*      if (store.state.account.role === ROLE.STUDENT) {
        let regex = /.*(share_screen)$/;
        let con = regex.test(remoteStream.userId_);
        if (con) {
          client.subscribe(remoteStream);
        }
        if (
          remoteStream.userId_ ===
          "kblive_" + this.liveBroadcastService.teacherStreamUserId
        ) {
          client.subscribe(remoteStream);
        }
      } else {
        client.subscribe(remoteStream);
      }*/
      /*client.subscribe(remoteStream);*/
    });

    client.on("stream-subscribed", event => {
      var self = this;
      this.remoteStreamListProfile = this.getStreamProfile();
      const remoteStream = event.stream;
      console.log("远端流订阅成功：" + remoteStream.id_);

      store.commit(
        "remoteStream/SET_REMOTE_STREAM_LIST",
        self.remoteStreamListProfile
      );
    });

    // 监听‘stream-updated’事件
    client.on("stream-updated", event => {
      const remoteStream = event.stream;
      console.log(
        "remoteStream ID: " +
          remoteStream.getId() +
          " was updated hasAudio: " +
          remoteStream.hasAudio() +
          " hasVideo: " +
          remoteStream.hasVideo()
      );
    });
    // 远端用户启用/关闭音频通知
    client.on("mute-audio", event => {
      const userId = event.userId;
      store.commit("remoteStream/MUTE_AUDIO", {
        userId: userId,
        status: false
      });
    });
    client.on("unmute-audio", event => {
      const userId = event.userId;
      store.commit("remoteStream/MUTE_AUDIO", {
        userId: userId,
        status: true
      });
    });
    // 远端用户启用/关闭视频通知
    client.on("mute-video", event => {
      const userId = event.userId;
      store.commit("remoteStream/MUTE_VIDEO", {
        userId: userId,
        status: false
      });
    });
    client.on("unmute-video", event => {
      const userId = event.userId;
      store.commit("remoteStream/MUTE_VIDEO", {
        userId: userId,
        status: true
      });
    });
    client.on("stream-removed", event => {
      const remoteStream = event.stream;
      if (self.remoteStreamList[remoteStream.userId_]) {
        delete self.remoteStreamList[remoteStream.userId_];
      }
      /*    self.remoteStreamListProfile = this.getStreamProfile();*/
      store.commit(
        "remoteStream/SET_REMOTE_STREAM_LIST",
        self.remoteStreamListProfile
      );
    });
    client.on("peer-join", event => {
      console.log("peer-join===================");
      const userId = event.userId;
      console.log(userId);
    });
    client.on("peer-leave", event => {
      console.log("peer-leave===================");
      const userId = event.userId;
      console.log(userId);
    });
  }
  async createShareClient() {
    let res = await enterRoom(
      store.state.account.userInfo.username + "_share_screen",
      this.token.classId
    );
    const shareClient = TRTC.createClient({
      mode: "live",
      sdkAppId: res.data.appId,
      userId: res.data.id,
      userSig: res.data.userSig
    });
    // 指明该 shareClient 默认不接收任何远端流 （它只负责发送屏幕分享流）
    shareClient.setDefaultMuteRemoteStreams(true);
    await shareClient.join({ roomId: res.data.classId });
    return shareClient;
  }
}
