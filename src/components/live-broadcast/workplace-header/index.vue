<template>
  <div class="workplace-header-component">
    <div class="menu-operation">
      <a @click="onCoursewareOpen"
        ><icon name="import_contacts" class="pannel-icon" :size="20"></icon
      ></a>
      <a><icon name="person_outline" class="pannel-icon" :size="20"></icon></a>
      <a><icon name="widgets" class="pannel-icon" :size="20"></icon></a>
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
            :before-remove="beforeRemove"
          >
            <el-button size="small" type="primary">点击上传</el-button>
          </el-upload>
        </div>
        <div class="table-container">
          <el-table
            :data="courseFileList"
            stripe=""
            style="width: 100%"
            empty-text="No data"
          >
            <el-table-column prop="filename" label="fileName">
            </el-table-column>
            <!-- <el-table-column k-attributes="label Label.createdTime">
						<template slot-scope="scope">
							<span>{{ scope.row.created_at | toTime }}</span>
						</template>
					</el-table-column> -->
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
  </div>
</template>

<script>
import { liveBroadcastService } from "../../../main";

import {
  getCourseData,
  removeCourseFile
} from "../../../core/data/data-service";
export default {
  name: "WorkplaceHeader",
  data() {
    return {
      dialogVisible: false,
      addFileVisible: false,
      fileList: [],
      pageSize: 6,
      pageNum: 1,
      total: 0,
      courseFileList: [],
      userId: "jongwong-test"
    };
  },
  methods: {
    pageChange(index) {
      this.pageNum = index;
      this.getCourseData(this.pageNum, this.pageSize, this.userId);
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
    handleExceed(file) {
      console.log("文件超出");
    },
    onFilePreview(file) {
      window.open(
        "http://livebroadcasting.jinrui.kooboo.site" + file.response.model.url,
        "_blank"
      );
    },
    requestUpload() {},
    onCoursewareClose(done) {
      this.dialogVisible = false;
      if (done && done instanceof Function) {
        done();
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
    async handleChange(file, fileList) {
      let rawFile = file.raw;
      await liveBroadcastService.addBoardFiles(rawFile);
    },
    addBoardFilesHandler() {
      this.addFileVisible = true;
    }
  }
};
</script>

<style scoped lang="scss">
.workplace-header-component {
  height: 100%;
  width: 100%;
  color: #eee;
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
