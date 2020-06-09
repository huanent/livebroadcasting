<template>
  <div
    class="camera-panel-wrapper"
    ref="wrapper"
    v-swipeup="swipeup"
    v-swipedown="swipedown"
  >
    <div class="items" ref="items" :style="{ top: offset + 'px' }">
      <camera
        class="item"
        v-if="!isTeacher"
        stream-id="__local"
        controllable
        name="本人"
      />

      <div
        class="item"
        v-for="item in featuresList"
        :key="item.__primaryKey"
        @touchstart="dragstart(item, $event)"
      >
        <camera
          :stream-id="item.__streamId"
          :controllable="isTeacher"
          :name="item.__nickName || item.__primaryKey"
          :subscribe-video="item.subscribeVideo"
          :subscribe-audio="item.subscribeAudio"
          hidden-voice-intensity
        />
      </div>
    </div>
  </div>
</template>

<script>
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { Emitter } from "@/core/emit";
import { liveBroadcastService } from "../../../core/live-broadcast";
import Camera from "../../common/camera";

export default {
  name: "CameraPanel",
  data() {
    return {
      offset: 0
    };
  },
  mounted() {},
  computed: {
    ...mapState("workplace", ["featuresList"]),
    ...mapGetters("workplace", ["isTeacher"])
  },
  components: {
    Camera
  },
  methods: {
    swipedown(e, a) {
      let { deltaY } = e;
      if (deltaY > 0) {
        deltaY = 0;
      }
      this.offset = deltaY;
    },
    swipeup(e) {
      let { deltaY } = e;
      let prect = this.$refs.wrapper.getBoundingClientRect();
      let rect = this.$refs.items.getBoundingClientRect();
      let ph = prect.height;
      let h = rect.height;
      if (ph >= h) {
        return;
      }
      this.offset = deltaY;
    },
    dragstart(item, e) {
      Emitter.emit("drag-stream-change", { streamId: item.__streamId });
    }
  }
};
</script>

<style scoped lang="scss">
.camera-panel-wrapper {
  height: 100%;
  width: 100%;
  position: relative;
  overflow: hidden;
  .items {
    position: absolute;
    transition: all 0.5s;
    top: 0;
    height: auto;
    width: 100%;
    .item {
      display: block;
      background-color: rgba(0, 0, 0, 0.58);
      width: 100%;
      height: 5rem;
      margin: 0.5rem 0;
    }
  }
}
</style>
