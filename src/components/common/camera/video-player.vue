<template>
  <video
    :muted="muted"
    :class="{ mirror: mirror }"
    :style="{ onjectFit: fit }"
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
  beforeDestroy() {
    this.active = false;
  },
  methods: {
    async setStream() {
      while (this.active) {
        let stream = this.getStream();
        if (stream != this.stream) this.stream = stream;
        await delay(1000);
      }
    },
    getStream() {
      if (this.streamId == "__local") {
        return liveBroadcastService.trtcService.localStream;
      }

      if (this.streamId == "__screen") {
        return liveBroadcastService.trtcService.shareScreenStream;
      }

      return liveBroadcastService.trtcService.getRemoteStream(this.streamId);
    }
  }
};
</script>
<style lang="scss" scoped>
video {
  width: 100%;
  height: 100%;
}
.mirror {
  transform: rotateY(180deg);
}
</style>
