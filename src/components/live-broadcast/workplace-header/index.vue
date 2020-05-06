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

      <a @click="onRecord" v-if="onElectronClient"
        ><icon
          :name="recorder ? 'video-slash' : 'video'"
          class="pannel-icon"
          :size="20"
        ></icon
      ></a>

      <a @click="onCoursewareOpen"
        ><icon name="import_contacts" class="pannel-icon" :size="20"></icon
      ></a>
      <a><icon name="person_outline" class="pannel-icon" :size="20"></icon></a>
      <a @click="onWidgetsOpen"><icon name="widgets" class="pannel-icon" :size="20"></icon></a>
      <a><icon name="settings" class="pannel-icon" :size="20"></icon></a>
      <a><icon name="exit_to_app" class="pannel-icon" :size="20"></icon></a>
      <a><icon name="info_outline" class="pannel-icon" :size="20"></icon></a>
    </div>
    <el-dialog
      title="课件库"
      :visible.sync="dialogVisible"
      :before-close="onCoursewareClose"
      :append-to-body="true"
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
            <el-table-column prop="filename" label="fileName">
            </el-table-column>
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
                  type="text"
                  size="small"
                  @click="reTranscode(scope.row)"
                  >重新转码</el-button
                >
                <el-button type="text" size="small">删除</el-button>
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
        <el-button @click="onCoursewareClose">取 消</el-button>
        <el-button type="primary" @click="onCoursewareClose">确 定</el-button>
      </span>
    </el-dialog>
    <widgets :visible.sync="widegtsVisible"></widgets>
  </div>
</template>

<script>
import { liveBroadcastService } from "../../../main";
import { mapState } from "vuex";

import {
  getCourseData,
  removeCourseFile,
  transcodeCreate,
  transcodeDescribe,
  setCourseFile
} from "../../../core/data/data-service";

import Widgets from "../widgets";

export default {
  name: "WorkplaceHeader",
  data() {
    return {
      dialogVisible: false,
      addFileVisible: false,
      widegtsVisible: true,
      fileList: [],
      pageSize: 6,
      pageNum: 1,
      total: 0,
      courseFileList: [],
      transcodeProgress: 0,
      showProgressDialog: false,
      userId: "jongwong",
      switchStatus: false,
      activeColor: "#7e7e7e",
      inactiveColor: "#bbc3cf",
      recorder: null
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
  computed: {
    ...mapState(["onElectronClient"])
  },
  methods: {
    pageChange(index) {
      this.pageNum = index;
      this.getCourseData(this.pageNum, this.pageSize, this.userId);
    },
    handlerTheme() {
      if (this.switchStatus) {
        document.body.setAttribute("data-theme", "light");
      } else {
        document.body.setAttribute("data-theme", "dark");
      }
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
      this.dialogVisible = true;
      this.getCourseData(this.pageNum, this.pageSize, this.userId);
    },
    onWidgetsOpen() {
      this.widegtsVisible = true;
    },
    handleExceed(file) {
      console.log("文件超出");
    },
    onFilePreview(file) {
      window.open(
        "http://livebroadcasting.jinrui.kooboo.site" + file.response.model.url,
        "_blank"
      );
    },
    async reTranscode(row) {
      let res1 = await transcodeCreate(row.url);
      if (res1.data.success && res1.data.model) {
        let taskId = res1.data.model;
        this.getDescribe(taskId);
      }
    },
    onCoursewareClose(done) {
      this.dialogVisible = false;
      if (done && done instanceof Function) {
        done();
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
      /*    this.dialogVisible = false;*/
      this.showProgressDialog = true;
    },
    closeProgressDialogFun() {
      /*    this.dialogVisible = true;*/
      this.showProgressDialog = false;
      this.transcodeProgress = 0;
    },
    beforeRemove(file, fileList) {
      var id = file.response.model.id;
      removeCourseFile(id).then(res => {
        if (res.data.success) {
          console.log("删除成功");
        }
      });
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
    rowDblclick(file) {
      this.$store.commit("workplace/ADD_BOARD_FILE", {
        resultUrl: file.resultUrl,
        title: file.title,
        pages: file.pages,
        resolution: file.resolution
      });
    },
    async onRecord() {
      if (this.recorder) {
        this.recorder.stop();
        this.recorder = null;
      } else {
        const stream = await rtcService.getStream("screen:0:0");
        this.recorder = await rtcService.record(
          stream,
          new Date().getTime() + ".webm"
        );
      }
    }
  },
  components: {
    Widgets
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
  display: inline-block;
  padding: 0 2rem;
  float: right;
  height: 100%;
}
.menu-operation > a {
  height: auto;
  display: inline-block;
  line-height: 2rem;
  cursor: pointer;
}
.menu-operation > a:hover > svg {
  fill: #dcebeb;
}
.pannel-icon {
  fill: #8a8a8a;
  padding: 2.5px 4px;
  margin: 0 auto;
}

.courseware-content {
  min-height: 40vh;
}
</style>
