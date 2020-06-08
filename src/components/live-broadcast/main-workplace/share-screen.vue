<template>
  <video-player :muted="true" :stream-id="streamId" />
</template>
<script>
import { mapGetters } from "vuex";
import { liveBroadcastService } from "@/core/live-broadcast";
import VideoPlayer from "../../common/camera/video-player";
export default {
  components: {
    VideoPlayer
  },
  async mounted() {
    if (!this.isTeacher) return;
    await liveBroadcastService.trtcService.startShareScreen();
  },
  async beforeDestroy() {
    if (!this.isTeacher) return;
    await liveBroadcastService.trtcService.stopShareScreen();
  },
  computed: {
    ...mapGetters("workplace", ["isTeacher", "teacherScreenStreamId"]),
    streamId() {
      return this.isTeacher ? "__screen" : this.teacherScreenStreamId;
    }
  }
};
</script>
