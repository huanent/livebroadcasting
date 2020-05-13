import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import store from "@/store";
import { Emitter } from "../emit";
import { listenHandler } from "./tim-message/listen";
import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
export class TimService {
  liveBroadcastService;
  tim;
  roomId;

  sendSystemMsg(type, listeners, data, from) {
    //if (!from) from = liveBroadcastService.userId;

    return this.sendMessage(
      JSON.stringify({
        type,
        listeners,
        from,
        data
      }),
      "SYSTEM_COMMAND"
    );
  }

  sendMessage(msg, type = "TIM_TEXT") {
    let message = this.tim.createCustomMessage({
      to: this.roomId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        data: msg,
        description: "",
        extension: type
      }
    });

    return this.tim.sendMessage(message);
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
          Emitter.emit("LIVE_TIM_READY", this.tim);
          resolve(tim);
        })
        .catch(imError => {
          console.warn("login error:", imError); // 登录失败的相关信息
        });
    });
  }
  logout() {
    this.tim.logout();
  }
  async sendBoardMsg(data) {
    let message = this.tim.createCustomMessage({
      to: this.roomId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        data: JSON.stringify(data),
        description: "",
        extension: "TXWhiteBoardExt"
      }
    });
    return this.tim.sendMessage(message);
  }

  async listenHandler() {
    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, e => {
      e.data.forEach(item => {
        if (item.to != this.roomId) return;
        const type = item.payload.extension;
        let data = item.payload.data;
        switch (type) {
          case "TXWhiteBoardExt":
            liveBroadcastService.boardService
              .getActiveBoard()
              .addSyncData(data);
            break;
          case "TIM_TEXT":
            Emitter.emit("TIM_CUSTOM_MESSAGE", item);
            break;
          case "SYSTEM_COMMAND":
            data = JSON.parse(data);
            if (!this.isListener(data.listeners)) break;
            Emitter.emit("SYS_" + data.type, data);
            break;
          default:
            break;
        }
      });
    });
    await listenHandler();
  }

  isListener(listeners) {
    if (!listeners) return true;
    const currentRole = store.state.account.role;
    const currentId = store.state.account.userId;
    if (listeners == currentRole || currentRole == currentId) return true;
    if (listeners instanceof Array) {
      if (listeners.find(f => f == currentId)) return true;
    }
  }
}
