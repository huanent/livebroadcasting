<template>
  <div class="workplace-panel">
    <div class="workplace-header">
      <WorkplacePanelHeader></WorkplacePanelHeader>
    </div>
    <div class="workplace-panel-content">
      <div
        id="workplace-panel-left"
        :class="{ 'workplace-panel-left-hide': !showCameraPanel }"
      >
        <div class="camera-panel">
          <CameraPanel></CameraPanel>
          <div @click="toggleCameraPanel" class="camera-icon-box">
            <icon
              name="indent"
              v-if="showCameraPanel"
              class="panel-icon"
              :size="18"
            ></icon>
            <icon name="outdent" v-else class="panel-icon" :size="18"></icon>
          </div>
        </div>
        <div id="gutter1-1" :class="{ 'gutter-row': role !== 'student' }"></div>
        <div class="main-workplace-panel">
          <MainWorkplace></MainWorkplace>
        </div>
      </div>
      <div id="gutter"></div>
      <div id="workplace-panel-right">
        <self-camera />
        <div id="gutter2-1"></div>
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
import { mapGetters } from "vuex";

export default {
  name: "workplace",
  data: function() {
    return {
      gridStyle: undefined,
      showCameraPanel: true,
      originPosition: [0, 0],
      total: 0
    };
  },
  components: {
    MainWorkplace,
    Chatroom,
    SelfCamera,
    WorkplacePanelHeader,
    CameraPanel
  },
  computed: {
    ...mapGetters("account", ["role"])
  },
  mounted() {
    const vm = this;
    if (this.role !== "student") {
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
            element: document.querySelector("#gutter1-1")
          }
          // {
          //   track: 1,
          //   element: document.querySelector("#gutter2-1")
          // }
        ],
        onDrag: (direction, track, gridTemplateStyle) => {
          Emitter.emit("split-change");
        },
        onDragEnd: () => {
          let str = document.getElementById("workplace-panel-left").style
            .gridTemplateRows;
          if (str) {
            let list = str.trim().split(" ");
            if (
              list[0] &&
              list[2] &&
              parseFloat(list[2]) > 0 &&
              parseFloat(list[0]) / parseFloat(list[2]) < 0.01
            ) {
              vm.showCameraPanel = false;
            } else {
              vm.showCameraPanel = true;
            }
          }
        }
      });
    } else {
      this.showCameraPanel = false;
    }
  },
  methods: {
    toggleCameraPanel() {
      if (!this.showCameraPanel) {
        let str = document.getElementById("workplace-panel-left").style
          .gridTemplateRows;
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
            document.getElementById(
              "workplace-panel-left"
            ).style.gridTemplateRows = list.join(" ");
          }
        }
      }
      this.showCameraPanel = !this.showCameraPanel;
      setTimeout(function() {
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

#gutter {
  @include themeify {
    background: themedOpacity("border_color1", 1);
  }
}
#gutter1-1 {
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
.camera-panel {
  @include themeify {
    background: themed("background_color1");
  }
  position: relative;
}
.main-workplace-panel {
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
  fill: #8a8a8a;
  padding: 5px;
  background-color: rgba(0, 0, 0, 0.59);
  transform: rotate(-90deg);
}

.camera-icon-box {
  cursor: pointer;
  height: auto !important;
  z-index: 1000;
  position: absolute;
  bottom: calc(-2rem - 28px);
}
</style>
