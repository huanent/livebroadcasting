import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import store from "@/store";
import { Emitter } from "../emit";
import { listenHandler } from "./tim-message/listen";
import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
export class TimService {
  liveBroadcastService;
  tim;
  token;

  sendSystemMsg(type, listeners, data) {
    return this.sendMessage(
      JSON.stringify({
        type,
        listeners,
        data
      }),
      "SYSTEM_COMMAND"
    );
  }

  sendMessage(msg, type = "TIM_TEXT") {
    let message = this.tim.createCustomMessage({
      to: this.token.classId.toString(),
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
    this.token = store.state.workplace.token;
    this.liveBroadcastService = liveBroadcastService;
    this.tim = TIM.create({ SDKAppID: this.token.appId });

    this.tim.setLogLevel(2); // 普通级别，日志量较多，接入时建议使用
    // 注册 COS SDK 插件
    this.tim.registerPlugin({ "cos-js-sdk": COS });
    await this.tim.login({
      userID: this.token.id,
      userSig: this.token.userSig
    });
    Emitter.emit("LIVE_TIM_READY", this.tim);
  }
  logout() {
    this.tim.logout();
  }

  async sendBoardMsg(data) {
    let message = this.tim.createCustomMessage({
      to: this.token.classId.toString(),
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
        if (item.to != this.token.classId.toString()) return;
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
    const id = store.state.account.userInfo.username;
    if (listeners == currentRole || listeners == id) return true;
    if (listeners instanceof Array) {
      if (listeners.find(f => f == id)) return true;
    }
  }
}
