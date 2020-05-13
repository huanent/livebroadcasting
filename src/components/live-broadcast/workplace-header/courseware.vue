<template>
  <el-dialog
    :title="$t('courseware.title')"
    :visible.sync="dialogVisible"
    :before-close="onCoursewareClose"
    :append-to-body="true"
    @close="closeDialog"
    class="courseware"
  >
    <div class="courseware-content">
      <div>
        <el-upload
          :action="'/api/courseFile/upload?userId=' + userId"
          :file-list="fileList"
          :limit="3"
          :on-preview="onFilePreview"
          :before-upload="beforeUpload"
          ref="upload"
          :on-success="onUploadSuccess"
          :before-remove="beforeRemove"
        >
          <el-button size="small" type="primary">点击上传</el-button>
        </el-upload>
      </div>
      <div v-show="showProgressDialog">
        ppt 转码中...
        <el-progress :percentage="transcodeProgress"></el-progress>
      </div>

      <div class="table-container">
        <el-table
          :data="courseFileList"
          stripe=""
          style="width: 100%"
          empty-text="No data"
          @row-dblclick="rowDblclick"
        >
          <el-table-column prop="filename" label="fileName"> </el-table-column>
          <el-table-column prop="userId" label="upper"> </el-table-column>
          <el-table-column prop="resolution" label="resolution	">
          </el-table-column>
          <el-table-column prop="pages" label="pages"> </el-table-column>
          <el-table-column prop="hasTranscode" label="hasTranscode">
          </el-table-column>
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
                @click="reTranscode(scope.row)"
              >
                <el-tooltip
                  :effect="$store.state.workplace.themeColor"
                  :content="$t('courseware.recode')"
                  placement="top"
                  ><icon name="recode" :size="16"></icon></el-tooltip
              ></el-button>
              <el-button class="btns" type="text" size="small">
                <el-tooltip
                  :effect="$store.state.workplace.themeColor"
                  :content="$t('courseware.toboard')"
                  placement="top"
                  ><icon name="fileimport" :size="16"></icon></el-tooltip
              ></el-button>
              <el-button
                @click="deleteCourseFile(scope.row)"
                class="btns"
                type="text"
                size="small"
              >
                <el-tooltip
                  :effect="$store.state.workplace.themeColor"
                  :content="$t('courseware.del')"
                  placement="top"
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
} from "../../../core/data/data-service";
export default {
  name: "Courseware",
  data() {
    return {
      dialogVisible: false,
      addFileVisible: false,
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
  props: {
    visible: Boolean
  },
  watch: {
    visible() {
      console.log("变化");
      this.dialogVisible = this.visible;
    }
  },
  mounted() {},
  created() {
    this.getCourseData(this.pageNum, this.pageSize, this.userId);
  },
  methods: {
    pageChange(index) {
      this.pageNum = index;
      this.getCourseData(this.pageNum, this.pageSize, this.userId);
    },
    liveroomLogout() {
      this.$router.push({ name: "Classlist" });
    },
    getCourseData(pageNum, pageSize, userId) {
      getCourseData(pageNum, pageSize, userId).then(res => {
        if (res.data.success) {
          this.total = res.data.model.total;
          this.courseFileList = res.data.model.list;
          console.log(this.total, this.courseFileList);
        }
      });
    },
    onCoursewareOpen() {
      //   this.visible = true;
      this.getCourseData(this.pageNum, this.pageSize, this.userId);
    },
    onCoursewareClose(done) {
      //   this.visible = false;
      this.$emit("close-dialogStatus", true);
      if (done && done instanceof Function) {
        done();
      }
    },
    onFilePreview(file) {
      window.open(
        "http://livebroadcasting.jinrui.kooboo.site" + file.response.model.url,
        "_blank"
      );
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
    async onUploadSuccess(res) {
      if (res.success && res.model.url) {
        this.reTranscode(res.model);
      }
    },
    beforeRemove(file, fileList) {
      var id = file.response.model.id;
      removeCourseFile(id).then(res => {
        if (res.data.success) {
          console.log("删除成功");
        }
      });
    },
    deleteCourseFile(scope) {
      console.log(scope._id);
      removeCourseFile(scope._id).then(res => {
        console.log("删除课件成功");
        this.getCourseData(this.pageNum, this.pageSize, this.userId);
      });
    },
    rowDblclick(file) {
      this.$store.commit("workplace/ADD_BOARD_FILE", {
        resultUrl: file.resultUrl,
        title: file.title,
        pages: file.pages,
        resolution: file.resolution
      });
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
    async onUploadSuccess(res) {
      if (res.success && res.model.url) {
        this.reTranscode(res.model);
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
            console.log(res);

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
              self.getCourseData(this.pageNum, this.pageSize, this.userId);
              self.closeProgressDialogFun();
            }
          }
        }
      }, 300);
    },
    showProgressDialogFun() {
      this.showProgressDialog = true;
    },
    async onUploadSuccess(res) {
      if (res.success && res.model.url) {
        this.reTranscode(res.model);
      }
    },
    closeProgressDialogFun() {
      this.showProgressDialog = false;
      this.transcodeProgress = 0;
    },
    async onUploadSuccess(res) {
      if (res.success && res.model.url) {
        this.reTranscode(res.model);
      }
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
</style>
