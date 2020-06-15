<template>
  <widget-window
    v-if="video.visible"
    :position="video.position"
    @moved="UPDATE_POSITION({ name: 'video', position: $event })"
    @close="SET_VIDEO_VISIBLE({ visible: false })"
    :class="{ 'mobile-scale': isMobile }"
  >
    <video :src="video.src" controls autoplay></video>
  </widget-window>
</template>
<script>
import WidgetWindow from "../WidgetWindow";
import { mapState, mapMutations } from "vuex";
export default {
  name: "VideoWidget",
  computed: {
    ...mapState("widget", ["video"]),
    ...mapState("device", ["isMobile"])
  },
  components: {
    WidgetWindow
  },
  methods: {
    ...mapMutations("widget", ["SET_VIDEO_VISIBLE", "UPDATE_POSITION"])
  }
};
</script>
<style lang="scss" scoped>
video {
  max-width: 800px;
  max-height: 600px;
}
</style>
