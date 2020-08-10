<template>
  <div class="main-workplace" @drop="drop" @dragover="$event.preventDefault()">
    <BoardTabs
      :class="{ hide: !workplaceVisibity }"
      @on-close="onTabsClose"
      :active-index.sync="index"
      @index-change="indexChange($event)"
      @type-change="onChange"
      :panel-type="panelType"
      class="main-workplace-header"
      :show-lable="panelType === 'board'"
    >
    </BoardTabs>

    <div class="wrapper">
      <div v-show="panelType === 'board'">
        <div class="mask" v-if="!canControlBoard"></div>
        <div id="board-el" class="roll-scroll"></div>
        <div class="board-footer-wrapper" v-show="panelType === 'board'">
          <BoardFooter />
        </div>
      </div>

      <share-screen v-if="panelType === 'screen'" />
      <camera v-if="panelType === 'camera'" />
    </div>
    <StreamSourceDialog
      :visible.sync="showStreamSelectdialog"
      @selected="onSelected"
    />
  </div>
</template>

<script>
import BoardTabs from "./BoardTabs";
import BoardFooter from "../BoardFooter";
import { liveBroadcastService } from "@/core/live-broadcast";
import { mapState, mapMutations, mapGetters } from "vuex";
import { Emitter } from "@/core/emit";
import StreamSourceDialog from "@c/StreamSourceDialog";
import ShareScreen from "./ShareScreen";
import Camera from "./Camera";
import { HAND_UP_STATUS } from "@/models/handUpStatus";
import board from "@/store/board";
export default {
  name: "MainWorkplace",
  components: {
    BoardTabs,
    BoardFooter,
    StreamSourceDialog,
    ShareScreen,
    Camera
  },
  data() {
    return {
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
      if (type == "screen") this.showStreamSelectdialog = true;
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
    index() {
      return this.$store.state.workplace.activeBoardIndex;
    }
  },
  watch: {
    showStreamSelectdialog(val) {
      this.STREAM_SELECT_VISIBILITY(val);
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
        this.lastAudioStatus = null;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.main-workplace {
  height: 100%;
  width: 100%;
  position: relative;
  @include themeify {
    background: mix(themed("background_color3"), themed("color_like"), 85%);
  }
  /*  @include themeify {
    background: mix(themed("background_color4"), themed("color_like"), 90%);
  }*/
}
.main-workplace-header {
  height: 2rem;
}
.wrapper {
  height: calc(100% - 2rem);
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
    #board-el {
      position: absolute;
      z-index: 1;
      width: 100%;
      overflow: hidden;
      height: calc(100% - 2rem);
    }
  }
}
.board-footer-wrapper {
  width: 100%;
  height: 2rem;
  color: #737882;
  position: absolute;
  bottom: 0;
  @include themeify {
    background: themed("background_color2");
  }
  border-top: 1px solid rgba(30, 33, 37, 0.19);
}
</style>
<style lang="scss">
.mobile .main-workplace-header {
  height: 1.2rem;
}
.mobile #board-el {
  height: calc(100% - 1rem);
}
.mobile .wrapper {
  height: calc(100% - 0.6rem);
}
.mobile .board-footer-wrapper {
  font-size: smaller;
}
</style>
