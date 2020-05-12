import TIM from "tim-js-sdk";
import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
import { Emitter } from "../../../emit";
import store from "@/store";
import { ROLE } from "../../../../store/account";
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
    "ALL",
    data
  );
};
export const requestTeacherPanelType = async () => {
  await liveBroadcastService.timService.sendSystemMsg(
    "REQUEST_PANEL_TYPE",
    "ROLE_TEACHER",
    {}
  );
};
export const requestBoardState = async () => {
  await liveBroadcastService.timService.sendSystemMsg(
    "REQUEST_BOARD_STATE",
    "ROLE_TEACHER",
    {}
  );
};
export const responseState = async id => {
  let userIds = [id];
  if (id === "ALL" || id === "ROLE_TEACHER" || id === "ROLE_NOT_TEACHER") {
    userIds = id;
  }
  let data = {
    boardTotalPage: store.state.workplace.boardTotalPage,
    boardNumber: store.state.workplace.boardNumber,
    boardScale: store.state.workplace.boardScale
  };
  await liveBroadcastService.timService.sendSystemMsg(
    "REQUEST_STATE_BACK",
    userIds,
    data
  );
};
export const syncState = async () => {
  await requestTeacherPanelType();
  await requestBoardState();
};
export const pushState = async data => {
  await liveBroadcastService.timService.sendSystemMsg(
    "WS_STATE_CHANGE",
    "ROLE_NOT_TEACHER",
    data
  );
};
