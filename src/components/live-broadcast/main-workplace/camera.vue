<template>
  <div ref="camera"></div>
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
    while (this.active) {
      let stream = this.isTeacher
        ? liveBroadcastService.trtcService.localStream
        : liveBroadcastService.trtcService.getRemoteStream(
            this.teacherStreamId
          );

      if (stream != this.stream) {
        if (this.stream) this.stream.stop();

        let copedStream = await liveBroadcastService.trtcService.copyStream(
          stream
        );

        copedStream.play(this.$refs.camera, {
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
  },
  computed: {
    ...mapGetters("workplace", ["isTeacher", "teacherStreamId"])
  }
};
</script>
