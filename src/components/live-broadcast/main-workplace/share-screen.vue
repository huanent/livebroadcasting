<template>
  <video-player :muted="true" :stream-id="streamId" />
</template>
<script>
import { mapGetters, mapMutations, mapState } from "vuex";
import { liveBroadcastService } from "@/core/live-broadcast";
import VideoPlayer from "../../common/camera/video-player";
export default {
  components: {
    VideoPlayer
  },
  async mounted() {
    if (!this.isTeacher) return;
    try {
      await liveBroadcastService.trtcService.startShareScreen();
    } catch (error) {
      this.SET_PANEL_TYPE({ type: "board", streamId: this.userInfo.id });
    }
  },
  async beforeDestroy() {
    if (!this.isTeacher) return;
    await liveBroadcastService.trtcService.stopShareScreen();
  },
  computed: {
    ...mapState("account", ["userInfo"]),
    ...mapGetters("workplace", ["isTeacher", "teacherScreenStreamId"]),
    streamId() {
      return this.isTeacher ? "__screen" : this.teacherScreenStreamId;
    }
  },
  methods: {
    ...mapMutations("workplace", ["SET_PANEL_TYPE"])
  }
};
</script>
