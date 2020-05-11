<template>
  <widget-window @close="visible = false" v-if="visible">
    <div class="timer">
      <div class="time">
        <controller value="15" />
        <span>:</span>
        <controller value="00" />
      </div>
      <el-button size="mini" type="primary">开始</el-button>
    </div>
  </widget-window>
</template>
<script>
import WidgetWindow from "../widget-window";
import Controller from "./controller";
export default {
  data() {
    return {
      visible: true,
      hours: 15,
      seconds: 0
    };
  },
  components: {
    WidgetWindow,
    Controller
  }
};
</script>
<style lang="scss" scoped>
.timer {
  width: 200px;
  .el-button {
    width: 100%;
    border-radius: 0;
  }
  .time {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 5px 20px;
    span {
      font-size: 30px;
    }
  }
}
</style>