<template>
  <video
    :class="{ mirror: mirror }"
    :muted="muted"
    :style="{ objectFit: fit }"
    :src-object.prop="stream && stream.mediaStream_"
    autoplay
  ></video>
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
    }
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
  methods: {
    async setStream() {
      while (this.active) {
        try {
          let stream = this.getStream();
          if (stream != this.stream) {
            this.stream = stream;
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
        return liveBroadcastService.trtcService.assistStream;
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
