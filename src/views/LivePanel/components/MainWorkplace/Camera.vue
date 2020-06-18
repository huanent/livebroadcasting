<template>
  <video-player :muted="true" :stream-id="streamId" copy />
</template>
<script>
import { mapState } from "vuex";
import VideoPlayer from "@c/Camera/VideoPlayer";
export default {
  name: "Camera",
  components: {
    VideoPlayer
  },
  computed: {
    ...mapState("workplace", ["cameraPanelId", "token"]),
    streamId() {
      if (this.cameraPanelId == this.token.id) return "__local";
      return this.cameraPanelId;
    }
  }
};
</script>
