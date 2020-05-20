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
        <question-item @remove="remove(item)" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import QuestionItem from "./question-item";
import { mapState } from "vuex";

export default {
  data() {
    return {
      question: {
        title: "",
        items: [
          { detail: "是", isTrue: true },
          { detail: "否", isTrue: false }
        ]
      }
    };
  },
  methods: {
    add() {
      this.items.push({ detail: "", isTrue: false });
    },
    remove(item) {
      this.question.items = this.question.items.filter(f => f != item);
    },
    start() {
      const keys = this.items.filter(f => f.isTrue);
      this.$$emit("start");
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
</style>
