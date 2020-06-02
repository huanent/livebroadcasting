<template>
  <div class="camera-panel-wrapper" ref="wrapper">
    <div class="ctrl left">
      <a @click.stop="leftMove">
        <icon name="chevron-circle-left" size="24"></icon>
      </a>
    </div>
    <div class="items" ref="items" :style="{ left: offset + 50 + 'px' }">
      <SelfCameraItem v-if="!isTeacher" class="item"></SelfCameraItem>
      <CameraItem
        class="item"
        v-for="item in featuresList"
        :key="item.__primaryKey"
        :item="item"
      ></CameraItem>
    </div>
    <div class="ctrl right">
      <a @click.stop="rightMove">
        <icon name="chevron-circle-right" size="24"></icon>
      </a>
    </div>
  </div>
</template>

<script>
import CameraItem from "./camera-item";
import SelfCameraItem from "./self-camera-item";
import { mapState, mapMutations, mapActions, mapGetters } from "vuex";
import { Emitter } from "@/core/emit";
import { liveBroadcastService } from "../../../core/live-broadcast";
import { Swiper, SwiperSlide } from "vue-awesome-swiper";
import "swiper/css/swiper.css";
export default {
  name: "CameraPanel",
  data() {
    return {
      offset: 0
    };
  },
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("workplace", ["featuresList"]),
    ...mapGetters("workplace", ["isTeacher"]),
    swiper() {
      return this.$refs.mySwiper.$swiper;
    }
  },
  components: {
    CameraItem,
    SelfCameraItem
  },
  methods: {
    ...mapMutations("remoteStream", ["REMOTE_STREAM_PLAY"]),
    ...mapActions("features", ["manualControlFeatures"]),
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
        this.offset = wrapperRect.width * 0.7 - itemsRect.width;
      }
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
    z-index: 100000;
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
      margin-right: 5px;
    }
  }
}
</style>
