import TRTC from "trtc-js-sdk";
import {
  createRoom,
  enterRoom,
  getClassByRoomID,
  getSdkAppId
} from "../data/data-service";

import TIM from "tim-js-sdk";

import COS from "cos-js-sdk-v5";
window["COS"] = COS;

import { liveBroadcastService } from "../../main";

let TEduBoard = window["TEduBoard"];
// let resizeTimer = null;

import store from "@/store";
import { Emitter } from "../emit";
import router from "../../router";

Emitter.on("split-change", () => {
  // if (resizeTimer) {
  //   return;
  // }
  // resizeTimer = setTimeout(() => {
  liveBroadcastService.activeBoard.resize();
  //   resizeTimer = null;
  // }, 100);
});

const toUserId = "7";

export class LiveBroadcastService {
  config;
  sdkAppId = getSdkAppId();
  mode = "live";
  clientList = {};
  TokenList = {};
  roomId = "98894785075365";
  activeBoard = null;
  userId = "jinrui1";
  tim;
  localStream;
  remoteStreamList = {};
  remoteStreamListProfile = {};
  shareScreenRemoteStream;
  localShareScreenStream;
  shareScreenClient;
  async getUserSig(key) {
    if (!key) {
      key = "default";
    }
    if (this.TokenList[key] && !this.TokenList[key].isExpired) {
      return this.TokenList[key];
    } else {
      let id = this.userId;
      if (key !== "default") {
        id = this.userId + "_" + key;
      }
      let res = await enterRoom(id, this.roomId);
      let token = Object.assign({ isExpired: false }, res.data);
      this.TokenList[key] = token;
      return token;
    }
  }

  getActiveBoard() {
    return this.activeBoard;
  }
  async createShareClient() {
    const sdkAppId = this.sdkAppId;
    let token = await this.getUserSig("share_screen");
    let userId = token.id;
    let userSig = token.userSig;
    const shareClient = TRTC.createClient({
      mode: "live",
      sdkAppId,
      userId,
      userSig
    });
    // 指明该 shareClient 默认不接收任何远端流 （它只负责发送屏幕分享流）
    shareClient.setDefaultMuteRemoteStreams(true);
    await shareClient.join({ roomId: this.roomId });
    return shareClient;
  }
  switchFile(fid) {
    let activeBoard = this.getActiveBoard();
    let info = activeBoard.getFileInfo(fid);
    if (!info) return;
    activeBoard.switchFile(
      info.fid,
      info.currentPageIndex,
      info.currentPageStep
    );
    let scale = info.scale;
    store.commit("workplace/BOARD_TOTAL_PAGE", info.pageCount);
    store.commit("workplace/BOARD_NUMBER", info.currentPageIndex + 1);
    store.commit("workplace/BOARD_SCALE", scale);
  }
  setActiveBoard(activeBoard) {
    this.activeBoard = activeBoard;
  }
  remoteStreamPlay(id, elmentOrId) {
    let stream = this.remoteStreamList[id];
    if (stream) {
      stream.play(id, elmentOrId);
    }
  }
  localStreamPlay(elmentOrId) {
    if (this.localStream && this.localStream.play) {
      this.localStream.play(elmentOrId);
    }
  }
  async localShareScreenStreamPlay(elementOrId) {
    if (this.localShareScreenStream && this.localShareScreenStream.play) {
      this.localShareScreenStream.play(elementOrId);
    } else {
      this.shareScreenClient = await liveBroadcastService.createShareClient();
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
  localStreamStopPlay() {
    if (this.localStream && this.localStream.play) {
      this.localStream.stop();
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
  resetBoard(activeBoard) {
    activeBoard.reset();
  }
  async sendSystemMsg(type, userId, ...flag) {
    var data = JSON.stringify({
      type: type,
      userId: userId,
      flag: flag
    });
    let message = this.tim.createCustomMessage({
      to: this.roomId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        data: data,
        description: "",
        extension: "SYSTEM_COMMAND"
      }
    });
    this.tim
      .sendMessage(message)
      .then(res => {
        console.log(res.data.message.payload);
      })
      .catch(err => {
        console.warn("sendMessage error:", err);
      });
  }
  async sendMessage(msg) {
    let message = this.tim.createCustomMessage({
      to: this.roomId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        data: msg,
        description: "",
        extension: "TIM_TEXT"
      }
    });
    this.tim
      .sendMessage(message)
      .then(() => {
        return true;
      })
      .catch(err => {
        console.error(err);
      });
  }
  async initTim() {
    let options = {
      SDKAppID: this.sdkAppId
    };
    let tim = TIM.create(options); // SDK 实例通常用 tim 表示

    tim.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用
    // 注册 COS SDK 插件
    tim.registerPlugin({ "cos-js-sdk": COS });
    let token = this.TokenList["default"];
    let userId = token.id;
    let userSig = token.userSig;
    let self = this;
    tim
      .login({ userID: userId, userSig: userSig })
      .then(async res => {
        console.log("tim 登录成功");
        this.initBoard();
        this.initBoardOptions();
      })
      .catch(imError => {
        console.warn("login error:", imError); // 登录失败的相关信息
      });
    this.tim = tim;
    return tim;
  }
  initBoard() {
    const roomId = this.roomId;
    const sdkAppId = this.sdkAppId;
    let token = this.TokenList["default"];
    let userId = token.id;
    let userSig = token.userSig;

    let elId = "board-el";
    let initParams = {
      id: elId,
      classId: roomId,
      sdkAppId: sdkAppId,
      userId: userId,
      userSig: userSig
    };

    let teduBoard = new TEduBoard(initParams);
    let self = this;
    teduBoard.on(TEduBoard.EVENT.TEB_SYNCDATA, data => {
      let message = this.tim.createCustomMessage({
        to: this.roomId,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          data: JSON.stringify(data),
          description: "",
          extension: "TXWhiteBoardExt"
        }
      });
      if (self.tim) {
        self.tim
          .sendMessage(message)
          .then(res => {
            console.log(res.data.message.payload);
          })
          .catch(err => {
            console.warn(err);
          });
      }
    });
    this.activeBoard = teduBoard;
    teduBoard.on(TEduBoard.EVENT.TEB_INIT, () => {
      setTimeout(function() {
        let fileListInfo = teduBoard.getFileInfoList();
        store.commit("workplace/BOARD_PROFILES", fileListInfo);
        let lastindex = fileListInfo.length - 1;
        store.commit("workplace/BOARD_INDEX", lastindex);
      }, 3000);
    });
    teduBoard.on(TEduBoard.EVENT.TEB_INIT, res => {
      let lastindex = store.state.workplace.boardProfiles.length - 1;
      store.commit("workplace/BOARD_INDEX", lastindex);
    });
    self.tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(e) {
      e.data.forEach(item => {
        const type = item.payload.extension;
        const data = item.payload.data;
        // SYSTEM_COMMAND || TXWhiteBoardExt || TIM_TEXT
        if (type === "TXWhiteBoardExt") {
          self.getActiveBoard().addSyncData(data);
        } else if (type === "SYSTEM_COMMAND") {
          const info = JSON.parse(data);
          if ((info.userId = self.userId)) {
            Emitter.emit("CONTROL_LOCAL_STREAM", info);
          }
        } else {
          Emitter.emit("TIM_CUSTOM_MESSAGE", item);
        }
      });
    });
  }
  initBoardOptions() {
    // this.activeBoard.reset();
    // 初始化画笔颜色
    const brushColor = store.state.board.brushColor;
    // 初始化画笔粗细
    const brushThin = store.state.board.brushThin;
    // 初始化文本颜色
    const textColor = store.state.board.textColor;
    // 初始化文本大小
    const textSize = store.state.board.textSize;
    //初始化使用的工具
    const toolType = store.state.board.toolType;
    this.activeBoard.setBrushColor(brushColor);
    this.activeBoard.setBrushThin(brushThin);
    this.activeBoard.setTextSize(textSize);
    this.activeBoard.setTextColor(textColor);
    this.activeBoard.setToolType(toolType);
  }
  async init() {
    let res = await createRoom(this.userId);
    if (res && res.data.success) {
      /*   this.roomId = res.data.model.roomId;*/
      let token = await this.getUserSig("default");
      this.createClient("default", token.id, token.userSig);
      await this.joinroom();
      await this.initTim();
      this.initBoard();
    } else {
      console.error(res.data.messages);
    }
  }
  createClient(key, userId, userSig) {
    this.clientList[key] = TRTC.createClient({
      mode: "live",
      sdkAppId: this.sdkAppId,
      userId: userId,
      userSig: userSig
    });
    return this.clientList[key];
  }
  async addBoardFiles(resultUrl, title, pages, resolution) {
    this.getActiveBoard().addTranscodeFile({
      url: resultUrl,
      title: title,
      pages: pages,
      resolution: resolution
    });
    this.getBoardFiles();
  }
  getBoardFiles() {
    let self = this;
    setTimeout(function() {
      let fileListInfo = self.activeBoard.getFileInfoList();
      let id = self.activeBoard.getCurrentFile();
      let index = self.getIndexByFid(fileListInfo, id);
      store.commit("workplace/BOARD_PROFILES", fileListInfo);
      store.commit("workplace/BOARD_INDEX", index);
    }, 3000);
  }
  clearAllBoardFiles() {
    let list = this.activeBoard.getFileInfoList();
    // let id = this.activeBoard.getCurrentFile();
    list.forEach(file => {
      this.activeBoard.deleteFile(file.fid);
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
  muteLocalAudio() {
    let localStream = this.localStream;
    localStream.muteAudio();
  }
  unmuteLocalAudio() {
    let localStream = this.localStream;
    localStream.unmuteAudio();
  }
  muteLocalVideo() {
    let localStream = this.localStream;
    localStream.muteVideo();
  }
  unmuteLocalVideo() {
    let localStream = this.localStream;
    localStream.unmuteVideo();
  }
  getAudioLevel() {
    if (this.localStream) {
      return this.localStream.getAudioLevel();
    }
    return 0.0;
  }
  getIndexByFid(fileListInfo, fid) {
    let result;
    fileListInfo.find((item, index) => {
      if (item.fid === fid) {
        result = index;
      }
    });
    return result;
  }
  deleteCurrentFile() {
    let id = this.activeBoard.getCurrentFile();
    this.activeBoard.deleteFile(id);
  }
  deleteBoardFile(fid) {
    this.getActiveBoard().deleteFile(fid);
    this.getBoardFiles();
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
    let token = this.TokenList["default"];
    let client = this.clientList["default"];
    let userId = token.id;
    var self = this;
    client
      .join({ roomId: this.roomId })
      .catch(error => {
        console.error("进房失败 " + error);
      })
      .then(async () => {
        console.log("进房成功");
        await this.initCameraDeviceList();
        await this.initMicrophonesDeviceList();
        const localStream = TRTC.createStream({
          userId,
          audio: store.state.localStream.localAudioStatus,
          video: store.state.localStream.localVideoStatus
        });
        localStream
          .initialize()
          .catch(error => {
            console.error("初始化本地流失败 " + error);
          })
          .then(() => {
            console.log("初始化本地流成功");
            localStream.setVideoProfile("1080p");
            this.localStream = localStream;
            client
              .publish(localStream)
              .catch(error => {
                console.error("本地流发布失败 " + error);
              })
              .then(() => {
                store.commit("localStream/IS_INIT");
              });
          });
      });

    client.on("stream-added", event => {
      const remoteStream = event.stream;
      console.log("远端流增加: " + remoteStream.id_);
      //订阅远端流
      client.subscribe(remoteStream);
    });

    client.on("stream-subscribed", event => {
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
  }
}
