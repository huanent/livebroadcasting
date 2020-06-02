<template>
  <div class="camera">
    <div ref="video"></div>
    <div class="mask-layer"></div>
    <div class="audio-level"></div>
  </div>
</template>
<script>
export default {
  props: {
    name: {
      type: String,
      default: ""
    },
    streamId: String,
    subscribeAudio: Boolean,
    subscribeVedio: Boolean
  },
  data() {
    return {
      active: true,
      stream: null
    };
  },
  mounted() {},
  beforeDestroy() {
    this.active = false;
  },
  methods: {
    async setStream() {
      while (this.active) {
        let stream = this.getStream();
        if (!stream) this.clearOldSteam();

        if (stream != this.stream) {
          if (!this.isTeacher) {
            liveBroadcastService.trtcService.subscribe(stream, true, true);
          }

          stream.play(this.$refs.video, { muted: this.isTeacher });
          this.stream = stream;
        }

        await delay(1000);
      }
    },
    getStream() {
      this.streamId
        ? liveBroadcastService.trtcService.getRemoteStream(this.streamId)
        : liveBroadcastService.trtcService.localStream;
    },
    clearOldSteam() {
      if (!this.stream) return;
      this.stream.stop();
      this.stream = null;
    }
  }
};
</script>
