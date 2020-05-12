<template>
  <widget-window @close="visible = false" v-if="visible">
    <div class="timer">
      <div class="time">
        <controller v-model="minuteTens" :max="2" :controllable="!started" />
        <controller v-model="minuteSingle" :max="4" :controllable="!started" />
        <span class="marks">:</span>
        <div class="line"></div>
        <controller v-model="secondTens" :max="5" :controllable="!started" />
        <controller v-model="secondSingle" :max="9" :controllable="!started" />
      </div>
      <div class="beginBtn">
        <el-button size="mini" type="primary" @click="started = true" v-if="!started">开始</el-button>
      </div>
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
      minuteTens: 2,
      minuteSingle: 4,
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
  background: #54555d;
  .beginBtn {
    display: flex;
    justify-content: center;
    padding-bottom: 5px;
    // padding-left: 18px;
    // width: 164px;
    // border-radius: 3px;
    .el-button {
      background: #018a8c;
      width: 160px;
      padding-bottom: 5px;
      font-size: 14px;
    }
  }
  .time {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 14px 20px;
    span.marks{
      font-size: 30px;
      color: #eee;
      user-select: none;
    }
    .line{
      width:160px;
      height: 1px;
      opacity: .2;
      background:#54555d;
      position: absolute;
      top:0px;
      bottom:0px;
      margin: auto;
    }
  }
}
</style>
