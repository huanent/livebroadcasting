<template>
  <div
    class="camera-panel-wrapper"
    ref="wrapper"
    v-panend="panend"
    v-panmove="panmove"
    v-panstart="panstart"
  >
    <div
      ref="items"
      class="items"
      :class="{ smoothness: smoothness }"
      :style="{ top: top + 'px' }"
    >
      <camera
        v-if="!isTeacher && this.teacherStreamId"
        class="item"
        :stream-id="teacherStreamId"
        :subscribe-audio="true"
        :subscribe-video="true"
        name="老师"
        voiceVisualization="bar"
      />

      <camera
        class="item"
        stream-id="__local"
        name="本人"
        voiceVisualization="bar"
      />

      <camera
        v-for="item in featuresList"
        :key="item.__primaryKey"
        class="item"
        :stream-id="item.__streamId"
        :name="item.__nickName || item.__primaryKey"
        :subscribe-video="item.subscribeVideo"
        :subscribe-audio="item.subscribeAudio"
        voiceVisualization="bar"
      />
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
      top: 0,
      offset: 0,
      smoothness: false
    };
  },
  computed: {
    ...mapState("workplace", ["featuresList"]),
    ...mapGetters("workplace", ["isTeacher", "teacherStreamId"])
  },
  components: {
    Camera
  },
  methods: {
    panend(e) {
      this.smoothness = true;
      let prect = this.$refs.wrapper.getBoundingClientRect();
      let rect = this.$refs.items.getBoundingClientRect();

      if (-this.top > rect.height - prect.height) {
        this.top = prect.height - rect.height;
      }

      if (this.top > 0) this.top = 0;
      this.offset = this.top;
    },
    panmove(e) {
      let { deltaY } = e;
      this.top = deltaY + this.offset;
    },
    panstart() {
      this.smoothness = false;
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
    .item {
      display: block;
      width: 100%;
      height: 5rem;
      margin-bottom: 0.5rem;
    }
  }
}
.smoothness {
  transition: top 0.5s;
}
</style>
