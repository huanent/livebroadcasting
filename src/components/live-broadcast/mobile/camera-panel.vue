<template>
  <div
    class="camera-panel-wrapper"
    ref="wrapper"
    v-swipeup="swipeup"
    v-swipedown="swipedown"
  >
    <div class="items" ref="items" :style="{ top: offset + 'px' }">
      <camera
        :stream-id="teacherStreamId"
        :subscribe-audio="true"
        :subscribe-video="true"
        name="老师"
        v-if="!isTeacher && this.teacherStreamId"
        voiceVisualization="bar"
      />
      <camera
        class="item"
        stream-id="__local"
        :controllable="false"
        name="本人"
        voiceVisualization="bar"
      />
      <div
        class="item"
        :style="{ height: itemHeight + 'px' }"
        v-for="item in featuresList"
        :key="item.__primaryKey"
        :draggable="true"
        @dragstart="dragstart(item, $event)"
      >
        <camera
          :stream-id="item.__streamId"
          :controllable="false"
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
      offset: 0,
      itemHeight: 0
    };
  },
  mounted() {
    this.itemHeight = this.$el.getBoundingClientRect().width * (3 / 4);
  },
  computed: {
    ...mapState("workplace", ["featuresList"]),
    ...mapGetters("workplace", ["isTeacher", "teacherStreamId"])
  },
  beforeDestroy() {
    this.observer.disconnect();
  },
  components: {
    Camera
  },
  methods: {
    swipedown(e) {
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
      e.dataTransfer.setData("streamId", item.__streamId);
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
      width: 100%;
      min-height: 5rem;
      margin: 0.5rem 0;
    }
  }
}
</style>
