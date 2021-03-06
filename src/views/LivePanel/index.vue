<template>
  <div class="workplace-panel" v-if="ready">
    <div class="workplace-header-wrapper">
      <WorkplacePanelHeader
        :creator="classCreator"
        :status="classStatus"
        @head-toggle="toggleCameraPanel"
        @sidebar-toggle="toggleSidebar"
      ></WorkplacePanelHeader>
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
        :class="{ 'cameraPanel-hide': !cameraPanelVisibity }"
      >
        <div class="camera-panel-wrapper">
          <student-camera />
        </div>
        <div class="main-workplace-wrapper">
          <MainWorkplace></MainWorkplace>
          <Toolbar v-if="isToolBarShow"></Toolbar>
          <hand v-if="!isTeacher" />
        </div>
      </div>
      <div id="workplace-panel-right">
        <teacher-camera />
        <div class="message-panel-wrapper">
          <chatroom />
        </div>
      </div>
    </div>
    <widgets />
    <hand-up-list v-if="isTeacher" />
  </div>
</template>

<script>
import WorkplacePanelHeader from "./components/WorkplaceHeader";
import MainWorkplace from "./components/MainWorkplace";
import Chatroom from "./components/Chatroom";
import TeacherCamera from "./components/camera/TeacherCamera";
import StudentCamera from "./components/camera/StudentCamera";
import { destroyEmitter, Emitter, initEmitter } from "@/core/emit";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { ROLE } from "@/models/role";
import Widgets from "./components/widgets";
import { app } from "@/main";
import {
  initLiveBroadcastService,
  liveBroadcastService
} from "@/core/live-broadcast";
import HandUpList from "./components/handUp/HandUpList";
import { autoSyncState, destroySyncState } from "@/core/state-sync";
import { requestDeviceAccess, delay } from "@/core/utils";
import Hand from "./components/handUp/Hand";
import Toolbar from "./components/Toolbar";
export default {
  name: "LivePanel",
  data: function() {
    return {
      ready: false,
      timer: null,
      gridStyle: undefined,
      originPosition: [0, 0],
      total: 0,
      classCreator: "",
      classStatus: 0,
      isSidebarShow: true,
      offlineUserClearer: null,
      active: true
    };
  },
  computed: {
    ...mapState("account", ["userInfo"]),
    ...mapState("workplace", [
      "cameraPanelVisibity",
      "roomInfo",
      "panelType",
      "cameraPanelId",
      "token",
      "isToolBarShow"
    ]),
    ...mapState("features", ["canControlBoard", "classing", "canControlBoard"]),
    ...mapGetters("workplace", ["isTeacher"]),
    isToolBarShow() {
      return this.panelType === "board" && this.canControlBoard;
    }
  },
  async mounted() {
    initEmitter();
    await this.getRoomInfo(this.$route.query.id);
    const enterResult = await this.enterRoom();

    if (!enterResult.data.success) {
      this.$message.error(this.$t("class.liveFinishedTips"));
      return;
    }

    this.ready = true;

    this.clearOfflineUser();

    if (this.roomInfo) {
      this.classCreator = this.roomInfo.createUser;
      this.classStatus = Number(this.roomInfo.status);
    } else {
      this.$message.error(this.$t("class.hasNoClassInfo"));
      return;
    }

    await initLiveBroadcastService();
    autoSyncState(app);

    if (this.isTeacher) {
      Emitter.emit("SYS_PULL_STATE", ROLE.STUDENT);
      liveBroadcastService.timService.sendSystemMsg(
        "PULL_FEATURES",
        ROLE.STUDENT,
        ROLE.TEACHER
      );
    } else {
      liveBroadcastService.timService.sendSystemMsg(
        "PULL_STATE",
        ROLE.TEACHER,
        this.userInfo.username
      );

      this.setTimesamp();
    }

    Emitter.on("tim_kicked_out", type => {
      let tips = "";
      switch (type) {
        case "MULT_ACCOUNT":
          tips = this.$t("class.kickedOut.MULT_ACCOUNT");
          break;
        case "MULT_DEVICE":
          tips = this.$t("class.kickedOut.MULT_DEVICE");
          break;
        case "USERSIG_EXPIRED":
          tips = this.$t("class.kickedOut.USERSIG_EXPIRED");
      }
      this.$notify({
        title: this.$t("text.tips"),
        message: tips,
        type: "error",
        onClose: () => {
          this.$router.push({ name: "Classlist" });
        }
      });
    });
  },
  async beforeRouteLeave(to, from, next) {
    this.active = false;
    destroySyncState();
    this.destroyRoom();
    destroyEmitter();
    next();
  },
  methods: {
    ...mapMutations("features", ["SET_TIMESTAMP"]),
    ...mapMutations("workplace", [
      "SET_CAMERA_PANEL_VISIBILITY",
      "CLEAR_OFFLINE_USER"
    ]),
    ...mapActions("workplace", ["enterRoom", "destroyRoom", "getRoomInfo"]),
    ...mapActions("board", ["boardResize"]),
    toggleSidebar() {
      this.isSidebarShow = !this.isSidebarShow;
    },
    toggleCameraPanel() {
      this.SET_CAMERA_PANEL_VISIBILITY(!this.cameraPanelVisibity);
      this.$nextTick(_ => this.boardResize());
    },
    async clearOfflineUser() {
      while (this.active) {
        this.CLEAR_OFFLINE_USER();
        await delay(10000);
      }
    },
    async setTimesamp() {
      while (this.active) {
        this.SET_TIMESTAMP(new Date().getTime());
        await delay(10000);
      }
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
        this.$notify.success({
          title: "下课啦",
          message: "即将返回课堂列表"
        });

        this.timer = setTimeout(() => {
          this.$router.push({ name: "Home" });
        }, 1000 * 3);

        this.$once("hook:beforeDestroy", () => {
          clearTimeout(this.timer);
          this.timer = null;
        });
      }
    },
    roomInfo(value) {
      if (!value) return;
      document.title = value.title;
    }
  },
  components: {
    MainWorkplace,
    Chatroom,
    TeacherCamera,
    WorkplacePanelHeader,
    StudentCamera,
    Widgets,
    HandUpList,
    Hand,
    Toolbar
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
.workplace-header-wrapper {
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
  grid-template-columns: auto 20%;
  height: 100%;
  overflow: hidden;
}
.sidebar-hide {
  grid-template-columns: auto 0;
}
#workplace-panel-left {
  display: grid;
  grid-template-rows: 24% 76%;
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
  grid-template-rows: 24% 76%;
  height: calc(100vh - 2rem);
  width: 100%;
  overflow: hidden;
  @include themeify {
    border-left: 1px solid themed("border_color1");
    background: themed("background_color3");
  }
  & > * {
    overflow: hidden;
    height: auto;
  }
}
.main-workplace-wrapper {
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;
}
.camera-panel-wrapper {
  @include themeify {
    background: themed("background_color1");
  }
  position: relative;
}
.cameraPanel-hide {
  grid-template-rows: 0 100% !important;
}
.message-panel-wrapper {
  background: #292b2e;
}
</style>
