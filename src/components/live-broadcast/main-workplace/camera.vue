<template>
  <video-player :muted="true" :stream-id="streamId" />
</template>
<script>
import { mapState } from "vuex";
import VideoPlayer from "../../common/camera/video-player";
export default {
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
