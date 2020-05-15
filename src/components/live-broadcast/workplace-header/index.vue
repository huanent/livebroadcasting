<template>
  <div class="workplace-header-component">
    <div class="menu-operation">
      <span style="padding: 0 20px">
        <el-switch
          v-model="switchStatus"
          :active-color="activeColor"
          :inactive-color="inactiveColor"
        >
        </el-switch>
      </span>

      <icon
        @click.native="onCoursewareOpen"
        name="import_contacts"
        :size="20"
      ></icon>
      <icon
        name="person_outline"
        :size="20"
        @click.native="onShowFeaturesControlVisible"
      ></icon>
      <icon @click.native="onWidgetsOpen" name="widgets" :size="20"></icon>
      <icon name="settings" :size="20"></icon>
      <icon @click.native="liveroomLogout" name="exit_to_app" :size="20"></icon>
      <icon name="info_outline" :size="20"></icon>
    </div>
    <Courseware
      :visible="dialogVisible"
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
import { mapMutations } from "vuex";
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
      inactiveColor: "#76acc3"
    };
  },
  watch: {
    switchStatus(value) {
      this.handlerTheme();
    }
  },
  mounted() {
    this.handlerTheme();
  },
  methods: {
    ...mapMutations("workplace", ["SET_THEME_COLOR"]),
    close_dialog(val) {
      this.dialogVisible = false;
    },
    // pageChange(index) {
    //   this.pageNum = index;
    //   this.getCourseData(this.pageNum, this.pageSize, this.userId);
    // },
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
      console.log(this.$store.state.workplace.themeColor);
    },
    // getCourseData(pageNum, pageSize, userId) {
    //   getCourseData(pageNum, pageSize, userId).then(res => {
    //     if (res.data.success) {
    //       this.total = res.data.model.total;
    //       this.courseFileList = res.data.model.list;
    //       console.log(this.total, this.courseFileList);
    //     }
    //   });
    // },
    onCoursewareOpen() {
      this.dialogVisible = true;
      // this.getCourseData(this.pageNum, this.pageSize, this.userId);
    },
    onWidgetsOpen() {
      this.widegtsVisible = true;
    },
    onShowFeaturesControlVisible() {
      this.featuresControlVisible = true;
    },
    handleExceed(file) {
      console.log("文件超出");
    },
    // onFilePreview(file) {
    //   window.open(
    //     "http://livebroadcasting.jinrui.kooboo.site" + file.response.model.url,
    //     "_blank"
    //   );
    // },
    // async reTranscode(row) {
    //   let res1 = await transcodeCreate(row.url);
    //   if (res1.data.success && res1.data.model) {
    //     let taskId = res1.data.model;
    //     this.getDescribe(taskId, row.id);
    //   }
    // },
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
  fill: #528a99;
  padding: 2.5px 4px;
  margin: 0 auto;
}
.menu-operation svg:hover {
  fill: #48a7a8;
}

.courseware-content {
  min-height: 40vh;
}
</style>
