<template>
  <div>
    <el-dialog
      title="答题器"
      :visible.sync="questionVisible"
      :append-to-body="true"
    >
      <div class="question-content">
        <div>
          <el-button @click="handleEdit" size="medium">添加新题目</el-button>
        </div>
        <div class="table-container">
          <el-table
            :data="pagedModel.list"
            stripe
            style="width: 100%"
            empty-text="No data"
            @selection-change="handleSelectionChange"
            ref="questionTable"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="summary" label="title"></el-table-column>
            <el-table-column
              prop="createAt"
              label="createAt"
              width="160"
            ></el-table-column>
            <el-table-column fixed="right" label="操作" width="150">
              <template slot-scope="scope">
                <el-button size="mini" @click="handleEdit(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <el-pagination
            small
            :page-size="pageSize"
            :current-page="pageNum"
            @current-change="handlePageChange"
            layout="prev, pager, next"
            :hide-on-single-page="true"
            :total="pagedModel.total"
          ></el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="handleReset">重 置</el-button>
        <el-badge :value="selectsLength" :hidden="!canSend">
          <el-button type="primary" @click="handleSend" :disabled="!canSend"
            >发 送</el-button
          >
        </el-badge>
      </span>
    </el-dialog>
    <question-edit
      :visible.sync="editVisible"
      :current-edit="currentEdit"
      @afterSave="refreshList"
    ></question-edit>
  </div>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
import QuestionEdit from "./edit";

export default {
  name: "Question",
  props: {
    visible: Boolean
  },
  data() {
    return {
      pageSize: 5,
      pageNum: 1,
      selects: [],
      editVisible: false,
      currentEdit: {
        key: ""
      }
    };
  },
  methods: {
    ...mapActions("examination", ["getList", "remove"]),
    refreshList() {
      this.getList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
    },
    async handlePageChange(index) {
      this.pageNum = index;
      this.refreshList();
    },
    handleSelectionChange(val) {
      this.selects = val;
    },
    handleSend() {
      console.log(this.selects);
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleReset() {
      this.$refs.questionTable.clearSelection();
    },
    handleEdit(item) {
      if (item._id) {
        this.currentEdit = item;
      } else {
        this.currentEdit = {};
      }
      this.currentEdit.key = Date.now();
      this.editVisible = true;
    },
    handleDelete({ _id }) {
      this.$confirm("此操作将永久删除该问题, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).then(async () => {
        const result = await this.remove(_id);
        if (result.data.success) {
          this.refreshList();
        }
      });
    }
  },
  computed: {
    ...mapGetters("examination", ["pagedModel"]),
    questionVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    },
    selectsLength() {
      return this.selects.length;
    },
    canSend() {
      return this.selectsLength > 0;
    }
  },
  watch: {
    questionVisible: {
      handler(val) {
        val && this.refreshList();
      },
      immediate: true
    }
  },
  components: {
    QuestionEdit
  }
};
</script>
<style lang="scss" scoped>
.dialog-footer {
  /deep/ .el-badge {
    margin: -5px 5px 0 15px;
  }
}
</style>
