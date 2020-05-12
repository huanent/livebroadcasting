<template>
  <div>
    <el-input type="textarea" :rows="2" placeholder="题目" v-model="title" />
    <div>
      <question-item
        v-for="(item, index) in items"
        :key="index"
        :label="labels[index]"
        :detail.sync="item.detail"
        :is-true.sync="item.isTrue"
        :erasable="items.length > 2"
        @remove="remove(item)"
      />
    </div>
    <el-button type="info" round size="mini" @click="add">+</el-button>
    <el-button class="start-btn" type="primary" size="mini">开始答题</el-button>
  </div>
</template>

<script>
import QuestionItem from "./question-item";

export default {
  data() {
    return {
      labels: ["A", "B", "C", "D", "E", "F", "G", "H"],
      title: "4是质数吗？",
      items: [
        { detail: "是", isTrue: true },
        { detail: "否", isTrue: false }
      ]
    };
  },
  methods: {
    add() {
      this.items.push({ detail: "", isTrue: false });
    },
    remove(item) {
      this.items = this.items.filter(f => f != item);
    }
  },
  components: {
    QuestionItem
  }
};
</script>

<style lang="scss" scoped>
.start-btn {
  width: 100%;
  border-radius: 0;
  margin: 0;
}
</style>
