// import TIM from "tim-js-sdk";
// import COS from "cos-js-sdk-v5";
import { Emitter } from "../emit";
// window["COS"] = COS;

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

    this.tim.on(TIM.EVENT.MESSAGE_RECEIVED, this.timMessageHandler);
    this.tim.on(TIM.EVENT.KICKED_OUT, this.timKickedOutHandler);
  }

  timMessageHandler(e) {
    Emitter.emit("tim_message_received", e.data);
  }

  timKickedOutHandler(e) {
    let type = e.data.type;
    let emitType = "";
    switch (type) {
      case TIM.TYPES.KICKED_OUT_MULT_ACCOUNT:
        emitType = "MULT_ACCOUNT";
        break;
      case TIM.TYPES.KICKED_OUT_MULT_DEVICE:
        emitType = "MULT_DEVICE";
        break;
      default:
        emitType = "USERSIG_EXPIRED";
    }
    Emitter.emit("tim_kicked_out", emitType);
  }

  async destroy() {
    this.tim.off(TIM.EVENT.MESSAGE_RECEIVED, this.timMessageHandler);
    this.tim.off(TIM.EVENT.KICKED_OUT, this.timKickedOutHandler);
    return await this.tim.logout();
  }
}
