import TIM from "tim-js-sdk";

import store from "@/store";
let TEduBoard = window["TEduBoard"];
import { liveBroadcastService } from "@/main";
import { Emitter } from "../emit";

export class BoardService {
  activeBoard = null;
  liveBroadcastService;
  boardInitParams = {
    brushColor: store.state.board.brushColor,
    brushThin: store.state.board.brushThin,
    textColor: store.state.board.textColor,
    textSize: store.state.board.textSize,
    toolType: store.state.board.toolType,

    drawEnable: store.state.board.drawEnable
  };
  async init(roomId, liveBroadcastService) {
    this.liveBroadcastService = liveBroadcastService;
    let tim = this.liveBroadcastService.timService.tim;
    let token = await liveBroadcastService.getUserSig("default");
    let initParams = {
      id: "board-el",
      classId: roomId,
      sdkAppId: store.state.account.sdkAppId,
      userId: token.id,
      userSig: token.userSig
    };

    let teduBoard = new TEduBoard(
      Object.assign({}, initParams, this.boardInitParams)
    );
    teduBoard.on(TEduBoard.EVENT.TEB_SYNCDATA, data => {
      console.log(roomId);
      let message = tim.createCustomMessage({
        to: roomId,
        conversationType: TIM.TYPES.CONV_GROUP,
        payload: {
          data: JSON.stringify(data),
          description: "",
          extension: "TXWhiteBoardExt"
        }
      });
    });
    this.activeBoard = teduBoard;
    teduBoard.on(TEduBoard.EVENT.TEB_INIT, () => {
      setTimeout(function() {
        let fileListInfo = teduBoard.getFileInfoList();
        store.commit("workplace/BOARD_PROFILES", fileListInfo);
        let lastindex = fileListInfo.length - 1;
        store.commit("workplace/BOARD_INDEX", lastindex);
      }, 3000);
      Emitter.emit("board-init");
    });
    Emitter.on("split-change", () => {
      this.getActiveBoard().resize();
    });
    return teduBoard;
  }
  getActiveBoard() {
    return this.activeBoard;
  }
  setActiveBoard(activeBoard) {
    this.activeBoard = activeBoard;
  }
  switchFile(fid) {
    let activeBoard = this.getActiveBoard();
    let info = activeBoard.getFileInfo(fid);
    if (!info) return;
    activeBoard.switchFile(
      info.fid,
      info.currentPageIndex,
      info.currentPageStep
    );
    let scale = info.scale;
    store.commit("workplace/BOARD_TOTAL_PAGE", info.pageCount);
    store.commit("workplace/BOARD_NUMBER", info.currentPageIndex + 1);
    store.commit("workplace/BOARD_SCALE", scale);
  }
  resetBoard(activeBoard) {
    activeBoard.reset();
  }
  async addBoardFiles(resultUrl, title, pages, resolution) {
    this.getActiveBoard().addTranscodeFile({
      url: resultUrl,
      title: title,
      pages: pages,
      resolution: resolution
    });
    this.getBoardFiles();
  }
  addBoard() {
    liveBroadcastService.activeBoard.addBoard();
    store.commit("workplace/BOARD_INDEX", 0);
  }
  getBoardFiles() {
    let self = this;
    setTimeout(function() {
      let fileListInfo = self.activeBoard.getFileInfoList();
      let id = self.activeBoard.getCurrentFile();
      let index = self.getIndexByFid(fileListInfo, id);
      store.commit("workplace/BOARD_PROFILES", fileListInfo);
      store.commit("workplace/BOARD_INDEX", index);
    }, 3000);
  }
  clearAllBoardFiles() {
    let list = this.activeBoard.getFileInfoList();
    // let id = this.activeBoard.getCurrentFile();
    list.forEach(file => {
      this.activeBoard.deleteFile(file.fid);
    });
  }
  getIndexByFid(fileListInfo, fid) {
    let result;
    fileListInfo.find((item, index) => {
      if (item.fid === fid) {
        result = index;
      }
    });
    return result;
  }
  deleteCurrentFile() {
    let id = this.activeBoard.getCurrentFile();
    this.activeBoard.deleteFile(id);
  }
  deleteBoardFile(fid) {
    this.getActiveBoard().deleteFile(fid);
    this.getBoardFiles();
  }
}
