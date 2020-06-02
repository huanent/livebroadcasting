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
    this.trtcService.init(token);
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
            Emitter.emit("remote-board-data-change", data);
            break;
          case "TIM_TEXT":
            let msg = JSON.parse(data);
            msg.time = new Date(item.time * 1000);
            store.commit("workplace/ADD_CHAT_MESSAGE", msg);
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

    Emitter.on("SYS_RUSH_ANSWER", data => {
      store.commit("widget/RUSH_ANSWER", data);
    });

    Emitter.on("SYS_PULL_STATE", data => {
      const config = syncConfig.filter(
        f => f.sender == ROLE.TEACHER && f.listener == ROLE.STUDENT
      );

      let msgs = [];

      for (const i of config) {
        let value = getStateValue(store.state, i.path);
        msgs.push({
          value: value,
          path: i.path
        });
      }

      this.timService.sendSystemMsg("STATE_SYNC", data, msgs);
    });

    return true;
  }
  async destroy() {
    if (this.boardService) this.boardService.destroy();
    await this.timService.destroy();
    if (this.trtcService) await this.trtcService.destroy();
    this.initStatus();
    liveBroadcastService = null;

    return true;
  }
  initStatus() {
    store.commit("workplace/INIT_STATE");
    store.commit("account/INIT_STATE", ROLE.STUDENT);
    store.commit("board/INIT_STATE");
    store.commit("features/INIT_STATE", ROLE.STUDENT);
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