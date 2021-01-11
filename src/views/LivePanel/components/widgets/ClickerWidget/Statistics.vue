<template>
  <div class="statics-wrapper">
    <el-table :data="list" style="width: 100%" height="250" border>
      <el-table-column prop="name" label="姓名"> </el-table-column>
      <el-table-column prop="answer" label="答案"> </el-table-column>
      <el-table-column prop="result" label="结果"> </el-table-column>
    </el-table>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "Statistics",
  computed: {
    ...mapState("widget", ["clicker"]),
    list() {
      let result = [];
      for (const i of this.clicker.statistics) {
        let answer = this.getAnswer(i.result);
        result.push({
          name: i.__nickName || i.__primaryKey,
          answer: answer,
          result: answer == this.trueAnswer ? "正确" : "错误"
        });
      }

      return result;
    },
    trueAnswer() {
      let result = [];

      for (let i = 0; i < this.clicker.question.items.length; i++) {
        if (this.clicker.question.items[i].isTrue) {
          result.push(i);
        }
      }

      return this.getAnswer(result);
    }
  },
  methods: {
    getAnswer(result) {
      if (result) {
        return result.map(m => String.fromCharCode(m + 65)).join(",");
      }
      return [];
    }
  }
};
</script>
<style lang="scss" scoped>
.statics-wrapper {
  padding: 0 24px;
  .el-table /deep/{
    color: #1a1b29;
    thead th .cell{
      color: #1a1b29;
    }
  }
}
</style>