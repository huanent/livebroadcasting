import store from "@/store";
import { Emitter } from "../emit";
import { TrtcService } from "./trtc-service";
import { TimService } from "./tim-service";
import { BoardService } from "./board-service";
import { ROLE } from "../../models/role";
import { syncConfig, getStateValue } from "../state-sync";

class LiveBroadcastService {
  config;
  mode = "live";
  trtcService;
  timService;
  boardService;

  constructor() {
    this.trtcService = new TrtcService();
    this.timService = new TimService();
    this.boardService = new BoardService();
  }

  async init() {
    let token = store.state.workplace.token;
    await this.timService.init(token);
    this.trtcService.init("", this);
    await this.boardService.init(token);

    Emitter.on("board-data-change", data => {
      this.timService.sendMessage(JSON.stringify(data), "TIW_DATA");
    });

    Emitter.on("tim_message_received", data => {
      data.forEach(item => {
        if (item.to != token.classId.toString()) return;
        const type = item.payload.extension;
        let data = item.payload.data;
        switch (type) {
          case "TIW_DATA":
            this.boardService.getActiveBoard().addSyncData(data);
            break;
          case "TIM_TEXT":
            store.commit("workplace/ADD_CHAT_MESSAGE", JSON.parse(data));
            break;
          case "SYSTEM_COMMAND":
            data = JSON.parse(data);
            if (!this.isListener(data.listeners)) break;
            Emitter.emit("SYS_" + data.type, data.data);
            break;
          default:
            break;
        }
      });
    });

    Emitter.on("SYS_STATE_SYNC", data => {
      store.commit("SYNC_STATE", data);
    });

    Emitter.on("SYS_PULL_STATE", data => {
      const config = syncConfig.filter(
        f => f.sender == ROLE.TEACHER && f.listener == ROLE.STUDENT
      );

      for (const i of config) {
        let value = getStateValue(store.state, i.path);
        this.timService.sendSystemMsg("STATE_SYNC", data, {
          value: value,
          path: i.path
        });
      }
    });

    return true;
  }
  async destroy() {
    if (this.timService) await this.timService.logout();
    if (this.boardService) this.boardService.destroy();
  }

  isListener(listeners) {
    if (!listeners) return true;
    const currentRole = store.state.account.role;
    const id = store.state.account.userInfo.username;
    if (listeners == currentRole || listeners == id) return true;
    if (listeners instanceof Array) {
      if (listeners.find(f => f == id)) return true;
    }
  }
}

export let liveBroadcastService = null;

export async function initLiveBroadcastService() {
  liveBroadcastService = new LiveBroadcastService();
  await liveBroadcastService.init();
  Emitter.emit("LIVE_READY");
}
