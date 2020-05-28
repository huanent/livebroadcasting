<template>
  <div class="timer"><strong>距离下课：</strong>{{ time }}</div>
</template>
<script>
import { mapState } from "vuex";

export default {
  data() {
    return {
      time: "00:00",
      timer: null,
      notifyTimes: ["5:0", "1:0"]
    };
  },
  computed: {
    ...mapState("workplace", ["roomInfo"])
  },
  mounted() {
    var time = Number(this.roomInfo.endTime);
    this.timer = setInterval(() => {
      var offset = time - new Date().getTime();
      if (offset < 0) {
        this.time = "00:00";
      } else {
        let minutes = parseInt(offset / 60000);
        let seconds = parseInt((offset % 60000) / 1000);
        this.time = `${minutes}:${seconds}`;
      }
    }, 1000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  watch: {
    time(value) {
      if (this.notifyTimes.includes(value)) {
        this.$notify({
          title: "距离下课 " + value,
          type: "warning"
        });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.timer {
  @include themeify {
    color: themed("font_color2");
  }
}
</style>
