<template>
  <div class="workplace-panel">
    <div class="workplace-header">
      <WorkplacePanelHeader :creator="classCreator"></WorkplacePanelHeader>
    </div>
    <div
      :class="{
        'workplace-panel-content': true,
        'sidebar-hide': !isSidebarShow
      }"
    >
      <div
        id="workplace-panel-left"
        ref="left"
        :class="{ 'workplace-panel-left-hide': !cameraPanelVisibity }"
      >
        <div class="camera-panel">
          <CameraPanel></CameraPanel>
        </div>
        <div
          ref="gutterEle"
          :class="{
            gutter: true,
            'gutter-row': role !== ROLE.STUDENT,
            'gutter-not-allowed': !cameraPanelVisibity
          }"
        >
          <div></div>
        </div>
        <MainWorkplace
          :isSidebarShow="isSidebarShow"
          @head-toggle="toggleCameraPanel"
          @sidebar-toggle="toggleSidebar"
        ></MainWorkplace>
      </div>
      <div class="gutter gutter-col">
        <div></div>
      </div>
      <div id="workplace-panel-right">
        <self-camera />
        <div class="gutter gutter-row">
          <div></div>
        </div>
        <div class="message-panel">
          <chatroom />
        </div>
      </div>
    </div>
    <widgets />
  </div>
</template>

<script>
import Split from "split-grid";
import classApi from "@api/class";
import WorkplacePanelHeader from "@c/live-broadcast/workplace-header";
import MainWorkplace from "@c/live-broadcast/main-workplace";
import Chatroom from "@c/live-broadcast/chatroom";
import SelfCamera from "@c/live-broadcast/self-camera";
import CameraPanel from "../../components/live-broadcast/camera-panel";
import { Emitter } from "../../core/emit";
import { mapState, mapMutations, mapActions } from "vuex";
import { ROLE } from "../../models/role";
import Widgets from "../../components/live-broadcast/widgets";
import { initFeaturesState } from "../../store/features";
import {
  initLiveBroadcastService,
  liveBroadcastService
} from "../../core/live-broadcast/live-broadcast-service";

export default {
  name: "workplace",
  data: function() {
    return {
      gridStyle: undefined,
      originPosition: [0, 0],
      total: 0,
      classCreator: "",
      audioLevelTimer: undefined,
      isSidebarShow: true
    };
  },
  computed: {
    ...mapState("account", ["role", "userInfo"]),
    ...mapState("workplace", ["cameraPanelVisibity"]),
    ...mapState("features", ["canControlBoard", "classing"])
  },

  async mounted() {
    const classId = this.$route.query.id;
    const res = await classApi.classGet(classId);
    if (res.data.success) {
      this.classCreator = res.data.model.createUser;
    } else {
      this.$message.error("没有对应的课堂信息");
    }
    const roomData = {
      createUser: this.classCreator,
      id: this.$route.query.id
    };
    await this.enterRoom(roomData);
    const role =
      this.classCreator == this.userInfo.username ? ROLE.TEACHER : ROLE.STUDENT;
    this.SET_ROLE(role);
    await initLiveBroadcastService();

    if (role == ROLE.TEACHER) {
      setTimeout(() => {
        Emitter.emit("SYS_PULL_STATE", ROLE.STUDENT);
      }, 2000);
    } else {
      setTimeout(() => {
        this.SET_TIMESTAMP(new Date().getTime());
        liveBroadcastService.timService.sendSystemMsg(
          "PULL_STATE",
          ROLE.TEACHER,
          this.userInfo.username
        );
      }, 2000);
      setInterval(() => {
        this.SET_TIMESTAMP(new Date().getTime());
      }, 10000);
    }
    this.audioLevelTimer = setInterval(() => {
      this.isTimer = true;
    }, 200);
    this.$once("hook:beforeDestroy", () => {
      clearInterval(this.audioLevelTimer);
    });
    if (this.role !== "ROLE_STUDENT") {
      Split({
        columnGutters: [],
        rowGutters: [
          {
            track: 1,
            element: this.$refs.gutterEle
          }
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
              this.SET_CAMERA_PANEL_VISIBILITY(false);
            } else {
              /* this.SET_CAMERA_PANEL__VISIBILITY(true);*/
            }
          }
          Emitter.emit("split-change");
        },
        writeStyle: (grid, gridTemplateProp, gridTemplateStyle) => {
          if (this.cameraPanelVisibity) {
            grid.style[gridTemplateProp] = gridTemplateStyle;
          }
        }
      });
    } else {
      this.SET_CAMERA_PANEL_VISIBILITY(false);
    }
  },
  methods: {
    ...mapMutations("features", ["SET_TIMESTAMP"]),
    ...mapMutations("account", ["SET_ROLE"]),
    ...mapMutations("board", ["SET_DRAW_ENABLE"]),
    ...mapMutations("workplace", ["SET_CAMERA_PANEL_VISIBILITY"]),
    ...mapActions("workplace", ["enterRoom"]),
    toggleSidebar() {
      this.isSidebarShow = !this.isSidebarShow;
    },
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
      this.SET_CAMERA_PANEL_VISIBILITY(!this.cameraPanelVisibity);
      setTimeout(() => {
        Emitter.emit("split-change");
      }, 300);
    }
  },
  watch: {
    canControlBoard(value) {
      if (
        liveBroadcastService &&
        liveBroadcastService.boardService &&
        liveBroadcastService.boardService.activeBoard
      ) {
        liveBroadcastService.boardService.activeBoard.setDrawEnable(value);
      }
    },
    classing(value) {
      if (value === false) {
        this.$notify({
          title: "下课啦",
          message: "5分钟后将会离开这个页面",
          type: "warning"
        });
        setTimeout(() => {
          this.$router.push("/");
        }, 1000 * 60 * 5);
      }
    }
  },
  components: {
    MainWorkplace,
    Chatroom,
    SelfCamera,
    WorkplacePanelHeader,
    CameraPanel,
    Widgets
  }
};
</script>

<style scoped lang="scss">
.workplace-panel {
  height: 100vh;
  overflow: hidden;
  margin: 0;
  padding: 0;
  @include themeify {
    background: themed("background_color1");
  }
}
.workplace-header {
  @include themeify {
    background: themed("background_color2");
  }
  width: 100%;
  height: 2rem;
  overflow: hidden;
  @include themeify {
    border-bottom: 1px solid themed("border_color1");
  }
  box-sizing: border-box;
  & > * {
    overflow: hidden;
  }
}
.workplace-panel-content {
  display: grid;
  width: 100%;
  grid-template-columns: auto 0 290px;
  height: 100%;
  overflow: hidden;
}
.sidebar-hide {
  grid-template-columns: auto 0;
}
#workplace-panel-left {
  display: grid;
  grid-template-rows: 23.5% 0.5% 76%;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow: hidden;
  & > * {
    overflow: hidden;
  }
}
#workplace-panel-right {
  display: grid;
  position: relative;
  grid-template-rows: 23.5% 0.5% 76%;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow: hidden;
  @include themeify {
    border-left: 1px solid themed("border_color1");
  }
  & > * {
    overflow: hidden;
  }
}

.gutter-row {
  cursor: row-resize;
  @include themeify {
    background: themed("background_color2");
  }
  > div {
    height: 1px !important;
    @include themeify {
      background-color: themed("background_color1");
    }

    margin: 0 auto;
  }
}
.gutter-col {
  div {
    width: 1px !important;
    height: 100%;
    @include themeify {
      background-color: rgba(themed("border_color1"), 0.2);
    }
    margin: 0 auto;
  }
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
.workplace-panel-left-hide {
  grid-template-rows: 0 3px 1fr !important;
}
.message-panel {
  background: #292b2e;
}
</style>
