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
      let stream =
        this.cameraPanelId == this.token.id
          ? liveBroadcastService.trtcService.localStream
          : liveBroadcastService.trtcService.getRemoteStream(
              this.cameraPanelId
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
    this.stream = null;
  },
  computed: {
    ...mapState("workplace", ["cameraPanelId", "token"]),
    ...mapGetters("workplace", ["isTeacher"])
  }
};
</script>
