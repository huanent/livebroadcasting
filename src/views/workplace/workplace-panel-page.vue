<template>
  <div class="workplace-panel">
    <div class="workplace-panel-header">
      <WorkplacePanelHeader></WorkplacePanelHeader>
    </div>
    <div class="workplace-panel-content">
      <div
        id="workplace-panel-left"
        :class="{ 'workplace-panel-left-hide': !showCameraPanel }"
      >
        <div class="camera-panel">
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
        <div id="gutter1-1" class="gutter-row"></div>
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
import WorkplacePanelHeader from "@c/live-broadcast/workplace-panel-header";
import MainWorkplace from "@c/live-broadcast/main-workplace";
import Chatroom from "@c/live-broadcast/chatroom";
import SelfCamera from "@c/live-broadcast/self-camera";
export default {
  name: "workplace-panel-page",
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
    WorkplacePanelHeader
  },
  mounted() {
    const vm = this;
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
            list[0] = "20%";
            list[2] = "79.5%";
            document.getElementById(
              "workplace-panel-left"
            ).style.gridTemplateRows = list.join(" ");
          }
        }
      }
      this.showCameraPanel = !this.showCameraPanel;
    }
  }
};
</script>

<style scoped lang="scss">
.workplace-panel {
  display: grid;
  height: 100vh;
  grid-template-rows: 2rem auto;
}
.workplace-panel-header {
  background: #34363b;
}
.workplace-panel-content {
  display: grid;
  width: 100%;
  grid-template-columns: 79.5% 0.5% 20%;
  height: 100%;
}
#workplace-panel-left {
  background: #1a1b1d;
  display: grid;
  grid-template-rows: 20% 0.5% 79.5%;
  height: calc(100vh - 2rem);
  div {
    height: 100%;
  }
}
#workplace-panel-right {
  background: #212224;
  display: grid;
  grid-template-rows: 23.5% 0.5% 75%;
  height: calc(100vh - 2rem);
}

#gutter {
  background-color: #292929;
}
#gutter1-1 {
  background-color: #292929;
}
.gutter-row {
  cursor: row-resize;
}
.gutter-col {
  cursor: col-resize;
}
.camera-panel {
  background: #212224;
  position: relative;
}
.main-workplace-panel {
  background: #1a1b1d;
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
