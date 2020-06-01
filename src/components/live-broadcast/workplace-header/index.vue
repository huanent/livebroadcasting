<template>
  <div class="workplace-header-component">
    <div class="menu-operation">
      <timer />
      <el-tooltip :content="'切换主题'" placement="bottom" :open-delay="200">
        <span style="padding: 0 20px">
          <el-switch v-model="switchStatus"> </el-switch>
        </span>
      </el-tooltip>

      <el-button
        v-if="role === ROLE.TEACHER"
        @click="classFinish"
        class="class-btn"
        size="mini"
        type="primary"
        >下课</el-button
      >

      <recoder v-if="showRecoderButton"></recoder>
      <el-tooltip :content="'课件库'" placement="bottom" :open-delay="200">
        <icon
          @click.native="onCoursewareOpen"
          name="import_contacts"
          :size="20"
        ></icon>
      </el-tooltip>

      <el-tooltip
        v-if="role === ROLE.TEACHER"
        :content="'应用中心'"
        placement="bottom"
        :open-delay="200"
      >
        <icon @click.native="onWidgetsOpen" name="widgets" :size="20"></icon>
      </el-tooltip>
      <!--      <el-tooltip
        v-if="role === ROLE.TEACHER"
        :content="'控制面板'"
        placement="bottom"
        :open-delay="200"
      >
        <icon
          name="settings"
          :size="20"
          @click.native="onShowFeaturesControlVisible"
        ></icon>
      </el-tooltip>-->
      <!--    <el-tooltip :content="'个人设置'" placement="bottom" :open-delay="200">
        <icon name="settings" :size="20"></icon>
      </el-tooltip>-->
      <el-tooltip :content="'退出'" placement="bottom" :open-delay="200">
        <icon
          @click.native="liveroomLogout"
          name="exit_to_app"
          :size="20"
        ></icon>
      </el-tooltip>
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
  </div>
</template>

<script>
import { liveBroadcastService } from "@/core/live-broadcast";
import { mapActions, mapMutations, mapState } from "vuex";
import classApi from "@api/class";
// import {
//   getCourseData,
//   removeCourseFile,
//   transcodeCreate,
//   transcodeDescribe,
//   setCourseFile
// } from "../../../core/data/data-service";

import Widgets from "./widgets";
import Recoder from "./recorder.vue";
import Courseware from "./courseware";
import FeaturesControl from "./features-control";
import { Emitter } from "../../../core/emit";
import { ROLE } from "../../../models/role";
import Timer from "./timer";
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
      showRecoderButton: false
    };
  },
  props: {
    creator: String,
    status: Number
  },
  computed: {
    ...mapState("account", ["role"])
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
    Timer
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
.menu-operation > svg {
  display: inline-block;
  line-height: 2rem;
  cursor: pointer;

  @include themeify {
    fill: themed("font_color2");
  }
  padding: 2.5px 4px;
  margin: 0 auto;
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
  margin: 0 10px;
}
</style>
