<template>
  <div class="workplace-header-component">
    <div class="menu-operation">
      <el-tooltip :content="'切换主题'" placement="bottom" :open-delay="200">
        <span style="padding: 0 20px">
          <el-switch v-model="switchStatus"> </el-switch>
        </span>
      </el-tooltip>
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
import { liveBroadcastService } from "@/core/live-broadcast/live-broadcast-service";
import { mapActions, mapMutations, mapState } from "vuex";
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
    creator: String
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
    ...mapMutations("workplace", ["SET_THEME_COLOR", "QUIT_SERVICE"]),
    close_dialog(val) {
      this.dialogVisible = false;
    },
    classFinish() {
      this.manualControlFeatures({
        id: ROLE.STUDENT,
        propName: "classing",
        value: false
      });
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
    handleExceed(file) {},
    onCoursewareClose(done) {
      this.dialogVisible = false;
      if (done && done instanceof Function) {
        done();
      }
    }
  },
  beforeDestroy() {
    this.QUIT_SERVICE();
  },
  components: {
    Widgets,
    Recoder,
    Courseware,
    FeaturesControl
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
</style>
