<template>
  <div>
    <span class="beginRushAnswer" @click="start">{{ infoText }}</span>
    <restart-button v-if="showRestart" @click="start"></restart-button>
    <div class="closebtn" @click="SET_RUSH_VISIBLE(false)">关闭</div>
  </div>
</template>
<script>
import RestartButton from "./restart-button";
import { mapState, mapMutations } from "vuex";
export default {
  data() {
    return {
      showRestart: false,
      infoText: "开始抢答"
    };
  },
  computed: {
    ...mapState("widget", ["rush"])
  },
  components: {
    RestartButton
  },
  methods: {
    start() {
      this.$emit("start", () => this.stopCallback());
      this.showRestart = false;
      this.isrightAnimation = true;
      this.infoText = "抢答中";
      this.showRestart = true;
    },
    stopCallback() {
      if (!this.rush.queue.length) {
        this.infoText = "无人抢答";
      } else {
        this.infoText =
          this.rush.queue[0].__userName || this.rush.queue[0].__primaryKey;
      }
      this.showRestart = true;
    }
  }
};
</script>
<style lang="scss" scoped>
.beginRushAnswer {
  height: 140px;
  line-height: 140px;
  text-shadow: 2px 5px 8px #fff;
  &:hover {
    box-shadow: 0px 0px 1 rgb(78, 67, 67);
  }
}
.closebtn {
  position: absolute;
  bottom: 0px;
  width: 140px;
  text-align: center;
  color: #fff;
  height: 24px;
  background: #2a6469;
  font-size: 14px;

  &:hover {
    background: #0f9ca9;
  }
}
</style>
