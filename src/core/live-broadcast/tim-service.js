import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import store from "@/store";
import { Emitter } from "../emit";
window["COS"] = COS;

export class TimService {
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

  async init(token) {
    this.token = token;
    this.tim = TIM.create({ SDKAppID: this.token.appId });
    this.tim.setLogLevel(2);
    this.tim.registerPlugin({ "cos-js-sdk": COS });

    await this.tim.login({
      userID: this.token.id,
      userSig: this.token.userSig
    });

    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, e => {
      Emitter.emit("tim_message_received", e.data);
    });
  }

  logout() {
    return this.tim.logout();
  }
}
