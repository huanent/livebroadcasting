<template>
  <div>
    <widget-window nameWidget="抽奖">
      <div class="contain">sa</div>
    </widget-window>
  </div>
</template>
<script>
import WidgetWindow from "../widget-window";

export default {
  name: "App",
  components: {
    WidgetWindow
  },
};
</script>
<style  scoped>
.contain {
  width: 200px;
  height: 200px;
  background: #54555d;
  color: red;
}
</style>