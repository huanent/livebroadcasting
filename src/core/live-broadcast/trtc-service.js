import TRTC from "trtc-js-sdk";
import store from "@/store";
import { Emitter } from "../emit";
import electron from "../../store/electron";
import { ROLE } from "../../store/account";

export class TrtcService {
  localStream;
  remoteStreamList = {};
  remoteStreamListProfile = {};
  clientList = {};
  localShareScreenStream;
  shareScreenClient;
  roomId;
  liveBroadcastService;
  localStreamTypeCache;
  selectedStreamCache;
  streamCopy = {};
  constructor() {}
  async init(roomId, liveBroadcastService) {
    this.liveBroadcastService = liveBroadcastService;
    this.roomId = roomId;
    let token = await this.liveBroadcastService.getUserSig("default");
    let userId = token.id;
    let client = this.createClient("default", token.id, token.userSig);
    await this.joinroom();
    const localStream = TRTC.createStream({
      userId,
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
      sdkAppId: store.state.account.sdkAppId,
      userId: userId,
      userSig: userSig
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
  async copyStreamPlay(stream, elmentOrId, id) {
    let mediaStream = stream.mediaStream_;
    const videoTrack = mediaStream.getVideoTracks()[0];
    let newStream = TRTC.createStream({
      videoSource: videoTrack,
      mirror: false
    });
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
    let keys = Object.keys(this.remoteStreamList);
    let findKey = keys.find(key => {
      let item = this.remoteStreamList[key];
      if (item.userId_ === "kblive_" + id) return true;
    });
    let stream = this.remoteStreamList[findKey];
    if (stream && stream.play) {
      return stream;
    }
  }
  remoteStreamPlay(id, elmentOrId) {
    let stream = this.remoteStreamList[id];
    if (stream) {
      stream.play(stream.id_, elmentOrId);
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
  getStreamProfile() {
    let temp = [];
    let keys = Object.keys(this.remoteStreamList);
    var self = this;
    keys.forEach(item => {
      let regex = /.*(share_screen)$/;
      let con = regex.test(self.remoteStreamList[item].userId_);

      if (con) {
        this.remoteShareScreenStream = self.remoteStreamList[item];
      } else {
        temp.push({
          userId: self.remoteStreamList[item].userId_,
          id: self.remoteStreamList[item].id_,
          hasAudio: self.remoteStreamList[item].hasAudio(),
          hasVideo: self.remoteStreamList[item].hasVideo()
        });
      }
    });
    return temp;
  }
  getShareStream() {
    let keys = Object.keys(this.remoteStreamList);
    let findKey = keys.find(key => {
      if (/.*(share_screen)$/.test(this.remoteStreamList[key].userId_)) {
        return true;
      }
    });
    return this.remoteStreamList[findKey];
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
      .join({ roomId: this.roomId })
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
      if (store.state.account.role === ROLE.STUDENT) {
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
      }
      /*client.subscribe(remoteStream);*/
    });

    client.on("stream-subscribed", event => {
      var self = this;
      const remoteStream = event.stream;
      console.log("远端流订阅成功：" + remoteStream.id_);
      self.remoteStreamList[remoteStream.userId_] = remoteStream;
      self.remoteStreamListProfile = this.getStreamProfile();
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
      self.remoteStreamListProfile = this.getStreamProfile();
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
    let token = await this.liveBroadcastService.getUserSig("share_screen");
    let userId = token.id;
    let userSig = token.userSig;
    const shareClient = TRTC.createClient({
      mode: "live",
      sdkAppId: store.state.account.sdkAppId,
      userId,
      userSig
    });
    // 指明该 shareClient 默认不接收任何远端流 （它只负责发送屏幕分享流）
    shareClient.setDefaultMuteRemoteStreams(true);
    await shareClient.join({ roomId: this.roomId });
    return shareClient;
  }
}
