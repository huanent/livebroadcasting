<template>
  <div class="widgets">
    <el-dialog
      title="应用中心"
      :visible.sync="widgetVisible"
      :append-to-body="true"
    >
      <ul class="widgets-content">
        <li>
          <a @click="onOpenQuestion">题库</a>
        </li>
        <li>
          <a @click="onOpenQuestionView">答题器</a>
        </li>
        <li>
          <a
            @click="
              SET_TIMER_VISIBLE(true);
              widgetVisible = false;
            "
            >定时器</a
          >
        </li>
      </ul>
    </el-dialog>
    <question :visible.sync="questionVisible"></question>
    <question-view :visible.sync="questionViewVisible"></question-view>
  </div>
</template>

<script>
import Question from "../question";
import QuestionView from "../question/view";
import { mapMutations } from "vuex";
export default {
  name: "Widgets",
  props: {
    visible: Boolean
  },
  data() {
    return {
      questionVisible: false,
      questionViewVisible: false
    };
  },
  methods: {
    ...mapMutations("widget", ["SET_TIMER_VISIBLE"]),
    onOpenQuestion() {
      this.questionVisible = true;
      this.closeWidgets();
    },
    onOpenQuestionView() {
      this.questionViewVisible = true;
      this.closeWidgets();
    },
    closeWidgets() {
      this.$emit("update:visible", false);
    }
  },
  computed: {
    widgetVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit("update:visible", val);
      }
    }
  },
  components: {
    Question,
    QuestionView
  }
};
</script>
<style scoped lang="scss">
.widgets-content {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  li {
    flex: 20% 0 0;
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
    a {
      width: 80px;
      height: 80px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: green;
      color: #fff;
      border-radius: 50%;
      cursor: pointer;
    }
  }
}
</style>
