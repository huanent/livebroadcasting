<template>
  <el-dialog
    :title="title"
    :visible.sync="viewVisible"
    :append-to-body="true"
    :close-on-click-modal="false"
  >
    <div v-if="questions.length" class="view-content">
      <div class="view-index">{{ currentIndex + 1 }}.</div>
      <div class="view-main">
        <div class="question-title" v-html="currentQuestion.title"></div>
        <ul class="question-options">
          <li
            class="option-item"
            v-for="(opt, index) in currentQuestion.options"
            :key="currentQuestion._id + index"
          >
            <el-checkbox
              class="option-index"
              @change="handleAnswer($event, index)"
              :label="indexToLetter(index) + '.'"
              :checked="
                currentQuestion.answer.indexOf(indexToLetter(index)) > -1
              "
            ></el-checkbox>
            <div v-html="opt"></div>
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      当前没有题目
    </div>
    <span slot="footer" class="dialog-footer">
      <div>
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
      </div>
      <el-button
        v-if="questions.length"
        type="primary"
        @click="handleSubmit"
        :loading="submiting"
        >提交答案</el-button
      >
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
      questions: [
        {
          options: ["<p>test</p>", "<p>test</p>"],
          title:
            "<p>Progress 组件设置percentage属性即可，表示进度条对应的百分比，必填，必须在 0-100。通过 format 属性来指定进度条文字内容。</p>",
          _id: "402b8b2e-c242-4d28-806a-46ed65f99db9",
          answer: ""
        },
        {
          options: [
            "<p>A</p>",
            "<p>Progress 组件设置percentage属性即可，表示进度条对应的百分比，必填，必须在 0-100。通过 format 属性来指定进度条文字内容。</p>",
            "<p>C</p>",
            "<p>D</p>"
          ],
          title: '"<p class="custom-block-title">Yes</p>"',
          _id: "b8cdc4a6-3633-4d62-876e-5e9fe874b218",
          answer: ""
        }
      ],
      currentIndex: 0,
      submiting: false
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
    },
    async handleSubmit() {
      this.submiting = true;
      console.log(this.questions);
      this.submiting = false;
    }
  },
  computed: {
    currentQuestion() {
      return this.questions[this.currentIndex];
    },
    title() {
      let title = "答题器";
      if (this.questions.length > 1) {
        title += ` 共${this.questions.length}题`;
        if (this.answerLength === this.questions.length) {
          title += ` 全部完成`;
        } else if (this.answerLength) {
          title += ` 完成${this.answerLength}题`;
        }
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
    },
    answerLength() {
      return this.questions.filter(item => !!item.answer).length;
    }
  }
};
</script>

<style lang="scss" scoped>
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
      /deep/ {
        .el-checkbox__label {
          padding-left: 5px;
        }
      }
    }
  }
}
.dialog-footer {
  display: flex;
  justify-content: space-between;
}
</style>
