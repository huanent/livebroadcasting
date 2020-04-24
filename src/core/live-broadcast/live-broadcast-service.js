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

import store from "@/store";
import { Emitter } from "../emit";
Emitter.on("split-change", () => {
  liveBroadcastService.activeBoard.resize();
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
  userId = "jinrui";
  tim;
  localStream;
  async getUserSig(key) {
    if (!key) {
      key = "default";
    }
    if (this.TokenList[key] && !this.TokenList[key].isExpired) {
      return this.TokenList[key];
    } else {
      let res = await enterRoom(this.userId, this.roomId);

      let token = Object.assign({ isExpired: false }, res.data);
      this.TokenList[key] = token;
      return token;
    }
  }

  getActiveBoard() {
    return this.activeBoard;
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
  resetBoard(activeBoard) {
    activeBoard.reset();
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
    this.tim.sendMessage(message).then(
      () => {
        return true;
      },
      () => {
        // 同步失败
      }
    );
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
        await self.initRoom();
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

    let elId = "board_el";
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
        self.tim.sendMessage(message).then(
          () => {
            return true;
          },
          () => {
            // 同步失败
          }
        );
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
    self.tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(e) {
      e.data.forEach(item => {
        let data = item.payload.data;
        if (data && item.payload.extension === "TXWhiteBoardExt") {
          self.getActiveBoard().addSyncData(data);
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
  async addBoardFiles(file) {
    if (/\.(bmp|jpg|jpeg|png|gif|webp|svg|psd|ai)/i.test(file.name)) {
      this.activeBoard.addImageElement({
        data: file,
        userData: "image"
      });
    } else {
      this.activeBoard.applyFileTranscode(
        {
          data: file,
          userData: "123456"
        },
        {
          minResolution: "960x540",
          isStaticPPT: false,
          thumbnailResolution: "200x200"
        }
      );
      this.activeBoard.on(TEduBoard.EVENT.TEB_TRANSCODEPROGRESS, res => {
        console.log(
          "=======  TEB_TRANSCODEPROGRESS 转码进度：",
          JSON.stringify(res)
        );
        if (res.code) {
          console.log("转码失败code:" + res.code + " message:" + res.message);
        } else {
          let status = res.status;
          if (status === "ERROR") {
            console.log("转码失败");
          } else if (status === "UPLOADING") {
            console.log("上传中，当前进度:" + parseInt(res.progress) + "%");
          } else if (status === "CREATED") {
            console.log("创建转码任务");
          } else if (status === "QUEUED") {
            console.log("正在排队等待转码");
          } else if (status === "PROCESSING") {
            console.log("转码中，当前进度:" + res.progress + "%");
          } else if (status === "FINISHED") {
            console.log("转码完成");
            this.activeBoard.addTranscodeFile({
              url: res.resultUrl,
              title: res.title,
              pages: res.pages,
              resolution: res.resolution
            });
            let self = this;
            setTimeout(function() {
              let fileListInfo = self.activeBoard.getFileInfoList();
              let id = self.activeBoard.getCurrentFile();
              let index = self.getIndexByFid(fileListInfo, id);
              store.commit("workplace/BOARD_PROFILES", fileListInfo);
              store.commit("workplace/BOARD_INDEX", index);
            }, 1000);
          }
        }
      });
      this.activeBoard.on(TEduBoard.EVENT.TEB_INIT, res => {
        console.log(res);
        let lastindex = store.state.workplace.boardProfiles.length - 1;
        store.commit("workplace/BOARD_INDEX", lastindex);
      });
    }
  }
  addBoard() {
    liveBroadcastService.activeBoard.addBoard();
    store.commit("workplace/BOARD_INDEX", 0);
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
  async joinroom() {
    let token = this.TokenList["default"];
    let client = this.clientList["default"];
    let userId = token.id;
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
          audio: true,
          video: true
        });
        localStream
          .initialize()
          .catch(error => {
            console.error("初始化本地流失败 " + error);
          })
          .then(() => {
            console.log("初始化本地流成功");
            localStream.setVideoProfile({
              width: 720, // 视频宽度
              height: 560, // 视频高度
              frameRate: 10, // 帧率
              bitrate: 400 // 比特率 kbpsy
            });
            this.localStream = localStream;
            client
              .publish(localStream)
              .catch(error => {
                console.error("本地流发布失败 " + error);
              })
              .then(() => {
                console.log(localStream);
                let el = document.getElementById("local_video");
                localStream.play(el);
              });
          });
      });
  }
}
