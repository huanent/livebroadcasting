<template>
  <widget-window
    class="clicker"
    @close="SET_CLICKER_VISIBLE(false)"
    v-if="visible"
    nameWidget="随堂测试"
    :position="position"
    :notdrag="true"
  >
    <question v-if="role == ROLE.TEACHER && !this.clicker.question" />
    <answer v-if="role != ROLE.TEACHER && this.clicker.question" />
    <statistics v-if="role == ROLE.TEACHER && this.clicker.question" />
  </widget-window>
</template>
<script>
import WidgetWindow from "../widget-window";
import Question from "./question";
import Answer from "./answer";
import Statistics from "./statistics";
import { mapState, mapMutations } from "vuex";
import { ROLE } from "../../../../models/role";
export default {
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
    ...mapState("account", ["role"]),
    visible() {
      if (this.role == ROLE.TEACHER) {
        return this.clicker.visible;
      } else {
        return this.clicker.question;
      }
    }
  },
  methods: {
    ...mapMutations("widget", ["SET_CLICKER_VISIBLE", "SET_CLICKER_ANSWER"])
  },
  components: {
    WidgetWindow,
    Question,
    Answer,
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
