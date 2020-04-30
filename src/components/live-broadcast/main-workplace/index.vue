<template>
  <div class="main-workplace-container">
    <BoardTabs
      :datas="boardProfiles"
      @on-close="onTabsClose"
      :active-index.sync="index"
      @index-change="indexChange($event)"
      @type-change="onChange"
      class="workplace-content"
      :show-lable="panelType === 'board'"
    >
      <div class="board-wrapper" v-show="panelType === 'board'">
        <div id="board-el" class="roll-scroll"></div>
      </div>
      <div
        ref="screenParent"
        class="board-wrapper"
        v-show="panelType === 'screen'"
      >
        <div ref="screen" style="height: 100%;width: 100%;"></div>
      </div>
      <div class="board-wrapper" v-show="panelType === 'camera'">
        <div
          ref="camera"
          id="workplace-camera"
          style="height: 100%;width: 100%"
        ></div>
      </div>
    </BoardTabs>
    <div class="workplace-footer">
      <workplace-footer v-show="panelType === 'board'" />
    </div>
    <Toolbar v-show="panelType === 'board'"></Toolbar>
  </div>
</template>

<script>
import Toolbar from "../toolbar/index";
import BoardTabs from "./board-tabs";
import WorkplaceFooter from "../workplace-footer";
import { liveBroadcastService } from "../../../main";
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "MainWorkplace",
  components: { Toolbar, BoardTabs, WorkplaceFooter },
  data() {
    return {
      panelType: "screen"
    };
  },
  methods: {
    ...mapMutations("workplace", [
      "SET_BOARD_PROFILES",
      "DELETE_BOARD_FILE",
      "BOARD_INDEX"
    ]),
    ...mapMutations("localStream", [
      "LOCAL_STREAM_PLAY",
      "LOCAL_STREAM_STOP_PLAY",
      "SELF_CAMERA_STATUS"
    ]),
    ...mapMutations("localShareScreenStream", [
      "LOCAL_SHARE_SCREEN_PLAY",
      "LOCAL_SHARE_SCREEN_STOP_PLAY"
    ]),
    onTabsClose(item, index) {
      if (item.fid) {
        this.DELETE_BOARD_FILE(item.fid);
      }
    },
    indexChange(index) {
      this.BOARD_INDEX(index);
    },
    onChange(type) {
      let self = this;
      this.panelType = type;
      if (type === "camera") {
        let el = this.$refs.camera;
        if (el) {
          self.SELF_CAMERA_STATUS(false);
          this.LOCAL_STREAM_STOP_PLAY();
          setTimeout(() => {
            self.LOCAL_STREAM_PLAY(el);
          }, 300);
        }
      } else {
        if (!this.selfCameraStatus) {
          this.LOCAL_STREAM_STOP_PLAY();
          setTimeout(() => {
            self.SELF_CAMERA_STATUS(true);
          }, 300);
        }
        if (type === "screen") {
          if (this.$refs.screen) {
            console.log(
              "=========================================================================================================="
            );
            // console.log(this.$refs.screenParent.children.children);
            console.log(this.$refs.screen);
            this.LOCAL_SHARE_SCREEN_PLAY(this.$refs.screen);
          } else {
            this.LOCAL_SHARE_SCREEN_STOP_PLAY();
          }
        }
      }
      // if (!this.$refs.screen) return;
      // let targetNode = this.$refs.screen;
      // let config = {
      //   childList: true,
      //   subtree: true
      // };
      // let observer;
      // const mutationCallback = mutationsList => {
      //   for (let mutation of mutationsList) {
      //     let type = mutation.type;
      //     if (type === "childList") {
      //       this.visibility = true;
      //       if (observer) {
      //         observer.disconnect();
      //       }
      //     }
      //   }
      // };
      // observer = new MutationObserver(mutationCallback);
      // observer.observe(targetNode, config);
    }
  },
  mounted() {
    liveBroadcastService.init();
    // console.log(
    //   "=========================================================================================================="
    // );
    // console.log(this.$refs.screenParent.children);
  },
  computed: {
    ...mapGetters("localStream", ["selfCameraStatus"]),
    boardProfiles() {
      return this.$store.state.workplace.boardProfiles;
    },
    index() {
      return this.$store.state.workplace.activeBoardIndex;
    }
  },
  watch: {
    index(value) {
      let fileInfo = this.boardProfiles[value];
      liveBroadcastService.switchFile(fileInfo.fid);
    },
    "this.$refs.children": function() {
      console.log(
        "---------------------------------------------------------------------------------------------------------------------------"
      );
    }
  }
};
</script>

<style scoped lang="scss">
.main-workplace-container {
  height: 100%;
  width: 100%;
  position: relative;
}
.workplace-footer {
  height: 2rem;
  color: #737882;
  background-color: #171717;
}
.workplace-content {
  height: calc(100% - 2rem);
}
#board-el {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.board-wrapper {
  position: relative;
  //原始
  height: calc(100% - 4rem);
  width: calc(100% - 10rem);
  margin: 2rem 5rem;
  //分享窗口
  // height: calc(80% - -2rem);
  // width: calc(80% - -8rem);
  // margin: 2rem 4rem;
  //分享屏幕
  // height: calc(80% - -8rem);
  // width: calc(80% - -7rem);
  // margin: 2rem 5rem;
}
</style>
