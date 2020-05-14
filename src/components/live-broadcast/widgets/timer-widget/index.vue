<template>
  <widget-window @close="SET_TIMER_VISIBLE(false)" v-if="timerWidget.visible" nameWidget="定时器">
    <div class="timer">
      <div class="time">
        <controller
          v-model="minuteTens"
          :max="5"
          :controllable="showOperation"
        />
        <controller
          v-model="minuteSingle"
          :max="9"
          :controllable="showOperation"
        />
        <span class="marks">:</span>
        <div class="line"></div>
        <controller
          v-model="secondTens"
          :max="5"
          :controllable="showOperation"
        />
        <controller
          v-model="secondSingle"
          :max="9"
          :controllable="showOperation"
        />
      </div>
      <div class="beginBtn">
        <el-button
          size="mini"
          type="primary"
          @click="START_TIMER({ seconds: seconds, started: true })"
          v-if="showOperation"
          >开始</el-button
        >
      </div>
    </div>
  </widget-window>
</template>
<script>
import WidgetWindow from "../widget-window";
import Controller from "./controller";
import { mapState, mapMutations, mapGetters } from "vuex";
import { ROLE } from "@/store/account";
export default {
  data() {
    return {
      clear: null,
      minuteTens: 1,
      minuteSingle: 5,
      secondTens: 0,
      secondSingle: 0
    };
  },
  components: {
    WidgetWindow,
    Controller
  },
  computed: {
    ...mapState("workplace", ["timerWidget"]),
    ...mapState("account", ["role"]),
    seconds() {
      return (
        this.secondSingle +
        this.secondTens * 10 +
        this.minuteSingle * 60 +
        this.minuteTens * 600
      );
    },
    showOperation() {
      return this.role == ROLE.TEACHER && !this.timerWidget.started;
    }
  },
  methods: {
    ...mapMutations("workplace", [
      "CLOSE_TIMER",
      "START_TIMER",
      "SET_TIMER_VISIBLE"
    ]),
    setTime(seconds) {
      this.minuteTens = parseInt(seconds / 600);
      seconds = seconds % 600;
      this.minuteSingle = parseInt(seconds / 60);
      seconds = seconds % 60;
      this.secondTens = parseInt(seconds / 10);
      this.secondSingle = parseInt(seconds % 10);
    }
  },
  watch: {
    "timerWidget.started"(value) {
      if (value) {
        this.clear = setInterval(() => {
          if (this.seconds < 1) {
            return this.START_TIMER({ seconds: 15 * 60, started: false });
          }

          this.setTime(this.seconds - 1);
        }, 1000);
      } else if (this.clear) {
        clearInterval(this.clear);
      }
    },
    "timerWidget.visible"() {
      this.setTime(this.timerWidget.seconds);
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
    span.marks {
      font-size: 30px;
      color: #eee;
      user-select: none;
    }
    .line {
      width: 160px;
      height: 1px;
      opacity: 0.2;
      background: #54555d;
      position: absolute;
      top: 0px;
      bottom: 0px;
      margin: auto;
    }
  }
}
</style>
