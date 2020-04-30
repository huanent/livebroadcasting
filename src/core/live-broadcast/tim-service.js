import TIM from "tim-js-sdk";
import COS from "cos-js-sdk-v5";
import store from "@/store";
export class TimService {
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
  async init(token) {
    let tim = TIM.create({
      SDKAppID: store.state.account.sdkAppId
    }); // SDK 实例通常用 tim 表示

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
}
