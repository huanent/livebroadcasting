import { createRoom, enterRoom } from "../data/data-service";
import store from "@/store";
import COS from "cos-js-sdk-v5";
window["COS"] = COS;
import { Emitter } from "../emit";
import { TrtcService } from "./trtc-service";
import { TimService } from "./tim-service";
import { BoardService } from "./board-service";
class LiveBroadcastService {
  config;
  mode = "live";
  activeBoard = null;
  userId = localStorage.getItem("lb_userId");
  tim;
  teacherStreamUserId = store.state.workplace.teacherId;
  trtcService;
  timService;
  boardService;
  constructor() {
    this.trtcService = new TrtcService();
    this.timService = new TimService();
    this.boardService = new BoardService();
  }

  async init() {
    await this.timService.init(this);
    this.trtcService.init(this.roomId, this);
    await this.boardService.init(this.roomId, this);
    await this.timService.listenHandler();
    return true;
  }
  async destroy() {}
}

export let liveBroadcastService = null;

Emitter.on("LIVE_INIT", async () => {
  liveBroadcastService = new LiveBroadcastService();
  await liveBroadcastService.init();
  Emitter.emit("LIVE_READY");
});
