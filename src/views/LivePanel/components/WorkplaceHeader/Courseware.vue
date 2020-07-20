<template>
  <CustomDialog
    :title="$t('courseware.title')"
    :secondary-title="'Courseware Library'"
    :visible.sync="dialogVisible"
    :before-close="onCoursewareClose"
    :append-to-body="true"
    @close="closeDialog"
    :size="'mini'"
    :on-confirm="onCoursewareClose"
    :on-cancel="onCoursewareClose"
    :footer-visibity="true"
    class="courseware"
  >
    <div class="courseware-content">
      <div v-show="isTeacher || canControlBoard" style="text-align: center">
        <el-upload
          :action="
            '/api/courseFile/upload?userId=' + userId + '&classId=' + classId
          "
          accept=".ppt,.pptx,.mp4,.webm"
          :limit="3"
          :on-preview="onFilePreview"
          :before-upload="beforeUpload"
          ref="upload"
          :lock-scroll="false"
          :on-success="onUploadSuccess"
          :before-remove="beforeRemove"
        >
          <el-button size="small" type="primary">
            <icon name="upload" class="icon-upload"> </icon>

            点击上传</el-button
          >
        </el-upload>
      </div>
      <div v-show="showProgressDialog" class="progress-wrap">
        <div class="progress-bar">
          <div
            class="progress-active"
            :style="{ width: transcodeProgress + '%' }"
          ></div>
        </div>
        <span>ppt 转码中...</span><span>{{ transcodeProgress }}%</span>
      </div>

      <div class="table-container">
        <el-table
          :data="courseFileList"
          style="width: 100%"
          empty-text="No data"
          @row-click="rowclick"
          :size="'mini'"
        >
          <el-table-column prop="filename" label="文件名"> </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            prop="hasTranscode"
            align="right"
          >
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                v-show="
                  (isTeacher && !isVideo(scope.row.url)) || canControlBoard
                "
              >
                <el-tooltip :content="$t('courseware.toboard')" placement="top"
                  ><icon
                    name="fileimport"
                    class="icon-operate"
                  ></icon></el-tooltip
              ></el-button>

              <el-button
                type="text"
                size="small"
                v-show="isTeacher && isVideo(scope.row.url)"
                @click.stop="play(scope.row)"
              >
                <el-tooltip :content="$t('courseware.play')" placement="top"
                  ><icon
                    name="play-circle"
                    class="icon-operate"
                  ></icon></el-tooltip
              ></el-button>

              <el-button
                @click.stop="downloadCourseFile(scope.row)"
                type="text"
                size="small"
              >
                <el-tooltip :content="$t('courseware.download')" placement="top"
                  ><icon
                    name="download"
                    class="icon-operate"
                  ></icon></el-tooltip
              ></el-button>
              <el-button
                type="text"
                size="small"
                @click.stop="reTranscode(scope.row)"
                v-show="isTeacher && !isVideo(scope.row.url)"
              >
                <el-tooltip :content="$t('courseware.recode')" placement="top"
                  ><icon name="recode" class="icon-operate"></icon></el-tooltip
              ></el-button>
              <el-button
                @click.stop="deleteCourseFile(scope.row)"
                type="text"
                size="small"
                v-show="isTeacher"
              >
                <el-tooltip :content="$t('courseware.del')" placement="top"
                  ><icon name="trash" class="icon-operate"></icon
                ></el-tooltip>
              </el-button>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          small=""
          :page-size="pageSize"
          :current-page="pageNum"
          @current-change="pageChange"
          layout="prev, pager, next"
          :hide-on-single-page="true"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </CustomDialog>
</template>

<script>
import {
  getCourseData,
  removeCourseFile,
  transcodeCreate,
  transcodeDescribe,
  setCourseFile
} from "@/core/data/data-service";

import { liveBroadcastService } from "@/core/live-broadcast";
import CustomDialog from "@/components/custom-dialog";
import { mapState, mapMutations, mapGetters } from "vuex";

export default {
  name: "Courseware",
  data() {
    return {
      dialogVisible: false,
      addFileVisible: false,
      pageSize: 6,
      pageNum: 1,
      total: 0,
      courseFileList: [],
      transcodeProgress: 0,
      showProgressDialog: false,
      userId: "",
      classId: "",
      switchStatus: false,
      activeColor: "#48a7a8",
      inactiveColor: "#76acc3"
    };
  },
  props: {
    visible: Boolean,
    creator: String
  },
  watch: {
    visible() {
      this.dialogVisible = this.visible;
    }
  },
  created() {
    this.userId = this.creator;
    this.classId = this.$route.query.id;
    this.getCourseData(this.pageNum, this.pageSize, this.classId);
  },
  computed: {
    ...mapState("features", ["canControlBoard"]),
    ...mapState("account", ["role"]),
    ...mapGetters("workplace", ["isTeacher"])
  },
  methods: {
    ...mapMutations("widget", ["SET_VIDEO_VISIBLE"]),
    play(row) {
      this.SET_VIDEO_VISIBLE({ visible: true, src: row.url });
    },
    pageChange(index) {
      this.pageNum = index;
      this.getCourseData(this.pageNum, this.pageSize, this.classId);
    },
    liveroomLogout() {
      this.$router.push({ name: "Classlist" });
    },
    getCourseData(pageNum, pageSize, classId) {
      getCourseData(pageNum, pageSize, classId).then(res => {
        if (res.data.success) {
          this.total = res.data.model.total;
          this.courseFileList = res.data.model.list;
        }
      });
    },
    downloadCourseFile(row) {
      var a = document.createElement("a");
      a.download = row.url;
      a.href = row.url;
      document.body.append(a);
      a.click();
      document.body.removeChild(a);
    },
    onCoursewareOpen() {
      //   this.visible = true;
      this.getCourseData(this.pageNum, this.pageSize, this.classId);
    },
    onCoursewareClose(done) {
      //   this.visible = false;
      this.$emit("close-dialogStatus", true);
      if (done && done instanceof Function) {
        done();
      }
    },
    onFilePreview(file) {
      window.open(file.response.model.url, "_blank");
    },
    beforeUpload(file) {
      var fileSize = file.size / 1024 / 1024;
      const isLt100M = fileSize < 100;
      const isLt0M = fileSize === 0;
      if (!isLt100M) {
        alert("文件不能超出100M");
      }
      if (isLt0M) {
        alert("不能是空文件");
      }
      return isLt100M && !isLt0M;
    },
    isVideo(url) {
      url = url.toLowerCase();
      return url.endsWith("mp4") || url.endsWith(".webm");
    },
    onUploadSuccess(res) {
      this.$refs.upload.clearFiles();
      if (res.success && res.model.url) {
        if (this.isVideo(res.model.url)) {
          this.getCourseData(this.pageNum, this.pageSize, this.classId);
        } else {
          this.reTranscode(res.model);
        }
      }
    },
    beforeRemove(file, fileList) {
      var id = file.response.model.id;
      removeCourseFile(id).then(res => {
        if (res.data.success) {
        }
      });
    },
    deleteCourseFile(scope) {
      removeCourseFile(scope._id).then(res => {
        this.getCourseData(this.pageNum, this.pageSize, this.classId);
      });
    },
    rowclick(file) {
      if (this.isTeacher || this.canControlBoard) {
        liveBroadcastService.boardService.addBoardFiles(
          file.resultUrl,
          file.title,
          file.pages,
          file.resolution
        );
      }
    },
    closeDialog() {
      this.$emit("close-dialogStatus", true);
    },
    async reTranscode(row) {
      let res1 = await transcodeCreate(row.url);
      if (res1.data.success && res1.data.model) {
        let taskId = res1.data.model;
        this.getDescribe(taskId, row.id);
      }
    },
    getDescribe(taskId, fileId) {
      let self = this;
      self.showProgressDialogFun();
      let interval = setInterval(async () => {
        let res = await transcodeDescribe(taskId);
        if (res.data.success) {
          if (res.data.model.progress) {
            self.transcodeProgress = res.data.model.progress;
          }
          if (self.transcodeProgress >= 100) {
            clearInterval(interval);
            let model = res.data.model;
            let body = {
              id: fileId,
              hasTranscode: "true",
              pages: model.pages.toString(),
              resultUrl: model.resultUrl,
              compressFileUrl: model.compressFileUrl,
              taskId: model.taskId,
              title: model.title,
              resolution: model.resolution,
              requestId: model.requestId
            };
            let res1 = await setCourseFile(body);
            if (res1) {
              self.getCourseData(this.pageNum, this.pageSize, this.classId);
              self.closeProgressDialogFun();
            }
          }
        }
      }, 300);
    },
    showProgressDialogFun() {
      this.showProgressDialog = true;
    },
    closeProgressDialogFun() {
      this.showProgressDialog = false;
      this.transcodeProgress = 0;
    }
  },
  components: {
    CustomDialog
  }
};
</script>

<style scoped lang="scss">
.svg-icon {
  width: 0.8rem !important;
  height: 0.8rem !important;
  @include themeify {
    fill: themed("primary2") !important;
  }
}

.icon-upload {
  @include themeify {
    width: 0.7rem !important;
    height: 0.7rem !important;
    fill: #fff !important;
    padding: 0 0.4rem 0 0;
    border-right: 1px #fff solid;
  }
}
.progress-wrap {
  margin: 10px 0 10px 5px;
  text-align: center;
  font-size: smaller;
}

.progress-active {
  height: 100%;
  border-radius: 0.25rem;
  @include themeify {
    background: themed("primary");
  }
}
.progress-bar {
  background: rgb(217, 236, 238);
  height: 0.5rem;
  border-radius: 0.25rem;
}
</style>
