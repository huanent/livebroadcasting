<template>
  <el-dialog
    title="课堂文件"
    custom-class="files-modal"
    :visible.sync="visible"
    :append-to-body="true"
    width="65%"
  >
    <el-table :data="filesData" style="width: 100%" empty-text="No data">
      <el-table-column prop="filename" label="文件名"> </el-table-column>
      <el-table-column
        fixed="right"
        label="操作"
        width="200"
        prop="hasTranscode"
      >
        <template slot-scope="scope">
          <el-button
            @click="download(scope.row)"
            class="btns"
            type="text"
            size="small"
          >
            <icon name="download" color="#0a818c" :size="16"></icon>
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :page-size="pageSize"
      :current-page="pageNum"
      @current-change="pageChange"
      layout="prev, pager, next"
      :hide-on-single-page="true"
      :total="total"
    >
    </el-pagination>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import { getCourseData } from "@/core/data/data-service";

export default {
  name: "FilesModal",
  data: () => ({
    total: 0,
    pageSize: 5,
    pageNum: 1,
    classId: "",
    visible: false,
    filesData: []
  }),
  computed: {
    ...mapState("mobile", ["showFiles"])
  },
  created() {
    this.classId = this.$route.query.id;
    this.getData(this.pageNum, this.pageSize, this.classId);
  },
  methods: {
    pageChange(index) {
      this.pageNum = index;
      this.getData(this.pageNum, this.pageSize, this.classId);
    },
    show() {
      this.visible = true;
    },
    hide() {
      this.visible = false;
    },
    download(row) {
      var a = document.createElement("a");
      a.download = row.url;
      a.href = row.url;
      document.body.append(a);
      a.click();
      document.body.removeChild(a);
    },
    getData(pageNum, pageSize, classId) {
      getCourseData(pageNum, pageSize, classId).then(res => {
        if (res.data.success) {
          this.total = res.data.model.total;
          this.filesData = res.data.model.list;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.files-modal .el-dialog__header {
  padding: 0.6rem 1rem;
}
.files-modal .el-dialog__body {
  padding: 0.6rem 1rem 1rem;
}
.files-modal .el-dialog__headerbtn {
  top: 0.8rem;
}

.files-modal .el-table th,
.files-modal .el-table td {
  padding: 0.2rem 0;
}
</style>
