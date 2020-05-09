import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import store from "@/store";
import { Emitter } from "../emit";
import { listenHandler } from "./tim-message/listen";
export class TimService {
  liveBroadcastService;
  tim;
  roomId;
  async sendSystemMsg(type, userIds, data) {
    let datas = JSON.stringify({
      type: type,
      userIds: userIds,
      data: data
    });
    let message = this.tim.createCustomMessage({
      to: this.roomId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        data: datas,
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
  async sendMessage(msg, type) {
    if (!type) {
      type = "TIM_TEXT";
    }
    let message = this.tim.createCustomMessage({
      to: this.roomId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        data: msg,
        description: "",
        extension: type
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
  async init(liveBroadcastService) {
    this.liveBroadcastService = liveBroadcastService;
    this.roomId = liveBroadcastService.roomId;
    let token = await liveBroadcastService.getUserSig("default");
    let tim = TIM.create({
      SDKAppID: store.state.account.sdkAppId
    });

    tim.setLogLevel(1); // 普通级别，日志量较多，接入时建议使用
    // 注册 COS SDK 插件
    tim.registerPlugin({ "cos-js-sdk": COS });
    let userId = token.id;
    let userSig = token.userSig;
    this.tim = tim;
    return new Promise(resolve => {
      tim
        .login({ userID: userId, userSig: userSig })
        .then(() => {
          resolve(tim);
        })
        .catch(imError => {
          console.warn("login error:", imError); // 登录失败的相关信息
        });
    });
  }
  async listenHandler() {
    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(e) {
      e.data.forEach(item => {
        const type = item.payload.extension;
        const data = item.payload.data;
        Emitter.emit(type, data, item, e, type);
      });
    });
    await listenHandler();
  }
}
