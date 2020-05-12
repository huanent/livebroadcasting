<template>
  <widget-window class="clicker">
    <question />
  </widget-window>
</template>
<script>
import WidgetWindow from "../widget-window";
import Question from "./question";
export default {
  data() {
    return {
      title: ""
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
