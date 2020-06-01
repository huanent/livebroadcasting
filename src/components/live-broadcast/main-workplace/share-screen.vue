<template>
  <div ref="screen"></div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from "vuex";
import { liveBroadcastService } from "@/core/live-broadcast";
import { delay } from "../../../core/utils";
export default {
  data() {
    return {
      active: true,
      stream: null
    };
  },
  async mounted() {
    if (this.isTeacher) {
      await liveBroadcastService.trtcService.startShareScreen();
    }

    while (this.active) {
      let stream = this.isTeacher
        ? liveBroadcastService.trtcService.shareScreenStream
        : liveBroadcastService.trtcService.getRemoteStream(
            this.teacherScreenStreamId
          );

      if (stream != this.stream) {
        if (this.stream) this.stream.stop();
        if (!this.isTeacher) {
          liveBroadcastService.trtcService.subscribe(stream, false, true);
        }
        stream.play(this.$refs.screen, {
          objectFit: "contain",
          muted: true
        });
        this.stream = stream;
      }
      await delay(1000);
    }
  },
  async beforeDestroy() {
    this.active = false;

    if (this.stream && !this.isTeacher) {
      liveBroadcastService.trtcService.unsubscribe(stream);
    }

    this.stream = null;
    await liveBroadcastService.trtcService.stopShareScreen();
  },
  computed: {
    ...mapGetters("workplace", ["isTeacher", "teacherScreenStreamId"])
  }
};
</script>
