<template>
  <div>
    <el-dialog
      title="题库"
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
            @select="handleSelect"
            @select-all="handleSelectAll"
            ref="questionTable"
            v-loading="loading"
          >
            <el-table-column type="selection" width="55"></el-table-column>
            <el-table-column prop="summary" label="title"></el-table-column>
             <!-- <el-table-column prop="answer" label="answer"></el-table-column> -->
            <el-table-column
              prop="createAt"
              label="createAt"
              width="160"
            ></el-table-column>
            <el-table-column label="操作" width="150">
              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.row)"
                  :disabled="isSelected(scope.row._id)"
                  >编辑</el-button
                >
                <el-button
                  size="mini"
                  type="danger"
                  :disabled="isSelected(scope.row._id)"
                  @click="handleDelete(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <div>
          <el-pagination
            background
            small
            :page-size="pageSize"
            :current-page="pageNum"
            @current-change="handlePageChange"
            layout="prev, pager, next"
            :hide-on-single-page="true"
            :total="pagedModel.total"
          ></el-pagination>
        </div>
        <div>
          <el-button @click="handleReset" :disabled="!canSend">重 选</el-button>
          <el-badge :value="selectsLength" :hidden="!canSend">
            <el-button
              type="primary"
              @click="handleSend"
              :disabled="!canSend"
              :loading="sending"
              >发 送</el-button
            >
          </el-badge>
        </div>
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
const mapRowToSelect = row => {
  return {
    _id: row._id,
    title: row.title,
    options: row.options,
    correctAnswer: row.answer
  };
};
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
      },
      loading: true,
      sending: false
    };
  },
  methods: {
    ...mapActions("examination", ["getList", "remove", "sendExamination"]),
    isSelected(_id) {
      return this.selects.some(item => item._id == _id);
    },
    async refreshList() {
      this.loading = true;
      await this.getList({
        pageNum: this.pageNum,
        pageSize: this.pageSize
      });
      // prev selected
      if (this.pagedModel.list && this.selects.length) {
        this.pagedModel.list.forEach(row => {
          if (this.isSelected(row._id)) {
            this.$refs.questionTable.selection.push(row);
          }
        });
      }
      this.loading = false;
    },
    handlePageChange(index) {
      this.pageNum = index;
      this.refreshList();
    },
    handleSelect(selection, row) {
      if (this.isSelected(row._id)) {
        this.selects = this.selects.filter(x => x._id !== row._id);
      } else {
        this.selects.push(mapRowToSelect(row));
      }
    },
    handleSelectAll(selection) {
      this.pagedModel.list.forEach(row => {
        if (selection.length) {
          // checked this page
          if (!this.isSelected(row._id)) {
            this.selects.push(mapRowToSelect(row));
          }
        } else {
          // unchecked this page
          this.selects = this.selects.filter(x => x._id !== row._id);
        }
      });
    },
    async handleSend() {
      console.log(this.selects);
      this.sending = true;
      await this.sendExamination(this.selects);
      this.handleReset();
      this.sending = false;
    },
    handleClose() {
      this.$emit("update:visible", false);
    },
    handleReset() {
      this.selects = [];
      this.$refs.questionTable.clearSelection();
    },
    handleEdit(item) {
      let key = Date.now();
      if (item._id) {
        this.currentEdit = {
          ...item,
          key
        };
      } else {
        this.currentEdit = { key: key };
      }
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
/deep/ {
  .el-table_1_column_2 {
    > .cell {
      white-space: nowrap;
    }
  }
  .el-pagination {
    margin-top: 10px;
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
