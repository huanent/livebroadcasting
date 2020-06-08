<template>
  <div :class="{ mirror: mirror }" class="video __video_force_bg" ref="video">
    <video
      v-if="copy"
      :muted="muted"
      :style="{ objectFit: fit }"
      :src-object.prop="stream && stream.mediaStream_"
      autoplay
    ></video>
  </div>
</template>
<script>
import { liveBroadcastService } from "../../../core/live-broadcast";
import { delay } from "../../../core/utils";
export default {
  props: {
    streamId: {
      type: String,
      default: "__local"
    },
    muted: Boolean,
    mirror: Boolean,
    fit: {
      default: "contain"
    },
    copy: Boolean
  },
  data() {
    return {
      active: true,
      stream: null
    };
  },
  mounted() {
    this.setStream();
  },
  beforeDestroy() {
    this.active = false;
    if (!this.copy && this.stream) this.stream.stop();
  },
  methods: {
    async setStream() {
      while (this.active) {
        try {
          let stream = this.getStream();
          if (stream != this.stream) {
            if (this.stream && !this.copy) this.stream.stop();
            this.stream = stream;

            if (this.stream && !this.copy) {
              this.stream.play(this.$refs.video, {
                objectFit: this.fit,
                muted: this.muted
              });
            }
          }
        } catch (error) {
          console.error(error);
        }

        await delay(1000);
      }
    },
    getStream() {
      if (!liveBroadcastService) return;
      if (this.streamId == "__local") {
        return liveBroadcastService.trtcService.localStream;
      }

      if (this.streamId == "__screen") {
        return liveBroadcastService.trtcService.shareScreenStream;
      }

      return liveBroadcastService.trtcService.getRemoteStream(this.streamId);
    }
  },
  watch: {
    stream(value) {
      this.$emit("stream-changed", value);
    }
  }
};
</script>
<style lang="scss" scoped>
.video,
video {
  width: 100%;
  height: 100%;
}
.mirror {
  transform: rotateY(180deg);
}
</style>
<style>
.__video_force_bg div {
  background-color: rgba(0, 0, 0, 0) !important;
}
</style>
