<template>
  <el-dialog title="答题器" :visible.sync="questionVisible" :append-to-body="true">
    <div class="question-content">
      <div>
        <el-button @click="handleAdd" size="medium">添加新题目</el-button>
      </div>
      <div class="table-container">
        <el-table
          :data="pagedModel.list"
          stripe
          style="width: 100%"
          empty-text="No data"
          @selection-change="handleSelectionChange"
        >
          <el-table-column type="selection" width="55"></el-table-column>
          <el-table-column prop="summary" label="title"></el-table-column>
          <el-table-column prop="updateAt" label="updateAt" width="160"></el-table-column>
          <el-table-column fixed="right" label="操作" width="150">
            <template slot-scope="scope">
              <el-button size="mini" @click="handleEdit(scope.row)">查看</el-button>
              <el-button size="mini" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
      <el-button @click="handleClose">关 闭</el-button>
      <el-button type="primary" @click="handleSend" :disabled="!canSend">发 送</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { mapActions, mapGetters } from "vuex";
export default {
  name: "Question",
  props: {
    visible: Boolean
  },
  data() {
    return {
      pageSize: 2,
      pageNum: 1,
      selects: []
    };
  },
  mounted() {
    this.refreshList();
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
    handleEdit() {},
    handleAdd() {},
    async handleDelete({ _id }) {
      const result = await this.remove(_id);
      if (result.data.success) {
        this.refreshList();
      }
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
    canSend() {
      return this.selects.length > 0;
    }
  }
};
</script>