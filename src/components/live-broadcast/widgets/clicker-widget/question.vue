<template>
  <div class="question">
    <el-form label-width="60px">
      <el-form-item label="题目">
        <el-input
          v-model="question.title"
          type="textarea"
          placeholder="请输入题目"
          :autosize="{ minRows: 2, maxRows: 4 }"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-for="(item, index) in question.items"
        :key="index"
        :label="itemLabel(index)"
      >
        <question-item
          @remove="remove(item)"
          :item="item"
          :removable="question.items.length > 2"
        />
      </el-form-item>
    </el-form>
    <div class="btn-group">
      <el-button @click="add" :disabled="question.items.length > 8">
        新增选项
      </el-button>
      <el-button type="primary" @click="start">开始作答</el-button>
    </div>
  </div>
</template>

<script>
import QuestionItem from "./question-item";
import { mapState, mapMutations } from "vuex";

export default {
  data() {
    return {
      question: {
        title: "是正确的吗？",
        items: [
          { detail: "是", isTrue: true },
          { detail: "否", isTrue: false }
        ]
      }
    };
  },
  methods: {
    ...mapMutations("widget", ["START_CLICKER"]),
    add() {
      this.question.items.push({ detail: "", isTrue: false });
    },
    remove(item) {
      this.question.items = this.question.items.filter(f => f != item);
    },
    start() {
      this.START_CLICKER(this.question);
    },
    itemLabel(index) {
      return `${String.fromCharCode(index + 65)} :`;
    }
  },
  components: {
    QuestionItem
  }
};
</script>

<style lang="scss" scoped>
.question {
  padding: 10px;
}
.btn-group {
  text-align: center;
  margin-top: 30px;
}
</style>
