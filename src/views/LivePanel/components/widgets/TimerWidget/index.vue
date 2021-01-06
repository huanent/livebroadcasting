<template>
  <widget-window
    @close="SET_TIMER_VISIBLE(false)"
    nameWidget="计时器"
    v-if="timer.visible"
    :position="timer.position"
    @moved="UPDATE_POSITION({ name: 'timer', position: $event })"
    :class="{ 'mobile-scale': isMobile }"
  >
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
import WidgetWindow from "../WidgetWindow";
import Controller from "./Controller";
import { mapState, mapMutations, mapGetters } from "vuex";
export default {
  name: "TimerWidget",
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
    ...mapState("widget", ["timer"]),
    ...mapState("device", ["isMobile"]),
    ...mapGetters("workplace", ["isTeacher"]),
    seconds() {
      return (
        this.secondSingle +
        this.secondTens * 10 +
        this.minuteSingle * 60 +
        this.minuteTens * 600
      );
    },
    showOperation() {
      return this.isTeacher && !this.timer.started;
    }
  },
  methods: {
    ...mapMutations("widget", [
      "START_TIMER",
      "SET_TIMER_VISIBLE",
      "UPDATE_POSITION"
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
    "timer.started"(value) {
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
    "timer.visible"() {
      this.setTime(this.timer.seconds);
    }
  }
};
</script>
<style lang="scss" scoped>
.timer {
  width: 210px;
  margin: 0 auto;
  .time {
    position: relative;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 24px 24px;
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
