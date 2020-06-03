<template>
  <video ref="video" muted="true" autoplay />
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

      if (stream && stream != this.stream) {
        this.$refs.video.srcObject = stream.mediaStream_;

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
<style lang="scss" scoped>
video {
  width: 100%;
  height: 100%;
  object-fit: contain;
}
</style>
