<template>
  <el-dialog :title="title" :visible.sync="viewVisible" :append-to-body="true">
    <div class="view-content">
      <div class="view-index">{{ currentIndex + 1 }}.</div>
      <div class="view-main">
        <div class="question-title" v-html="currentQuestion.title"></div>
        <ul class="question-options">
          <li
            class="option-item"
            v-for="(opt, index) in currentQuestion.options"
            :key="index"
          >
            <div class="option-index">
              <el-checkbox @change="handleAnswer($event, index)"></el-checkbox>
              <div>{{ indexToLetter(index) }}.</div>
            </div>
            <div v-html="opt"></div>
          </li>
        </ul>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-pagination
        :page-size="1"
        :pager-count="11"
        background
        layout="prev, pager, next"
        :total="questions.length"
        :hide-on-single-page="true"
        :current-page="currentIndex + 1"
        @current-change="handlePageChange"
      >
      </el-pagination>
      <el-button type="primary">提交答案</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { indexToLetter } from "../../../core/utils";

export default {
  name: "QuestionView",
  props: {
    visible: Boolean
  },
  data() {
    return {
      checkList: [],
      questions: [
        {
          options: ["<p>test</p>", "<p>test</p>"],
          title:
            "<p>Progress 组件设置percentage属性即可，表示进度条对应的百分比，必填，必须在 0-100。通过 format 属性来指定进度条文字内容。</p>",
          _id: "402b8b2e-c242-4d28-806a-46ed65f99db9"
        },
        {
          options: [
            "<p>A</p>",
            "<p>Progress 组件设置percentage属性即可，表示进度条对应的百分比，必填，必须在 0-100。通过 format 属性来指定进度条文字内容。</p>",
            "<p>C</p>",
            "<p>D</p>"
          ],
          title: '"<p class="custom-block-title">Yes</p>"',
          _id: "b8cdc4a6-3633-4d62-876e-5e9fe874b218"
        }
      ],
      currentIndex: 0
    };
  },
  methods: {
    indexToLetter(index) {
      return indexToLetter(index);
    },
    handlePageChange(pageIndex) {
      this.currentIndex = pageIndex - 1;
    },
    handleAnswer(checked, optIndex) {
      let answer = indexToLetter(optIndex);
      if (checked) {
        let answers = (this.currentQuestion.answer || "").split("");
        answers.push(answer);
        this.currentQuestion.answer = answers.sort().join("");
      } else {
        this.currentQuestion.answer = this.currentQuestion.answer.replace(
          answer,
          ""
        );
      }
      console.log(this.currentQuestion.answer);
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex];
    },
    title() {
      let title = "答题器";
      if (this.questions.length) {
        title += ` 共(${this.questions.length})题`;
      }
      return title;
    },
    viewVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  }
};
</script>

<style lang="scss">
.view-content {
  display: flex;
}
.view-index {
  padding-right: 8px;
  flex: 0 0 auto;
}
.question-title {
  font-size: 16px;
  line-height: 1.5;
  margin-top: -2px;
}
.question-options {
  padding-top: 10px;
  .option-item {
    display: flex;
    align-items: flex-start;
    padding: 5px 0;
    .option-index {
      display: flex;
      align-items: center;
      padding-right: 8px;
      .el-checkbox {
        margin-right: 5px;
      }
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
