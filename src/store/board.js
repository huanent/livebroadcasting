const state = {
  //board(涂鸦)
  drawEnable: true, //是否可以涂鸦
  synDrawEnable: true, //是否将你画的涂鸦同步给其他人
  toolType: 1,
  brushThin: 100,
  backgroundImage: "背景图",
  backgroundImageH5: "背景图H5",
  backgroundColor: "#ff0000",
  globalBackgroundColor: "#ff0000",
  brushColor: "#ff0000",
  textColor: "#ff0000",
  textStyle: "#ff0000",
  textFamily: "sans-serif,serif,monospace",
  textSize: 320,
  scaleSize: 100,
  fitMode: 1,
  ration: "16:9",
  canRedo: 0,
  canUndo: 0,
};

const getters = {
  activeBoard: state => {
    return state;
  }
};

const mutations = {
  onSetBrushColor(color) {
    this.brushColor = this.rgbToHex(color);
    this.teduBoard.setBrushColor(this.brushColor);
  },
  /**
 * 设置涂鸦粗细
 * @param {*} num 
 */
  onSetThin(num) {
    teduBoard.setBrushThin(num);
  },

  /**
   * 清空当前页涂鸦(保留背景色/图片)
   */
  onclearDraws() {
    teduBoard.clear();
  },

  /**
   * 清空当前页涂鸦 + 背景色/图片
   */
  onClear() {
    teduBoard.clear(true);
  },

  // 回退
  onUndo() {
    teduBoard.undo();
  },

  // 重做
  onRedo() {
    teduBoard.redo();
  },

  //Board(涂鸦操作)
  onSetDrawEnable() {
    this.teduBoard.setDrawEnable(this.drawEnable);
  },

  onSetTextSize(size) {
    this.teduBoard.setTextSize(size);
  },

  onSetTextColor(color) {
    this.textColor = this.rgbToHex(color);
    this.teduBoard.setTextColor(this.textColor);
  },

  onSetBackgroundImage(backgroundImage) {
    var path = backgroundImage;
    this.teduBoard.setBackgroundImage(path);
  },

  onSetBackgroundH5(backgroundImageH5) {
    var path = backgroundImageH5;
    this.teduBoard.setBackgroundH5(path);
  },

  onGotoBoard(boardId) {
    this.teduBoard.gotoBoard(boardId, false);
  },

  onSetScale(scale) {
    this.teduBoard.setBoardScale(scale);
  },
};

export default {
  namespaced: true,
  state,
  getters,
  mutations
};
