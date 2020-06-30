<template>
  <div class="workplace-header-component">
    <div class="menu-operation">
      <div class="icon-group">
        <span class="header-label">显示/隐藏：</span>
        <el-tooltip :content="$t('workplace.messagePanel')" placement="bottom">
          <span class="icon-wrapper">
            <icon @click.native="$emit('sidebar-toggle')" name="comments" />
          </span>
        </el-tooltip>
        <el-tooltip :content="$t('workplace.cameraPanel')" placement="bottom">
          <span class="icon-wrapper">
            <icon @click.native="$emit('head-toggle')" name="monitor"></icon>
          </span>
        </el-tooltip>
      </div>
      <div class="icon-group">
        <span class="header-label">切换主题：</span>
        <el-tooltip :content="'切换主题'" placement="bottom" :open-delay="200">
          <span style="padding: 0 16px 0 9px">
            <el-switch v-model="switchStatus"></el-switch>
          </span>
        </el-tooltip>
      </div>

      <div class="icon-group">
        <class-timer />
        <el-button
          v-if="isTeacher"
          @click="classFinish"
          class="class-btn"
          size="mini"
          type="primary"
          >下课</el-button
        >
      </div>

      <recoder v-if="showRecoderButton"></recoder>
      <el-tooltip :content="'课件库'" placement="bottom" :open-delay="200">
        <span class="icon-wrapper">
          <icon @click.native="onCoursewareOpen" name="import_contacts"></icon>
        </span>
      </el-tooltip>

      <el-tooltip
        v-if="isTeacher"
        :content="'应用中心'"
        placement="bottom"
        :open-delay="200"
      >
        <span class="icon-wrapper">
          <icon @click.native="onWidgetsOpen" name="widgets"></icon>
        </span>
      </el-tooltip>
      <el-tooltip :content="'个人设置'" placement="bottom" :open-delay="200">
        <span class="icon-wrapper">
          <icon name="settings" @click.native="showSettings = true"></icon>
        </span>
      </el-tooltip>
      <div class="icon-group exit" @click="liveroomLogout">
        <el-tooltip :content="'退出'" placement="bottom" :open-delay="200">
          <span class="icon-wrapper">
            <icon name="sign-out-alt"></icon>
          </span>
        </el-tooltip>
        <span class="header-label">退出</span>
      </div>
      <!--   <icon name="info_outline" :size="20"></icon>-->
    </div>
    <Courseware
      :visible="dialogVisible"
      :creator="creator"
      :before-close="onCoursewareClose"
      :append-to-body="true"
      @close-dialogStatus="close_dialog"
    />
    <FeaturesControl :visible.sync="featuresControlVisible"></FeaturesControl>
    <widgets :visible.sync="widegtsVisible"></widgets>
    <device-settings :visibility.sync="showSettings" />
  </div>
</template>

<script>
import { liveBroadcastService } from "@/core/live-broadcast";
import { mapActions, mapMutations, mapState, mapGetters } from "vuex";
import classApi from "@api/class";
import Widgets from "./Widgets";
import Recoder from "./Recorder";
import Courseware from "./Courseware";
import FeaturesControl from "./FeaturesControl";
import { Emitter } from "@/core/emit";
import { ROLE } from "@/models/role";
import DeviceSettings from "./DeviceSettings";
import ClassTimer from "./ClassTimer";
export default {
  name: "WorkplaceHeader",
  data() {
    return {
      dialogVisible: false,
      addFileVisible: false,
      widegtsVisible: false,
      featuresControlVisible: false,
      fileList: [],
      pageSize: 6,
      pageNum: 1,
      total: 0,
      courseFileList: [],
      transcodeProgress: 0,
      showProgressDialog: false,
      userId: "jongwong",
      switchStatus: false,
      activeColor: "#48a7a8",
      inactiveColor: "#76acc3",
      showRecoderButton: false,
      showSettings: true
    };
  },
  props: {
    creator: String,
    status: Number
  },
  computed: {
    ...mapGetters("workplace", ["isTeacher"])
  },
  watch: {
    switchStatus(value) {
      this.handlerTheme();
    }
  },
  mounted() {
    this.handlerTheme();
    Emitter.on("LIVE_READY", () => {
      setTimeout(() => {
        this.showRecoderButton = true;
      }, 5000);
    });
  },
  methods: {
    ...mapActions("features", ["manualControlFeatures"]),
    ...mapMutations("workplace", ["SET_THEME_COLOR"]),
    close_dialog(val) {
      this.dialogVisible = false;
    },
    classFinish() {
      this.$confirm(this.$t("class.quitReminder"), this.$t("text.tips"), {
        distinguishCancelAndClose: true,
        confirmButtonText: this.$t("button.yes"),
        cancelButtonText: this.$t("button.cancel"),
        type: "warning"
      })
        .then(() => {
          this.manualControlFeatures({
            id: ROLE.STUDENT,
            propName: "classing",
            value: false
          });

          classApi.classFinish(this.$route.query.id).then(res => {
            if (res.data.success) {
              this.$notify.success({
                title: this.$t("class.liveFinishedTips"),
                message: this.$t("class.redirectToClassList"),
                onClose: () => {
                  this.$router.push({ name: "Classlist" });
                }
              });
            } else {
              this.$message.error(this.$t("text.errorOccurred"));
            }
          });
        })
        .catch(action => {
          console.log(action);
        });
    },
    async hanlderStatus() {
      if (this.status === 1) {
        this.classFinish();
      }
    },
    liveroomLogout() {
      this.$router.push({ name: "Classlist" });
    },
    handlerTheme() {
      if (this.switchStatus) {
        this.SET_THEME_COLOR("light");
        document.body.setAttribute(
          "data-theme",
          this.$store.state.workplace.themeColor
        );
      } else {
        this.SET_THEME_COLOR("dark");
        document.body.setAttribute(
          "data-theme",
          this.$store.state.workplace.themeColor
        );
      }
    },
    onCoursewareOpen() {
      this.dialogVisible = true;
    },
    onWidgetsOpen() {
      this.widegtsVisible = true;
    },
    onShowFeaturesControlVisible() {
      this.featuresControlVisible = true;
    },
    onCoursewareClose(done) {
      this.dialogVisible = false;
      if (done && done instanceof Function) {
        done();
      }
    }
  },
  components: {
    Widgets,
    Recoder,
    Courseware,
    FeaturesControl,
    ClassTimer,
    DeviceSettings
  }
};
</script>

<style scoped lang="scss">
.workplace-header-component {
  height: 100%;
  width: 100%;
  position: relative;
}
.menu-operation {
  padding: 0 2rem;
  float: right;
  height: 100%;
  display: flex;
  align-items: center;
}

.menu-operation svg:hover {
  @include themeify {
    fill: themed("font_color1");
  }
}

.courseware-content {
  min-height: 40vh;
}

.menu-operation {
  /deep/ .el-switch__core {
    border-color: #636363;
    background-color: #7f7f7f;
  }
  /*/deep/.el-switch__core:after {
    background-color: #7f7f7f;
  }
  /deep/.el-switch.is-checked .el-switch__core:after {
    background-color: #ffffff;
  }*/
  /deep/ .el-switch.is-checked .el-switch__core {
    border-color: #acacac;
    background-color: #b2b2b2;
  }
}

.class-btn {
  padding: 2px 4px;
  height: 16px;
  margin: 0 10px;
  @include themeify {
    background-color: themed("primary2");
    border-color: themed("primary2");
  }
}

.svg-icon {
  @include themeify {
    fill: themed("font_color2");
  }
  height: 15px !important;
  width: 15px !important;
}
.header-label {
  padding: 0 2px;
  margin: 0 auto;
  @include themeify {
    color: themed("font_color2");
  }
}
.icon-wrapper {
  display: inline-block;
  cursor: pointer;
  padding: 0 5px;
  margin: 0 auto;
}
.icon-group {
  height: 100%;
  padding: 2px 7px;
  display: flex;
  align-items: center;
}
</style>
