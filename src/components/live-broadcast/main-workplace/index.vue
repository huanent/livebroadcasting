<template>
  <div class="main-workplace-container">
    <div style="height: 100%" :class="{ hide: !workplaceVisibity }">
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
        <div
          class="board-wrapper"
          v-show="panelType === 'board'"
          @click="boardClick"
        >
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
      <Toolbar v-if="isToolBarShow"></Toolbar>
    </div>
    <div style="height: 100%" :class="{ hide: workplaceVisibity }"></div>

    <StreamSourceDialog
      :visible.sync="showStreamSelectdialog"
      @selected="onSelected"
    />
  </div>
</template>

<script>
import Toolbar from "../toolbar/index";
import BoardTabs from "./board-tabs";
import WorkplaceFooter from "../workplace-footer";
import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
import { mapState, mapGetters, mapMutations } from "vuex";
import { Emitter } from "@/core/emit";
import StreamSourceDialog from "@c/common/stream-source-dialog";
import { ROLE } from "../../../store/account";
export default {
  name: "MainWorkplace",
  components: { Toolbar, BoardTabs, WorkplaceFooter, StreamSourceDialog },
  data() {
    return {
      showToolbar: true,
      isServiceReady: false,
      showStreamSelectdialog: false
    };
  },

  async mounted() {
    this.showStreamSelectdialog = this.streamSelectVisibility;
    this.SET_WORKPLACE_VISIBILITY(true);
    if (this.role === ROLE.STUDENT) {
      Emitter.on("board-init", () => {
        setTimeout(async () => {
          await this.SYNC_STATE();
        }, 1000);
      });
    } else {
      this.SET_WORKPLACE_VISIBILITY(true);
    }
    Emitter.on("LIVE_READY", () => {
      this.isServiceReady = true;
    });
  },
  methods: {
    ...mapMutations("workplace", [
      "SET_BOARD_PROFILES",
      "DELETE_BOARD_FILE",
      "BOARD_INDEX",
      "SET_PANEL_TYPE",
      "SEND_PANEL_TYPE",
      "SYNC_STATE",
      "SET_WORKPLACE_VISIBILITY",
      "SET_CAMERA_PANEL__VISIBILITY"
    ]),
    ...mapMutations("localStream", [
      "LOCAL_STREAM_PLAY",
      "LOCAL_STREAM_STOP_PLAY",
      "SELF_CAMERA_STATUS",
      "TEACHER_REMOTE_STREAM_PLAY",
      "TEACHER_REMOTE_STREAM_STOP_PLAY",
      "EMIT_SELECTED_STREAM"
    ]),
    ...mapMutations("shareScreenStream", [
      "SHARE_SCREEN_PLAY",
      "SHARE_SCREEN_STOP_PLAY"
    ]),
    ...mapMutations("electron", ["STREAM_SELECT_VISIBILITY"]),
    onTabsClose(item, index) {
      if (item.fid) {
        this.DELETE_BOARD_FILE(item.fid);
      }
    },
    boardClick() {
      /* this.SET_CAMERA_PANEL__VISIBILITY(false);*/
    },
    onSelected(stream) {
      this.STREAM_SELECT_VISIBILITY(false);
      this.EMIT_SELECTED_STREAM(stream);
    },
    indexChange(index) {
      this.BOARD_INDEX(index);
    },
    observerVideo(targetNode) {
      let config = {
        childList: true,
        subtree: true
      };
      let observer;
      const mutationCallback = mutationsList => {
        if (
          this.$refs.camera &&
          this.$refs.camera.children[0] &&
          this.$refs.camera.children[0].children[0] &&
          this.$refs.camera.children[0].children[0].tagName === "VIDEO"
        ) {
          this.$refs.camera.children[0].children[0].style.objectFit = "contain";
        }
        if (
          this.$refs.screen &&
          this.$refs.screen.children[0] &&
          this.$refs.screen.children[0].children[0] &&
          this.$refs.screen.children[0].children[0].tagName === "VIDEO"
        ) {
          this.$refs.screen.children[0].children[0].style.objectFit = "contain";
        }
      };
      observer = new MutationObserver(mutationCallback);
      observer.observe(targetNode, config);
    },
    onChange(type) {
      this.SET_PANEL_TYPE(type);
    }
  },
  computed: {
    ...mapState("account", ["role"]),
    ...mapGetters("localStream", []),
    ...mapGetters("workplace", ["panelType", "workplaceVisibity"]),
    ...mapGetters(["onElectronClient"]),
    ...mapGetters("electron", ["streamSelectVisibility"]),
    boardProfiles() {
      return this.$store.state.workplace.boardProfiles;
    },
    isToolBarShow() {
      return (
        this.showToolbar &&
        this.panelType === "board" &&
        this.role === "ROLE_TEACHER"
      );
    },
    index() {
      return this.$store.state.workplace.activeBoardIndex;
    }
  },
  watch: {
    streamSelectVisibility(val) {
      this.showStreamSelectdialog = val;
    },
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
      if (oldType !== "camera") {
        this.TEACHER_REMOTE_STREAM_STOP_PLAY();
      }

      if (this.role !== "ROLE_STUDENT" && this.isServiceReady) {
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
            this.TEACHER_REMOTE_STREAM_STOP_PLAY();
            setTimeout(() => {
              this.TEACHER_REMOTE_STREAM_PLAY(cameraEl);
            }, 300);
            break;
          case "screen":
            this.observerVideo(screenEl);
            await this.SHARE_SCREEN_PLAY(screenEl);
            break;
          default:
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
.hide {
  visibility: hidden;
}
</style>
