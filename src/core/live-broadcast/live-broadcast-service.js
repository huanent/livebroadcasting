import { createRoom, enterRoom } from "../data/data-service";

import COS from "cos-js-sdk-v5";
window["COS"] = COS;

import { liveBroadcastService } from "../../main";

import { Emitter } from "../emit";
import { TrtcService } from "./trtc-service";
import { TimService } from "./tim-service";
import { BoardService } from "./board-service";

Emitter.on("split-change", () => {
  liveBroadcastService.activeBoard.resize();
});

export class LiveBroadcastService {
  config;
  mode = "live";
  TokenList = {};
  roomId = "109264896101959";
  activeBoard = null;
  userId = "jinrui";
  tim;
  trtcService;
  timService;
  boardService;
  constructor() {
    this.trtcService = new TrtcService();
    this.timService = new TimService();
    this.boardService = new BoardService();
  }
  async getUserSig(key) {
    if (!key) {
      key = "default";
    }
    if (this.TokenList[key] && !this.TokenList[key].isExpired) {
      return this.TokenList[key];
    } else {
      let id = this.userId;
      if (key !== "default") {
        id = this.userId + "_" + key;
      }
      let res = await enterRoom(id, this.roomId);
      let token = Object.assign({ isExpired: false }, res.data);
      this.TokenList[key] = token;
      return token;
    }
  }
  async init() {
    let res = await createRoom(this.userId);
    if (res && res.data.success) {
      let token = await this.getUserSig("default");
      let tim = await this.timService.init(this);
      this.trtcService.init(this.roomId, this);
      await this.boardService.init(this.roomId, this);
      this.timService.listenHandler();
      return true;
    } else {
      console.error(res.data.messages);
    }
  }
}
