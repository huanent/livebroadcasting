<template>
  <div
    class="main-workplace-container"
    @drop="drop"
    @dragover="$event.preventDefault()"
  >
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
        <div class="mask" v-if="!canControlBoard"></div>
        <div id="board-el" class="roll-scroll"></div>
        <div class="workplace-footer" v-show="panelType === 'board'">
          <workplace-footer />
        </div>
      </div>

      <share-screen v-if="panelType === 'screen'" />
      <camera v-if="panelType === 'camera'" />
    </div>
    <Toolbar v-if="isToolBarShow"></Toolbar>
    <div style="height: 100%" :class="{ hide: workplaceVisibity }"></div>
    <StreamSourceDialog
      :visible.sync="showStreamSelectdialog"
      @selected="onSelected"
    />
    <hand v-if="!isTeacher" />
  </div>
</template>

<script>
import Toolbar from "../toolbar/index";
import BoardTabs from "./board-tabs";
import WorkplaceFooter from "../workplace-footer";
import { liveBroadcastService } from "@/core/live-broadcast";
import { mapState, mapMutations, mapGetters } from "vuex";
import { Emitter } from "@/core/emit";
import StreamSourceDialog from "@c/common/stream-source-dialog";
import Hand from "../hand-up/hand";
import ShareScreen from "./share-screen";
import Camera from "./camera";
import { HAND_UP_STATUS } from "../../../models/handUpStatus";
export default {
  name: "MainWorkplace",
  components: {
    Toolbar,
    BoardTabs,
    WorkplaceFooter,
    StreamSourceDialog,
    Hand,
    ShareScreen,
    Camera
  },
  data() {
    return {
      showToolbar: true,
      isServiceReady: false,
      showStreamSelectdialog: false,
      lastAudioStatus: false
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
    ...mapMutations("electron", ["STREAM_SELECT_VISIBILITY"]),
    ...mapMutations("features", ["SET_SUBSCRIBE_AUDIO"]),
    onTabsClose(item, index) {
      if (item.fid) {
        this.DELETE_BOARD_FILE(item.fid);
      }
    },
    onSelected(stream) {
      this.STREAM_SELECT_VISIBILITY(false);
      Emitter.emit("selected-stream", stream);
    },
    indexChange(index) {
      this.BOARD_INDEX(index);
    },
    onChange(type) {
      this.SET_PANEL_TYPE({ type, streamId: this.token.id });
    },
    drop(e) {
      let streamId = e.dataTransfer.getData("streamId");
      this.SET_PANEL_TYPE({ type: "camera", streamId });
    }
  },
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("workplace", [
      "panelType",
      "workplaceVisibity",
      "token",
      "cameraPanelId"
    ]),
    ...mapState("electron", ["streamSelectVisibility"]),
    ...mapState("features", ["canControlBoard", "subscribeAudio"]),
    ...mapGetters("workplace", ["isTeacher"]),
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
    cameraPanelId(id) {
      if (this.isTeacher) return;
      if (id == this.token.id) {
        this.lastAudioStatus = this.subscribeAudio;
        this.SET_SUBSCRIBE_AUDIO(true);
      } else if (this.lastAudioStatus !== null) {
        this.SET_SUBSCRIBE_AUDIO(this.lastAudioStatus);
        this.this.lastAudioStatus = null;
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
    .mask {
      position: absolute;
      width: 100%;
      z-index: 3;
      height: 100%;
      cursor: default;
    }
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
