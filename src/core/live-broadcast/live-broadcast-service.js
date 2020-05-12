import { createRoom, enterRoom } from "../data/data-service";
import store from "@/store";
import COS from "cos-js-sdk-v5";
window["COS"] = COS;
import Vue from "vue";
import { Emitter } from "../emit";
import { TrtcService } from "./trtc-service";
import { TimService } from "./tim-service";
import { BoardService } from "./board-service";
import { app } from "../../main";
import { pushState } from "./tim-message/send";

class LiveBroadcastService {
  config;
  mode = "live";
  TokenList = {};
  roomId = "114467658173138";
  activeBoard = null;
  userId = "caffrey";
  tim;
  teacherStreamUserId = "caffrey";
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
      await this.getUserSig("default");
      await this.timService.init(this);
      this.trtcService.init(this.roomId, this);
      await this.boardService.init(this.roomId, this);
      await this.timService.listenHandler();
      observerJson = getDataSate();
      watchState();
      return true;
    } else {
      console.error(res.data.messages);
    }
  }
  async destroy() {
    unwWatchState();
  }
}

export let liveBroadcastService = null;

Emitter.on("LIVE_INIT", async () => {
  liveBroadcastService = new LiveBroadcastService();
  await liveBroadcastService.init();
  Emitter.emit("LIVE_READY");
});
const props = ["boardTotalPage", "boardNumber", "boardScale", "panelType"];

const getDataSate = function() {
  let ob = {};
  props.forEach(key => {
    if (store.state.workplace[key]) {
      ob[key] = store.state.workplace[key];
    }
  });
  return { workplace: ob };
};
const getDiff = function(origin, target) {
  let ob;
  ob = {};
  for (let i in origin) {
    try {
      if (JSON.stringify(target[i]) !== JSON.stringify(origin[i])) {
        ob[i] = origin[i];
      }
    } catch (e) {
      ob[i] = origin[i];
    }
  }
  return ob;
};
let watchInstance = {};
let observerJson = {};

const watchState = function() {
  props.forEach(key => {
    if (store.state.workplace[key]) {
      watchInstance[key] = app.$watch("$store.state.workplace." + key, {
        deep: true,
        handler: async function(a, b) {
          let oldVal = observerJson;
          observerJson = getDataSate();
          let diff = getDiff(observerJson.workplace, oldVal.workplace);
          await pushState(diff);
        }
      });
    }
  });
};

const unwWatchState = function() {
  props.forEach(key => {
    if (store.state.workplace[key]) {
      watchInstance[key]();
    }
  });
};
