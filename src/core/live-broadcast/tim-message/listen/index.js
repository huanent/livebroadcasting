import { Emitter } from "../../../emit";
import store from "@/store";
import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
import { ROLE } from "../../../../store/account";
import { getStateValue, syncConfig } from "../../../state-sync";
export const listenHandler = async function() {
  Emitter.on("SYS_STATE_SYNC", data => {
    store.commit("SYNC_STATE", data.data);
  });

  Emitter.on("SYS_PULL_STATE", data => {
    const config = syncConfig.filter(
      f => f.sender == ROLE.TEACHER && f.listener == ROLE.STUDENT
    );

    for (const i of config) {
      let value = getStateValue(store.state, i.path);
      liveBroadcastService.timService.sendSystemMsg("STATE_SYNC", data, {
        value: value,
        path: i.path
      });
    }
  });

  Emitter.on("board-data-change", data => {
    liveBroadcastService.timService.sendBoardMsg(data);
  });

  Emitter.on("LIVE_READY", () => {
    const currentRole = store.state.account.role;
    if (currentRole == ROLE.STUDENT) {
      setTimeout(() => {
        liveBroadcastService.timService.sendSystemMsg(
          "PULL_STATE",
          ROLE.TEACHER,
          store.state.account.userInfo.username
        );
      }, 2000);
    }
  });
};
