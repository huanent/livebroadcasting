<template>
  <widget-window
    v-if="video.visible"
    :position="video.position"
    @moved="UPDATE_POSITION({ name: 'video', position: $event })"
    @close="SET_VIDEO_VISIBLE({ visible: false })"
  >
    <video :src="video.src" controls autoplay></video>
  </widget-window>
</template>
<script>
import WidgetWindow from "../widget-window";
import { mapState } from "vuex";
export default {
  computed: {
    ...mapState("widget", ["video"])
  },
  components: {
    WidgetWindow
  }
};
</script>
<style lang="scss" scoped>
video {
  max-width: 800px;
  max-height: 600px;
}
</style>
