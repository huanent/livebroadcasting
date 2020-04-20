import TRTC from "trtc-js-sdk";
import { createRoom, enterRoom, getSdkAppId } from "../data/data-service";

import TIM from "tim-js-sdk";

import COS from "cos-js-sdk-v5";
window["COS"] = COS;

import axios from "axios";
import { liveBroadcastService } from "../../main";

window["axios"] = axios;
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
  getUserSig(key) {
    if (!key) {
      key = "default";
    }
    return new Promise(resolve => {
      if (this.TokenList[key] && !this.TokenList[key].isExpired) {
        resolve(this.TokenList[key]);
      } else {
        enterRoom(this.userId, this.roomId).then(res => {
          if (res.data.success) {
            let token = Object.assign({ isExpired: false }, res.data.model);
            this.TokenList[key] = token;
            resolve(token);
          }
        });
      }
    });
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

  initBoard() {
    const roomId = this.roomId;
    const toUserId = "7";
    const sdkAppId = this.sdkAppId;
    let token = this.TokenList["default"];
    let userId = token.id;
    let userSig = token.userSig;

    let initParams = {
      id: "board_el",
      classId: roomId,
      sdkAppId: sdkAppId,
      userId: userId,
      userSig: userSig
    };
    let TEduBoard = window["TEduBoard"];
    var teduBoard = new TEduBoard(initParams);
    let options = {
      SDKAppID: sdkAppId
    };

    let tim = TIM.create(options); // SDK 实例通常用 tim 表示

    tim.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用
    // 注册 COS SDK 插件
    tim.registerPlugin({ "cos-js-sdk": COS });
    let promise = tim.login({ userID: userId, userSig: userSig });
    promise
      .then(imResponse => {
        console.log(imResponse.data); // 登录成功
        console.log("tim 登录成功");
      })
      .catch(imError => {
        console.warn("login error:", imError); // 登录失败的相关信息
      });
    this.activeBoard = teduBoard;
    setTimeout(() => {
      this.initBoardOptions();
    }, 1000);
    teduBoard.on(TEduBoard.EVENT.TEB_SYNCDATA, data => {
      console.log(data);
      let message = tim.createCustomMessage({
        to: toUserId,
        conversationType: TIM.TYPES.CONV_C2C,
        payload: {
          data: JSON.stringify(data),
          description: "",
          extension: "TXWhiteBoardExt"
        }
      });
      // tim.sendMessage(message).then(
      //   () => {
      //     // 同步成功
      //     this.activeBoard = teduBoard;
      //   },
      //   () => {
      //     // 同步失败
      //   }
      // );
    });
  }
  initBoardOptions() {
    // this.activeBoard.reset();
    // 初始化画笔颜色
    const brushColor = store.state.board.brushColor;
    this.activeBoard.setBrushColor(brushColor);
  }
  init() {
    return new Promise(resolve => {
      createRoom(this.userId).then(res => {
        if (res.data.success) {
          this.roomId = res.data.model.roomId;
          this.getUserSig("default").then(token => {
            this.createClient("default", token.id, token.userSig);
            this.joinroom().then(() => {
              this.initBoard();
            });
          });
        } else {
          console.error(res.data.messages);
        }
      });
    });
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
  joinroom() {
    let token = this.TokenList["default"];
    let client = this.clientList["default"];
    let userId = token.id;
    return new Promise(resolve => {
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
                  resolve({});
                  let el = document.getElementById("local_video");
                  localStream.play(el);
                });
            });
        });
    });
  }
}
