import TIM from "tim-js-sdk";
import { liveBroadcastService } from "../../../../main";
import { Emitter } from "../../../emit";
import store from "@/store";
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
export const switchWorkplaceType = async (panelType, streamId) => {
  let data = {
    panelType
  };
  if (streamId) {
    Object.assign(data, { streamId });
  }
  await liveBroadcastService.timService.sendSystemMsg(
    "CONTROL_WORKPLACE_TYPE",
    "all",
    data
  );
};
export const requestTeacherPanelType = async () => {
  await liveBroadcastService.timService.sendSystemMsg(
    "REQUEST_PANEL_TYPE",
    "teacher",
    {}
  );
};
export const requestState = async () => {
  await liveBroadcastService.timService.sendSystemMsg(
    "REQUEST_STATE",
    "teacher",
    {}
  );
  Emitter.on("SYS_REQUEST_STATE_BACK", (info, data, e, type) => {
    store.commit("workplace/BOARD_TOTAL_PAGE", data.boardTotalPage);
    store.commit("workplace/BOARD_NUMBER", data.boardNumber);
    store.commit("workplace/BOARD_SCALE", data.boardScale);
  });
};
export const syncState = async () => {
  await requestTeacherPanelType();
};
