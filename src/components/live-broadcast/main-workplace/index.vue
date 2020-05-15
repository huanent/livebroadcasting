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
        <div class="wrapper" v-show="panelType === 'board'">
          <div id="board-el" class="roll-scroll"></div>
        </div>
        <div class="wrapper" v-show="panelType === 'screen'">
          <div ref="screen"></div>
        </div>
        <div class="wrapper" v-show="panelType === 'camera'">
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
import { mapState, mapMutations } from "vuex";
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
      "SET_WORKPLACE_VISIBILITY"
    ]),
    ...mapMutations("features", []),
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
    onSelected(stream) {
      this.STREAM_SELECT_VISIBILITY(false);
      this.EMIT_SELECTED_STREAM(stream);
    },
    indexChange(index) {
      this.BOARD_INDEX(index);
    },
    onChange(type) {
      this.SET_PANEL_TYPE(type);
    }
  },
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("localStream", []),
    ...mapState("workplace", ["panelType", "workplaceVisibity"]),
    ...mapState("electron", ["streamSelectVisibility"]),
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
      if (type !== "camera") {
        this.LOCAL_STREAM_STOP_PLAY({ el: cameraEl, isCopy: true });
      }
      if (type !== "screen") {
        this.SHARE_SCREEN_STOP_PLAY({ el: cameraEl, isCopy: true });
      }
      if (this.isServiceReady) {
        switch (type) {
          case "camera":
            this.LOCAL_STREAM_PLAY({ el: cameraEl, isCopy: true });
            break;
          case "screen":
            this.SHARE_SCREEN_PLAY({ el: screenEl, isCopy: true }, true);
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
.wrapper {
  position: relative;
  height: 100%;
  width: calc(100% - 5rem);
  margin: 0 2.5rem;

  > div {
    height: 100%;
    width: 100%;
  }
}
.hide {
  visibility: hidden;
}
</style>
