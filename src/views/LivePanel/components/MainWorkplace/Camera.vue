<template>
  <video-player ref="player" :muted="true" :stream-id="streamId" copy />
</template>
<script>
import { mapState } from "vuex";
import VideoPlayer from "@c/Camera/VideoPlayer";

import { liveBroadcastService } from "../../../../core/live-broadcast";
import { delay } from "../../../../core/utils";
export default {
  name: "Camera",
  data() {
    return {
      stream: null,
      active: true
    };
  },
  components: {
    VideoPlayer
  },
  computed: {
    ...mapState("workplace", ["cameraPanelId", "token"]),
    streamId() {
      if (this.cameraPanelId == this.token.id) return "__local";
      return this.cameraPanelId;
    }
  },
  methods: {
    setStreamType(stream, type) {
      liveBroadcastService.trtcService.mainClient.setRemoteVideoStreamType(
        stream,
        type
      );
    }
  },
  async mounted() {
    while (this.active) {
      if (this.$refs.player.stream && this.stream != this.$refs.player.stream) {
        if (this.stream) {
          this.setStreamType(this.stream, 1);
        }
        this.setStreamType(this.$refs.player.stream, 0);
        this.stream = this.$refs.player.stream;
      }
      await delay(500);
    }
  },
  beforeDestroy() {
    this.active = false;
    this.setStreamType(this.stream, 1);
  }
};
</script>
