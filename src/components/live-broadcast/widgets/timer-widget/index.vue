<template>
  <widget-window @close="visible = false" v-if="visible">
    <div class="timer">
      <div class="time">
        <controller v-model="minuteTens" :max="5" :controllable="!started" />
        <controller v-model="minuteSingle" :max="9" :controllable="!started" />
        <span>:</span>
        <controller v-model="secondTens" :max="5" :controllable="!started" />
        <controller v-model="secondSingle" :max="9" :controllable="!started" />
      </div>
      <el-button
        size="mini"
        type="primary"
        @click="started = true"
        v-if="!started"
      >
        开始
      </el-button>
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
      minuteTens: 1,
      minuteSingle: 5,
      secondTens: 0,
      secondSingle: 0,
      started: false,
      clear: null
    };
  },
  components: {
    WidgetWindow,
    Controller
  },
  computed: {
    seconds() {
      return (
        this.secondSingle +
        this.secondTens * 10 +
        this.minuteSingle * 60 +
        this.minuteTens * 600
      );
    }
  },
  watch: {
    visible(value) {
      if (!value) {
        this.minuteTens = 1;
        this.minuteSingle = 5;
        this.secondTens = 0;
        this.secondSingle = 0;
        this.started = false;
      }
    },
    started(value) {
      if (value) {
        this.clear = setInterval(() => {
          if (this.seconds < 1) return (this.started = false);
          let current = this.seconds - 1;
          this.minuteTens = parseInt(current / 600);
          current = current % 600;
          this.minuteSingle = parseInt(current / 60);
          current = current % 60;
          this.secondTens = parseInt(current / 10);
          this.secondSingle = parseInt(current % 10);
        }, 1000);
      } else if (this.clear) {
        clearInterval(this.clear);
      }
    }
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
