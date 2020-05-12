import { Emitter } from "../../../emit";
import store from "@/store";
import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
import { pushState } from "../send";
import { ROLE } from "../../../../store/account";
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
    } else if (typeof info.userIds === "string") {
      switch (info.userIds) {
        case "ALL":
          Emitter.emit(
            "SYS_" + info.type,
            info,
            info.data,
            e,
            "SYS_" + info.type
          );
          break;
        case "ROLE_TEACHER":
          if (store.state.account.role === ROLE.TEACHER) {
            Emitter.emit(
              "SYS_" + info.type,
              info,
              info.data,
              e,
              "SYS_" + info.type
            );
          }

          break;
        case "ROLE_NOT_TEACHER":
          if (store.state.account.role !== ROLE.TEACHER) {
            Emitter.emit(
              "SYS_" + info.type,
              info,
              info.data,
              e,
              "SYS_" + info.type
            );
          }
          break;
      }
    }
  });
  Emitter.on("board-data-change", data => {
    liveBroadcastService.timService.sendBoardMsg(data);
  });
  Emitter.on("SYS_WS_PUSH_STATE", (info, data, e, type) => {
    store.commit("workplace/MERGE_STATE", data);
  });
  Emitter.on("SYS_WS_PULL_STATE", async (info, data, e, type) => {
    if (liveBroadcastService.timService.tim) {
      await pushState(stateHistory);
    }
  });
};
Emitter.on("LIVE_TIM_READY", () => {
  stateHistory = getState(store.state.workplace);
});

const getDiff = function(n, o) {
  let ob;
  ob = {};
  for (let i in n) {
    if (n[i] !== o[i]) {
      ob[i] = n[i];
    }
  }
  return ob;
};

export let getState = function(state) {
  const props = ["boardTotalPage", "boardNumber", "boardScale", "panelType"];
  let ob = {};
  props.forEach(key => {
    ob[key] = state[key];
  });
  return ob;
};
let stateHistory = {};

Emitter.on("workplace-state-change", () => {
  let n = getState(store.state.workplace);
  let o = stateHistory;
  let diff = getDiff(n, o);
  stateHistory = n;
  let keys = Object.keys(diff);
  if (keys.length > 0) {
    if (liveBroadcastService.timService.tim) {
      pushState(diff).then(() => {});
    }
  }
});
