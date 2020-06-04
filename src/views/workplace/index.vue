<template>
  <div class="workplace-panel" v-if="visibity">
    <div class="workplace-header">
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
        <div class="camera-panel">
          <CameraPanel></CameraPanel>
        </div>
        <MainWorkplace></MainWorkplace>
      </div>
      <div id="workplace-panel-right">
        <self-camera />
        <div class="message-panel">
          <chatroom />
        </div>
      </div>
    </div>
    <widgets />
    <hand-up-list v-if="isTeacher" />
  </div>
</template>

<script>
import classApi from "@api/class";
import WorkplacePanelHeader from "@c/live-broadcast/workplace-header";
import MainWorkplace from "@c/live-broadcast/main-workplace";
import Chatroom from "@c/live-broadcast/chatroom";
import SelfCamera from "@c/live-broadcast/self-camera";
import CameraPanel from "../../components/live-broadcast/camera-panel";
import { destroyEmitter, Emitter, initEmitter } from "../../core/emit";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { ROLE } from "@/models/role";
import Widgets from "../../components/live-broadcast/widgets";
import { app } from "../../main";
import {
  initLiveBroadcastService,
  liveBroadcastService
} from "../../core/live-broadcast";
import HandUpList from "../../components/live-broadcast/hand-up/hand-up-list";
import { autoSyncState, destroySyncState } from "../../core/state-sync";
import { requestDeviceAccess, delay } from "../../core/utils";

export default {
  name: "workplace",
  data: function() {
    return {
      timer: null,
      gridStyle: undefined,
      originPosition: [0, 0],
      total: 0,
      classCreator: "",
      classStatus: 0,
      isSidebarShow: true,
      visibity: false,
      watchInstance: undefined,
      offlineUserClearer: null
    };
  },
  computed: {
    ...mapState("account", ["userInfo"]),
    ...mapState("workplace", ["cameraPanelVisibity", "roomInfo"]),
    ...mapState("features", ["canControlBoard", "classing"]),
    ...mapGetters("workplace", ["isTeacher"])
  },
  async mounted() {
    await this.getRoomInfo(this.$route.query.id);

    initEmitter();
    autoSyncState(app);

    this.offlineUserClearer = setInterval(() => {
      this.CLEAR_OFFLINE_USER();
    }, 10000);

    if (this.roomInfo) {
      this.classCreator = this.roomInfo.createUser;
      this.classStatus = Number(this.roomInfo.status);
      document.title = this.roomInfo.title;
    } else {
      this.$message.error(this.$t("class.hasNoClassInfo"));
      return;
    }

    const enterResult = await this.enterRoom();
    if (!enterResult.data.success) {
      this.$message.error(this.$t("class.liveFinishedTips"));
      return;
    }
    this.visibity = true;

    await initLiveBroadcastService();

    if (this.isTeacher) {
      Emitter.emit("SYS_PULL_STATE", ROLE.STUDENT);
    } else {
      liveBroadcastService.timService.sendSystemMsg(
        "PULL_STATE",
        ROLE.TEACHER,
        this.userInfo.username
      );

      let timer = _ => {
        this.SET_TIMESTAMP(new Date().getTime());
        return timer;
      };

      setInterval(timer(), 10000);
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
    clearInterval(this.offlineUserClearer);
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
    }
  },
  components: {
    MainWorkplace,
    Chatroom,
    SelfCamera,
    WorkplacePanelHeader,
    CameraPanel,
    Widgets,
    HandUpList
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
.camera-panel {
  @include themeify {
    background: themed("background_color1");
  }
  position: relative;
}
.cameraPanel-hide {
  grid-template-rows: 0 100% !important;
}
.message-panel {
  background: #292b2e;
}
</style>
