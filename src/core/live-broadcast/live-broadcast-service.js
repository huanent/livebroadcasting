import TRTC from "trtc-js-sdk";
import { createRoom, enterRoom, getSdkAppId } from "../data/data-service";

import TIM from "tim-js-sdk";

import COS from "cos-js-sdk-v5";
window["COS"] = COS;

import axios from "axios";

window["axios"] = axios;
let TEduBoard = window["TEduBoard"];

import store from "@/store";

export class LiveBroadcastService {
  config;
  sdkAppId = getSdkAppId();
  mode = "live";
  clientList = {};
  TokenList = {};
  roomId = "1234567890";
  activeBoard = null;
  userId = "test";
  tim;
  async getUserSig(key) {
    if (!key) {
      key = "default";
    }
    if (this.TokenList[key] && !this.TokenList[key].isExpired) {
      return this.TokenList[key];
    } else {
      let res = await enterRoom(this.userId, this.roomId);
      if (res.data.success) {
        let token = Object.assign({ isExpired: false }, res.data.model);
        this.TokenList[key] = token;
        return token;
      }
    }
  }

  getActiveBoard() {
    return this.activeBoard;
  }
  setActiveBoard(activeBoard) {
    this.activeBoard = activeBoard;
  }
  resetBoard(activeBoard) {
    activeBoard.reset();
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
    tim
      .login({ userID: userId, userSig: userSig })
      .then(imResponse => {
        console.log(imResponse.data); // 登录成功
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
    const toUserId = "7";
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
        to: toUserId,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: JSON.stringify(data),
          description: "",
          extension: "TXWhiteBoardExt"
        }
      });
      if (self.tim && self.tim.sendMessage instanceof Promise) {
        self.tim.sendMessage(message).then(
          () => {
            return;
          },
          () => {
            // 同步失败
          }
        );
      }
    });
    this.activeBoard = teduBoard;
    setTimeout(function() {
      let fileListInfo = teduBoard.getFileInfoList();
      store.state.workplace.activeBoardIndex = 0;
      store.commit("workplace/BOARD_PROFILES", fileListInfo);
    }, 1000);
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
      this.roomId = res.data.model.roomId;
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
              store.commit("workplace/BOARD_PROFILES", fileListInfo);
              let id = self.activeBoard.getCurrentFile();
              fileListInfo.find((item, index) => {
                if (item.fid === id) {
                  store.commit("workplace/BOARD_INDEX", index);
                }
              });
            }, 1000);
          }
        }
      });
    }
  }
  clearAllBoardFiles() {
    let list = this.activeBoard.getFileInfoList();
    let id = this.activeBoard.getCurrentFile();
    list.forEach(file => {
      this.activeBoard.deleteFile(file.fid);
    });
  }
  deleteCurrentFile() {
    let id = this.activeBoard.getCurrentFile();
    this.activeBoard.deleteFile(id);
  }
  test(index) {
    store.commit("workplace/BOARD_INDEX", index);
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
      .then(() => {
        console.log("进房成功");
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
