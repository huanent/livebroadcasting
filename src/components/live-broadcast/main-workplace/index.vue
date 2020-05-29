<template>
  <div class="main-workplace-container">
    <div :class="{ hide: !workplaceVisibity }">
      <BoardTabs
        @on-close="onTabsClose"
        :active-index.sync="index"
        @index-change="indexChange($event)"
        @type-change="onChange"
        @head-toggle="$emit('head-toggle')"
        @sidebar-toggle="$emit('sidebar-toggle')"
        :panel-type="panelType"
        class="workplace-content"
        :show-lable="panelType === 'board'"
      >
      </BoardTabs>
    </div>

    <div class="wrapper" style="height: calc(100% - 2rem)">
      <div v-show="panelType === 'board'">
        <div id="board-el" class="roll-scroll"></div>
        <div class="workplace-footer" v-show="panelType === 'board'">
          <workplace-footer />
        </div>
      </div>

      <div v-show="panelType === 'screen'">
        <div ref="screen"></div>
      </div>
      <div v-show="panelType === 'camera'">
        <div ref="camera" id="workplace-camera"></div>
      </div>
    </div>
    <Toolbar v-if="isToolBarShow"></Toolbar>
    <div style="height: 100%" :class="{ hide: workplaceVisibity }"></div>

    <StreamSourceDialog
      :visible.sync="showStreamSelectdialog"
      @selected="onSelected"
    />
    <hand v-if="role == ROLE.STUDENT" />
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
import { ROLE } from "../../../models/role";
import Hand from "../hand-up/hand";
export default {
  name: "MainWorkplace",
  components: {
    Toolbar,
    BoardTabs,
    WorkplaceFooter,
    StreamSourceDialog,
    Hand
  },
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
    ...mapState("features", ["canControlBoard"]),
    boardProfiles() {
      return this.$store.state.workplace.boardProfiles;
    },
    isToolBarShow() {
      return (
        this.showToolbar && this.panelType === "board" && this.canControlBoard
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
  @include themeify {
    background: mix(themed("background_color4"), themed("color_like"), 90%);
  }
}

#board-el {
  position: absolute;
  z-index: 1;
  width: 100%;
  height: calc(100% - 2rem);
  overflow: hidden;
}
.wrapper {
  height: 100%;
  width: 100%;
  > div {
    width: 100%;
    height: 100%;
    position: relative;
    div {
      height: 100%;
      width: 100%;
    }
  }
}
.workplace-footer {
  height: 2rem !important;
  color: #737882;
  position: absolute;
  bottom: 0;
  @include themeify {
    background: themed("background_color3");
  }
  border-top: 1px solid rgba(30, 33, 37, 0.19);
}
</style>
