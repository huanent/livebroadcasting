<template>
  <div class="timer"><strong>距离下课：</strong>{{ time }}</div>
</template>
<script>
import { mapState } from "vuex";

export default {
  name: "ClassTimer",
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
        // let minutes = parseInt(offset / 60000);
        // let seconds = parseInt((offset % 60000) / 1000);

        
        let offsetDays=parseInt(offset/(24*3600*1000));
        let surplusTimes=offset%(24*60*60*1000);

        let hours=parseInt(surplusTimes/(3600*1000));
        let surplusMinutes=surplusTimes%(60*60*1000);

        let minutes=parseInt(surplusMinutes/(60*1000));
        let surplusSeconds=surplusMinutes%(60*1000);

        let seconds=parseInt(surplusSeconds/1000);
        if(seconds <10){
          seconds = '0' + seconds
        }
        if(minutes <10){
          minutes = '0' + minutes
        }
        this.time = `${offsetDays}天 ${hours}:${minutes}:${seconds}`;
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
