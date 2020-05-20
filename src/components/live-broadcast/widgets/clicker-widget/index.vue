<template>
  <widget-window
    class="clicker"
    @close="visible = false"
    v-if="visible"
    nameWidget="随堂测试"
  >
    <question />
  </widget-window>
</template>
<script>
import WidgetWindow from "../widget-window";
import Question from "./question";
export default {
  data() {
    return {
      title: "",
      visible: true
    };
  },
  components: {
    WidgetWindow,
    Question
  }
};
</script>
<style lang="scss" scoped>
.clicker {
  width: 400px;
}
</style>
