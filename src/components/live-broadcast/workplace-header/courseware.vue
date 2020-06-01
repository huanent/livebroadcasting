<template>
  <el-dialog
    :title="$t('courseware.title')"
    :visible.sync="dialogVisible"
    :before-close="onCoursewareClose"
    :append-to-body="true"
    :width="dialogWidth"
    @close="closeDialog"
    class="courseware"
  >
    <div class="courseware-content">
      <div v-show="role === ROLE.TEACHER">
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
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div v-show="showProgressDialog" class="progress-wrap">
        <el-progress :percentage="transcodeProgress"></el-progress>
        ppt 转码中...
      </div>

      <div class="table-container">
        <el-table
          :data="courseFileList"
          stripe=""
          style="width: 100%"
          empty-text="No data"
          @row-click="rowclick"
        >
          <el-table-column prop="filename" label="文件名"> </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200"
            prop="hasTranscode"
          >
            <template slot-scope="scope">
              <el-button
                class="btns"
                type="text"
                size="small"
                v-show="role === ROLE.TEACHER && !isVideo(scope.row.url)"
              >
                <el-tooltip :content="$t('courseware.toboard')" placement="top"
                  ><icon name="fileimport" :size="16"></icon></el-tooltip
              ></el-button>

              <el-button
                class="btns"
                type="text"
                size="small"
                v-show="role === ROLE.TEACHER && isVideo(scope.row.url)"
                @click="play(scope.row)"
              >
                <el-tooltip :content="$t('courseware.play')" placement="top"
                  ><icon name="play-circle" :size="16"></icon></el-tooltip
              ></el-button>

              <el-button
                @click="downloadCourseFile(scope.row)"
                class="btns"
                type="text"
                size="small"
              >
                <el-tooltip :content="$t('courseware.download')" placement="top"
                  ><icon name="download" :size="16"></icon></el-tooltip
              ></el-button>
              <el-button
                class="btns"
                type="text"
                size="small"
                @click="reTranscode(scope.row)"
                v-show="role === ROLE.TEACHER && !isVideo(scope.row.url)"
              >
                <el-tooltip :content="$t('courseware.recode')" placement="top"
                  ><icon name="recode" :size="16"></icon></el-tooltip
              ></el-button>
              <el-button
                @click="deleteCourseFile(scope.row)"
                class="btns"
                type="text"
                size="small"
                v-show="role === ROLE.TEACHER"
              >
                <el-tooltip :content="$t('courseware.del')" placement="top"
                  ><icon name="trash" :size="16"></icon
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
    <span slot="footer" class="dialog-footer">
      <el-button @click="onCoursewareClose">{{
        $t("button.cancel")
      }}</el-button>
      <el-button type="primary" @click="onCoursewareClose">{{
        $t("button.yes")
      }}</el-button>
    </span>
  </el-dialog>
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
import { mapState, mapMutations } from "vuex";

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
    ...mapState("account", ["role"]),
    dialogWidth() {
      if (innerWidth < 768) {
        return "80%";
      }
      return "50%";
    }
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
      if (this.role === this.ROLE.TEACHER) {
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
  }
};
</script>

<style scoped lang="scss">
.btns {
  svg {
    fill: #0a818c;
  }
}
.progress-wrap {
  margin: 10px 0 10px 5px;
}
</style>
