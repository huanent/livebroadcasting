import { Emitter } from "../../../emit";
import store from "@/store";
import { liveBroadcastService } from "../../../../main";
export const listenHandler = async function() {
  Emitter.on("TXWhiteBoardExt", (data, item, e, type) => {
    liveBroadcastService.boardService.getActiveBoard().addSyncData(data);
  });
  Emitter.on("EXMAMINATION_RECEIVE", (data, item, e, type) => {
    liveBroadcastService.timService.handleExamination(e);
  });
  Emitter.on("TIM_TEXT", (data, item, e, type) => {
    Emitter.emit("TIM_CUSTOM_MESSAGE", item);
  });
  Emitter.on("SYSTEM_COMMAND", (data, item, e, type) => {
    const info = JSON.parse(data);
    if (
      info.userIds instanceof Array &&
      (info.userIds.includes("kblive_" + liveBroadcastService.userId) ||
        info.userIds.includes(liveBroadcastService.userId))
    ) {
      Emitter.emit("SYS_" + info.type, info, info.data, e, "SYS_" + info.type);
    } else if (typeof info.userIds === "string" && info.userIds === "all") {
      Emitter.emit("SYS_" + info.type, info, info.data, e, "SYS_" + info.type);
    } else if (
      typeof info.userIds === "string" &&
      info.userIds === "teacher" &&
      store.state.account.role === "teacher"
    ) {
      Emitter.emit("SYS_" + info.type, info, info.data, e, "SYS_" + info.type);
    }
  });
  Emitter.on("SYS_REQUEST_PANEL_TYPE", (info, data, e, type) => {
    store.commit("workplace/SEND_PANEL_TYPE");
  });
  Emitter.on("SYS_CONTROL_WORKPLACE_TYPE", (info, data, e, type) => {
    store.commit("workplace/SET_PANEL_TYPE", data.panelType);
  });
  Emitter.on("board-data-change", data => {
    liveBroadcastService.timService.sendBoardMsg(data);
  });
};
