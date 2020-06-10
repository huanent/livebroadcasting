<template>
  <div class="camera-panel-wrapper" ref="wrapper">
    <div class="ctrl left">
      <a @click.stop="leftMove">
        <icon name="chevron-circle-left" size="24"></icon>
      </a>
    </div>
    <div class="items" ref="items" :style="{ left: offset + 50 + 'px' }">
      <camera
        class="item"
        v-if="!isTeacher"
        stream-id="__local"
        controllable
        name="本人"
        voiceVisualization="intensity"
      />

      <div
        class="item"
        v-for="item in featuresList"
        :key="item.__primaryKey"
        :draggable="isTeacher"
        @dragstart="dragstart(item, $event)"
      >
        <camera
          :stream-id="item.__streamId"
          :controllable="isTeacher"
          :name="item.__nickName || item.__primaryKey"
          :subscribe-video="item.subscribeVideo"
          :subscribe-audio="item.subscribeAudio"
          voiceVisualization="intensity"
        />
      </div>
    </div>
    <div class="ctrl right">
      <a @click.stop="rightMove">
        <icon name="chevron-circle-right" size="24"></icon>
      </a>
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
  computed: {
    ...mapState("workplace", ["featuresList"]),
    ...mapGetters("workplace", ["isTeacher"])
  },
  components: {
    Camera
  },
  methods: {
    leftMove() {
      let wrapperRect = this.$refs.wrapper.getBoundingClientRect();
      if (this.offset >= 0) return;
      this.offset += wrapperRect.width * 0.7;
      if (this.offset > 0) this.offset = 0;
    },
    rightMove() {
      let itemsRect = this.$refs.items.getBoundingClientRect();
      let wrapperRect = this.$refs.wrapper.getBoundingClientRect();
      if (wrapperRect.width > itemsRect.right) return;
      this.offset -= wrapperRect.width * 0.7;

      if (this.offset - wrapperRect.width < -itemsRect.width) {
        this.offset = wrapperRect.width - itemsRect.width - 100;
      }
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
  .ctrl {
    width: 50px;
    position: absolute;
    top: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    user-select: none;
    .svg-icon {
      @include themeify {
        fill: themed("font_color2");
      }
    }
    &:hover {
      .svg-icon {
        @include themeify {
          fill: mix(themed("font_color2"), themed("color_opposite"), 70%);
        }
      }
    }
  }
  .left {
    left: 0;
  }
  .right {
    right: 0;
  }
  .items {
    transition: all 0.5s;
    position: absolute;
    top: 0;
    bottom: 0;
    height: 100%;
    width: auto;
    white-space: nowrap;
    .item {
      display: inline-block;
      width: 250px;
      height: 100%;
      margin-right: 5px;
    }
  }
}
</style>
