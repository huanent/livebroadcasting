<template>
  <div class="workplace-panel mobile" v-if="ready">
    <div
      :class="['workplace-panel-content', { 'm-sideber-hide': hideSidebar }]"
    >
      <div class="camera-panel-wrapper">
        <CameraPanel></CameraPanel>
      </div>
      <div class="main-workplace-wrapper">
        <MainWorkplace></MainWorkplace>
      </div>
    </div>
    <widgets />
    <live-control />
    <chat-room v-show="showChat" />
    <setting-panel v-show="showSetting" />
    <BoardToolbar v-show="showBoardTool" />
    <HroizontalTipCover />
  </div>
</template>

<script>
import MainWorkplace from "@c/live-broadcast/main-workplace";
import ChatRoom from "../../components/live-broadcast/mobile/chat-room";
import CameraPanel from "../../components/live-broadcast/mobile/camera-panel";
import SettingPanel from "../../components/live-broadcast/mobile/setting-panel";
import BoardToolbar from "../../components/live-broadcast/mobile/board-toolbar";
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
import Hand from "../../components/live-broadcast/hand-up/hand";
import { autoSyncState, destroySyncState } from "../../core/state-sync";
import { requestDeviceAccess, delay } from "../../core/utils";
import LiveControl from "../../components/live-broadcast/mobile/live-control";
import HroizontalTipCover from "../../components/live-broadcast/mobile/horizontal-tip-cover";
export default {
  name: "workplace",
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
    ...mapState("workplace", ["cameraPanelVisibity", "roomInfo"]),
    ...mapState("features", ["canControlBoard", "classing"]),
    ...mapState("mobile", [
      "showChat",
      "showSetting",
      "showBoardTool",
      "hideSidebar"
    ]),
    ...mapGetters("workplace", ["isTeacher"])
  },
  async mounted() {
    initEmitter();

    //初始化默认皮肤
    document.body.setAttribute(
      "data-theme",
      this.$store.state.workplace.themeColor
    );
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
    CameraPanel,
    Widgets,
    LiveControl,
    ChatRoom,
    SettingPanel,
    BoardToolbar,
    HroizontalTipCover
  }
};
</script>

<style scoped lang="scss">
.workplace-panel {
  overflow: hidden;
  margin: 0;
  padding: 0;
  height: 100%;
  @include themeify {
    background: themed("background_color1");
  }
}
.workplace-panel-content {
  display: grid;
  grid-template-columns: 15% 85%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 2;
}
.m-sideber-hide {
  grid-template-columns: 0 100%;
}
.camera-panel-wrapper {
  height: 100%;
  position: relative;
  padding: 0 0 0 0;
  @include themeify {
    background: rgba(themed("background_color3"), 1);
  }
}
.main-workplace-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
.workplace-overlay {
  position: absolute;
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  z-index: 0;
}
</style>
<style>
.mobile-scale {
  transform-origin: left top;
  transform: scale(0.6);
}
</style>
