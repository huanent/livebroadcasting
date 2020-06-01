import store from "@/store";
let TEduBoard = window["TEduBoard"];
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
    drawEnable: store.state.features.canControlBoard,
    globalBackgroundColor: "rgba(255, 255, 255, 0.01)"
  };

  async init(token) {
    let initParams = {
      id: "board-el",
      classId: token.classId,
      sdkAppId: token.appId,
      userId: token.id,
      userSig: token.userSig
    };

    let teduBoard = new TEduBoard(
      Object.assign({}, initParams, this.boardInitParams)
    );
    teduBoard.on(TEduBoard.EVENT.TEB_SYNCDATA, data => {
      Emitter.emit("board-data-change", data);
      this.syncState();
    });
    this.activeBoard = teduBoard;
    this.activeBoard.setBoardContentFitMode(1);
    teduBoard.on(TEduBoard.EVENT.TEB_HISTROYDATA_SYNCCOMPLETED, () =>
      this.syncState()
    );
    Emitter.on("remote-board-data-change", data => {
      this.getActiveBoard().addSyncData(data);
      setTimeout(() => {
        this.syncState();
      }, 100);
    });
    return teduBoard;
  }

  destroy() {
    try {
      this.activeBoard.destroy();
    } catch (error) {
      console.error("销毁tiw失败", error);
    }
  }
  getActiveBoard() {
    return this.activeBoard;
  }

  setActiveBoard(activeBoard) {
    this.activeBoard = activeBoard;
  }

  switchFile(file) {
    this.activeBoard.switchFile(
      file.fid,
      file.currentPageIndex,
      file.currentPageStep
    );
  }

  deleteFile(value) {
    this.activeBoard.deleteFile(value);
  }

  scale(value) {
    this.activeBoard.setBoardScale(value);
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
  }

  syncState() {
    if (!this.activeBoard) return;
    let fileList = this.activeBoard.getFileInfoList();
    let fid = this.activeBoard.getCurrentFile();
    let currentFile = this.activeBoard.getFileInfo(fid);
    currentFile.scale = this.activeBoard.getBoardScale();
    store.commit("board/SYNC_STATE", {
      fileList,
      currentFile
    });
  }
}
