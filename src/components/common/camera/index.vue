<template>
  <div class="camera">
    <video :muted="muted"></video>
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
    subscribeVideo: Boolean,
    muted: Boolean,
    mirror: Boolean
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
    }
  }
};
</script>
<style lang="scss" scoped>
.camera {
  height: 100%;
  width: 100%;
  position: relative;
  video {
    height: 100%;
    width: 100%;
  }
  .mask-layer {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
}
</style>
