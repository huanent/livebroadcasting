import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import store from "@/store";
import { Emitter } from "../emit";
export class TimService {
  liveBroadcastService;
  tim;
  roomId;
  async sendSystemMsg(type, userIds, data, ...flag) {
    let datas = JSON.stringify({
      type: type,
      userIds: userIds,
      data: data,
      flag: flag
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
  handleExamination(e) {}
  async sendExaminationMsg(msg) {
    let message = this.tim.createCustomMessage({
      to: this.roomId,
      conversationType: TIM.TYPES.CONV_GROUP,
      payload: {
        data: msg,
        description: "",
        extension: "EXMAMINATION_SEND"
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
  handSystemComand(data) {
    const info = JSON.parse(data);
    if (
      info.userIds instanceof Array &&
      info.userIds.includes(this.liveBroadcastService.userId)
    ) {
      Emitter.emit("CONTROL_LOCAL_STREAM", JSON.parse(data));
    } else if (typeof info.userIds === "string" && info.userIds === "all") {
      if (info.type === "CONTROL_WORKPLACE_TYPE") {
        store.commit("workplace/SET_PANEL_TYPE", info.data);
      }
    }
  }
  async switchWorkplaceType(panelType) {
    await this.sendSystemMsg("CONTROL_WORKPLACE_TYPE", "all", panelType);
  }
  listenHandler() {
    let self = this;
    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, function(e) {
      e.data.forEach(item => {
        const type = item.payload.extension;
        const data = item.payload.data;
        // SYSTEM_COMMAND || TXWhiteBoardExt || TIM_TEXT
        switch (type) {
          case "TXWhiteBoardExt":
            self.liveBroadcastService.boardService
              .getActiveBoard()
              .addSyncData(data);
            break;
          case "SYSTEM_COMMAND":
            self.handSystemComand(data);
            break;
          case "EXMAMINATION_RECEIVE":
            self.handleExamination(e);
            break;
          default:
            Emitter.emit("TIM_CUSTOM_MESSAGE", item);
        }
      });
    });
  }
}
