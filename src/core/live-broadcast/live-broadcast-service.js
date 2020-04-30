import TRTC from "trtc-js-sdk";
import {
  createRoom,
  enterRoom,
  getClassByRoomID,
  getSdkAppId
} from "../data/data-service";

import TIM from "tim-js-sdk";

import COS from "cos-js-sdk-v5";
window["COS"] = COS;

import { liveBroadcastService } from "../../main";

// let resizeTimer = null;

import store from "@/store";
import { Emitter } from "../emit";
import router from "../../router";
import { TrtcService } from "./trtc-service";
import { TimService } from "./tim-service";
import { BoardService } from "./board-service";

Emitter.on("split-change", () => {
  // if (resizeTimer) {
  //   return;
  // }
  // resizeTimer = setTimeout(() => {
  liveBroadcastService.activeBoard.resize();
  //   resizeTimer = null;
  // }, 100);
});

const toUserId = "7";

export class LiveBroadcastService {
  config;
  sdkAppId = getSdkAppId();
  mode = "live";
  TokenList = {};
  roomId = "98894785075365";
  activeBoard = null;
  userId = "jongwong";
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
      /*   this.roomId = res.data.model.roomId;*/
      let token = await this.getUserSig("default");
      this.timService.init(this.sdkAppId, token).then(tim => {
        /*    this.initBoard();
        this.initBoardOptions();*/

        /*  sdkAppId, roomId, token*/
        this.boardService.init(this.sdkAppId, this.roomId, token);
        this.boardService.initBoardOptions();
      });
      this.trtcService.init(this.roomId, token);
    } else {
      console.error(res.data.messages);
    }
  }
}
