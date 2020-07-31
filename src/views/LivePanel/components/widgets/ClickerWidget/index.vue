<template>
  <widget-window
    class="clicker"
    @close="SET_CLICKER_VISIBLE(false)"
    v-if="visible"
    nameWidget="随堂测试"
    :position="position"
    :notdrag="true"
    :class="{ 'mobile-scale': isMobile }"
  >
    <question-list
      v-if="isTeacher && !this.clicker.question.items.length > 0"
    />
    <answer-info v-if="!isTeacher && this.clicker.question.items.length > 0" />
    <statistics v-if="isTeacher && this.clicker.question.items.length > 0" />
  </widget-window>
</template>
<script>
import WidgetWindow from "../WidgetWindow";
import QuestionList from "./QuestionList";
import AnswerInfo from "./AnswerInfo";
import Statistics from "./Statistics";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "ClickerWidget",
  data() {
    return {
      position: {
        x: 50 - 20000 / document.body.clientWidth,
        y: 20
      }
    };
  },
  computed: {
    ...mapState("widget", ["clicker"]),
    ...mapState("device", ["isMobile"]),
    ...mapGetters("workplace", ["isTeacher"]),
    visible() {
      if (this.isTeacher) {
        return this.clicker.visible;
      } else {
        return this.clicker.question.items.length > 0;
      }
    }
  },
  methods: {
    ...mapMutations("widget", ["SET_CLICKER_VISIBLE", "SET_CLICKER_ANSWER"])
  },
  components: {
    WidgetWindow,
    QuestionList,
    AnswerInfo,
    Statistics
  },
  watch: {
    visible() {
      this.SET_CLICKER_ANSWER(null);
    }
  }
};
</script>
<style lang="scss" scoped>
.clicker {
  width: 400px;
}
</style>
