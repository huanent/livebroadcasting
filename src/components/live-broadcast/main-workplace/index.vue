<template>
  <div class="main-workplace-container">
    <BoardTabs
      :datas="boardProfiles"
      @on-close="onTabsClose"
      :active-index.sync="index"
      @index-change="indexChange($event)"
      @type-change="onChange"
      :panel-type="panelType"
      class="workplace-content"
      :show-lable="panelType === 'board'"
    >
      <div class="board-wrapper" v-show="panelType === 'board'">
        <div id="board-el" class="roll-scroll"></div>
      </div>
      <div class="board-wrapper" v-show="panelType === 'screen'">
        <div ref="screen" style="height: 100%;width: 100%;"></div>
      </div>
      <div class="board-wrapper" v-show="panelType === 'camera'">
        <div ref="camera" id="workplace-camera"></div>
      </div>
    </BoardTabs>
    <div class="workplace-footer">
      <workplace-footer v-show="panelType === 'board'" />
    </div>
    <Toolbar v-if="showToolbar && panelType === 'board'"></Toolbar>
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
      showToolbar: false,
      lastPanelType: undefined
    };
  },
  methods: {
    ...mapMutations("workplace", [
      "SET_BOARD_PROFILES",
      "DELETE_BOARD_FILE",
      "BOARD_INDEX",
      "SET_PANEL_TYPE",
      "SEND_PANEL_TYPE"
    ]),
    ...mapMutations("localStream", [
      "LOCAL_STREAM_PLAY",
      "LOCAL_STREAM_STOP_PLAY",
      "SELF_CAMERA_STATUS",
      "TEACHER_REMOTE_STREAM_PLAY",
      "TEACHER_REMOTE_STREAM_STOP_PLAY"
    ]),
    ...mapMutations("shareScreenStream", [
      "SHARE_SCREEN_PLAY",
      "SHARE_SCREEN_STOP_PLAY"
    ]),
    onTabsClose(item, index) {
      if (item.fid) {
        this.DELETE_BOARD_FILE(item.fid);
      }
    },
    indexChange(index) {
      this.BOARD_INDEX(index);
    },
    observerVideo(targetNode) {
      let config = {
        childList: true,
        subtree: true
        // attributes: true,
        // attributeFilter: ["style"]
      };
      let observer;
      const mutationCallback = mutationsList => {
        console.log("监听dom");
        if (this.$refs.camera.children[0].children[0].tagName === "VIDEO") {
          this.$refs.camera.children[0].children[0].style.objectFit = "contain";
        }
      };
      observer = new MutationObserver(mutationCallback);
      observer.observe(targetNode, config);
    },
    onChange(type) {
      this.SET_PANEL_TYPE(type);
    }
  },
  async mounted() {
    await liveBroadcastService.init();
    this.showToolbar = true;
  },
  computed: {
    ...mapGetters("localStream", []),
    ...mapGetters("workplace", ["panelType"]),
    ...mapGetters("account", ["role"]),
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

      liveBroadcastService.boardService.switchFile(fileInfo.fid);
    },
    panelType: async function(type, oldType) {
      let cameraEl = this.$refs.camera;
      let screenEl = this.$refs.screen;
      if (oldType === "screen") {
        this.SHARE_SCREEN_STOP_PLAY();
      }

      if (this.role !== "student") {
        switch (type) {
          case "camera":
            this.observerVideo(cameraEl);
            this.LOCAL_STREAM_STOP_PLAY();
            setTimeout(() => {
              this.LOCAL_STREAM_PLAY(cameraEl);
              this.SEND_PANEL_TYPE();
            }, 300);
            break;
          case "screen":
            this.observerVideo(screenEl);
            this.SHARE_SCREEN_PLAY(screenEl);
            this.SEND_PANEL_TYPE();
            break;
          default:
            this.SEND_PANEL_TYPE();
        }
      } else {
        switch (type) {
          case "camera":
            this.observerVideo(cameraEl);
            this.LOCAL_STREAM_STOP_PLAY();
            setTimeout(() => {
              this.LOCAL_STREAM_PLAY(cameraEl);
              this.SEND_PANEL_TYPE();
            }, 300);
            break;
          case "screen":
            this.observerVideo(screenEl);
            await this.SHARE_SCREEN_PLAY(screenEl);
            this.SEND_PANEL_TYPE();
            break;
          default:
            this.SEND_PANEL_TYPE();
        }
      }
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
  @include themeify {
    background: themed("background_color3");
  }
  border-top: rgba(30, 33, 37, 0.19) 1px solid;
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
  height: calc(100% - 4rem);
  width: calc(100% - 10rem);
  margin: 2rem 5rem;
  > div {
    height: 100%;
    width: 100%;
  }
}
</style>
