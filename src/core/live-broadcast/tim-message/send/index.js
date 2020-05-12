import TIM from "tim-js-sdk";
import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
export const sendExaminationMsg = async msg => {
  let message = liveBroadcastService.timService.createCustomMessage({
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
};

export const pushState = async data => {
  await liveBroadcastService.timService.sendSystemMsg(
    "WS_STATE_CHANGE",
    "ROLE_NOT_TEACHER",
    data
  );
};
