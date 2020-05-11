<template>
  <div class="workplace-panel">
    <div class="workplace-header">
      <WorkplacePanelHeader></WorkplacePanelHeader>
    </div>
    <div class="workplace-panel-content">
      <div
        id="workplace-panel-left"
        ref="left"
        :class="{ 'workplace-panel-left-hide': !cameraPanelVisibity }"
      >
        <div class="camera-panel">
          <CameraPanel></CameraPanel>
        </div>
        <div
          ref="gutter1"
          :class="{
            gutter: true,
            'gutter-row': role !== ROLE.STUDENT,
            'gutter-not-allowed': !cameraPanelVisibity
          }"
        ></div>
        <div class="main-workplace-panel">
          <div @click="toggleCameraPanel" class="camera-icon-box">
            <icon
              :name="cameraPanelVisibity ? 'indent' : 'outdent'"
              class="panel-icon"
              :size="18"
            ></icon>
          </div>
          <MainWorkplace></MainWorkplace>
        </div>
      </div>
      <div class="gutter"></div>
      <div id="workplace-panel-right">
        <self-camera />
        <div class="gutter"></div>
        <div class="message-panel">
          <chatroom />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Split from "split-grid";
// import Toolbar from "@c/common/Toolbar";
import WorkplacePanelHeader from "@c/live-broadcast/workplace-header";
import MainWorkplace from "@c/live-broadcast/main-workplace";
import Chatroom from "@c/live-broadcast/chatroom";
import SelfCamera from "@c/live-broadcast/self-camera";
import CameraPanel from "../../components/live-broadcast/camera-panel";
import { liveBroadcastService } from "../../main";
import { Emitter } from "../../core/emit";
import { mapGetters, mapMutations } from "vuex";
import { ROLE } from "../../store/account";

export default {
  name: "workplace",
  data: function() {
    return {
      gridStyle: undefined,
      originPosition: [0, 0],
      total: 0,
      audioLevelTimer: undefined
    };
  },
  components: {
    MainWorkplace,
    Chatroom,
    SelfCamera,
    WorkplacePanelHeader,
    CameraPanel,
    isTimer: false
  },
  computed: {
    ...mapGetters("account", ["role"]),
    ...mapGetters("workplace", ["cameraPanelVisibity"])
  },
  mounted() {
    this.audioLevelTimer = setInterval(() => {
      this.isTimer = true;
    }, 200);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.audioLevelTimer);
    });
    if (this.role !== ROLE.STUDENT) {
      Split({
        columnGutters: [
          // {
          //   track: 1,
          //   element: document.querySelector("#gutter")
          // }
        ],
        rowGutters: [
          {
            track: 1,
            element: this.$refs.gutter1
          }
          // {
          //   track: 1,
          //   element: document.querySelector("#gutter2-1")
          // }
        ],
        dragInterval: 10,
        onDrag: (direction, track, gridTemplateStyle) => {
          let str = gridTemplateStyle;
          if (str) {
            let list = str.trim().split(" ");
            if (
              list[0] &&
              list[2] &&
              parseFloat(list[2]) > 0 &&
              parseFloat(list[0]) / parseFloat(list[2]) < 0.001
            ) {
              this.SET_CAMERA_PANEL__VISIBILITY(false);
            } else {
              /* this.SET_CAMERA_PANEL__VISIBILITY(true);*/
            }
          }
          Emitter.emit("split-change");
        },
        writeStyle: (grid, gridTemplateProp, gridTemplateStyle) => {
          if (this.cameraPanelVisibity) {
            console.log(gridTemplateStyle);
            grid.style[gridTemplateProp] = gridTemplateStyle;
          }
        }
      });
    } else {
      this.SET_CAMERA_PANEL__VISIBILITY(false);
    }
  },
  methods: {
    ...mapMutations("workplace", ["SET_CAMERA_PANEL__VISIBILITY"]),
    toggleCameraPanel() {
      if (!this.cameraPanelVisibity) {
        let el = this.$refs.left;
        let str = el.style.gridTemplateRows;
        if (str) {
          let list = str.trim().split(" ");
          if (
            list[0] &&
            list[2] &&
            parseFloat(list[2]) > 0 &&
            parseFloat(list[0]) / parseFloat(list[2]) < 0.01
          ) {
            list[0] = "23.5%";
            list[2] = "76%";
            el.style.gridTemplateRows = list.join(" ");
          }
        }
      }
      this.SET_CAMERA_PANEL__VISIBILITY(!this.cameraPanelVisibity);
      setTimeout(() => {
        Emitter.emit("split-change");
      }, 300);
    }
  }
};
</script>

<style scoped lang="scss">
.workplace-panel {
  height: 100vh;
  margin: 0;
  padding: 0;
  @include themeify {
    background: themedOpacity("background_color1", 0.8);
  }
  /*  display: grid;
  grid-template-rows: 2rem auto;*/
}
.workplace-header {
  @include themeify {
    background: themed("background_color2");
  }
  width: 100%;
  height: 2rem;
  margin-bottom: 2px;
  overflow: hidden;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.44);
  & > * {
    overflow: hidden;
  }
}
.workplace-panel-content {
  display: grid;
  width: 100%;
  grid-template-columns: 79.9% 0.1% 20%;
  height: 100%;
  overflow: hidden;
}
#workplace-panel-left {
  display: grid;
  grid-template-rows: 23.5% 0.5% 76%;
  height: calc(100vh - 2rem);
  width: 100%;
  div {
    height: 100%;
  }
  overflow: hidden;
  & > * {
    overflow: hidden;
  }
}
#workplace-panel-right {
  display: grid;
  grid-template-rows: 23.5% 0.5% 76%;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow: hidden;
  & > * {
    overflow: hidden;
  }
}
.gutter {
  @include themeify {
    background: themedOpacity("border_color1", 1);
  }
}
.gutter-row {
  cursor: row-resize;
}
.gutter-col {
  cursor: col-resize;
}
.gutter-not-allowed {
  cursor: not-allowed;
}
.camera-panel {
  @include themeify {
    background: themed("background_color1");
  }
  position: relative;
}
.main-workplace-panel {
  position: relative;
  @include themeify {
    background: themed("background_color1");
  }
}
.workplace-panel-left-hide {
  grid-template-rows: 0 3px 1fr !important;
}
.message-panel {
  background: #292b2e;
}
.panel-icon {
  fill: #ffffff;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.59);
  transform: rotate(-90deg);
}

.camera-icon-box {
  cursor: pointer;
  height: auto !important;
  z-index: 999;
  position: absolute;
  top: calc(28px);
}
</style>
