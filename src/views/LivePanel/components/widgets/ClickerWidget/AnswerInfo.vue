<template>
  <div class="answer">
    <template v-if="clicker.answer.result">
      <h1 class="commited">已交卷,请等待老师检阅！</h1>
    </template>
    <template v-else>
      <h3>{{ clicker.question.title }}</h3>
      <el-divider></el-divider>
      <a
        v-for="(item, index) in clicker.question.items"
        :key="index"
        @click="setResult(index)"
      >
        <el-alert
          :type="result.indexOf(index) > -1 ? 'success' : 'info'"
          :closable="false"
        >
          <template v-slot:title>
            {{ `${String.fromCharCode(index + 65)} : ${item.detail}` }}
          </template>
        </el-alert>
      </a>
      <div class="btn-group">
        <el-button type="primary" @click="answer">交卷</el-button>
      </div>
    </template>
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";
export default {
  name: "AnswerInfo",
  data() {
    return {
      result: []
    };
  },
  computed: {
    ...mapState("widget", ["clicker"])
  },
  methods: {
    ...mapMutations("widget", ["SET_CLICKER_ANSWER"]),
    setResult(index) {
      if (this.result.indexOf(index) > -1) {
        this.result = this.result.filter(f => f != index);
      } else {
        this.result.push(index);
      }
    },
    answer() {
      this.SET_CLICKER_ANSWER(this.result);
    }
  }
};
</script>
<style lang="scss" scoped>
.answer {
  padding: 5px;
  .el-alert {
    margin: 15px 0;
  }
  .btn-group {
    text-align: center;
  }
  .commited {
    text-align: center;
  }
}
</style>
