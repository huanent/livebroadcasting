import TRTC from "trtc-js-sdk";
import store from "@/store";
export class TrtcService {
  localStream;
  remoteStreamList = {};
  remoteStreamListProfile = {};
  clientList = {};
  shareScreenRemoteStream;
  localShareScreenStream;
  shareScreenClient;
  roomId;
  liveBroadcastService;
  constructor() {}
  async init(roomId, liveBroadcastService) {
    this.liveBroadcastService = liveBroadcastService;
    this.roomId = roomId;
    let token = await liveBroadcastService.getUserSig("default");
    let userId = token.id;
    let client = this.createClient("default", token.id, token.userSig);
    await this.joinroom();
    const localStream = TRTC.createStream({
      userId,
      audio: store.state.localStream.localAudioStatus,
      video: store.state.localStream.localVideoStatus
    });
    this.localStream = localStream;
    localStream
      .initialize()
      .catch(error => {
        console.error("初始化本地流失败 " + error);
      })
      .then(() => {
        console.log("初始化本地流成功");
        localStream.setVideoProfile("1080p");
        client
          .publish(localStream)
          .catch(error => {
            console.error("本地流发布失败 " + error);
          })
          .then(() => {
            store.commit("localStream/IS_INIT");
          });
      });
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
  localStreamPlay(elmentOrId) {
    if (this.localStream && this.localStream.play) {
      this.localStream.play(elmentOrId);
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
      sdkAppId: store.state.account.sdkAppId,
      userId: userId,
      userSig: userSig
    });
    return this.clientList[key];
  }
  localStreamStopPlay() {
    if (this.localStream && this.localStream.play) {
      this.localStream.stop();
    }
  }
  remoteStreamPlay(id, elmentOrId) {
    let stream = this.remoteStreamList[id];
    if (stream) {
      stream.play(id, elmentOrId);
    }
  }

  async localShareScreenStreamPlay(elementOrId) {
    if (this.localShareScreenStream && this.localShareScreenStream.play) {
      this.localShareScreenStream.play(elementOrId);
    } else {
      this.shareScreenClient = await this.createShareClient();
      this.localShareScreenStream = TRTC.createStream({
        audio: false,
        screen: true
      });
      this.localShareScreenStream.setScreenProfile("1080p");
      await this.localShareScreenStream.initialize();
      this.shareScreenClient
        .publish(this.localShareScreenStream)
        .then(() => {});
      this.localShareScreenStreamPlay(elementOrId);
    }
  }
  async localShareScreenStreamStopPlay() {
    if (this.localShareScreenStream && this.localShareScreenStream.stop) {
      this.localShareScreenStream.stop();
    }
    if (this.shareScreenClient) {
      await this.shareScreenClient.leave();
      this.shareScreenClient = undefined;
    }
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
        this.shareScreenRemoteStream = self.remoteStreamList[item];
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
    client.on("stream-added", event => {
      const remoteStream = event.stream;
      console.log("远端流增加: " + remoteStream.id_);
      //订阅远端流
      client.subscribe(remoteStream);
    });

    client.on("stream-subscribed", event => {
      var self = this;
      const remoteStream = event.stream;
      console.log("远端流订阅成功：" + remoteStream.id_);
      self.remoteStreamList[remoteStream.id_] = remoteStream;
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
    client.on("stream-removed", event => {
      const remoteStream = event.stream;
      if (self.remoteStreamList[remoteStream.id_]) {
        delete self.remoteStreamList[remoteStream.id_];
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
    let token = await liveBroadcastService.getUserSig("share_screen");
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
