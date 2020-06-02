<template>
  <div class="camera-panel-wrapper">
    <div class="ctrl left">
      <a @click.stop="preCtl()">
        <icon name="chevron-circle-left" size="24"></icon>
      </a>
    </div>
    <div class="items">
      <SelfCameraItem v-if="!isTeacher"></SelfCameraItem>
      <CameraItem
        v-for="item in featuresList"
        :key="item.__primaryKey"
        :item="item"
      ></CameraItem>
    </div>
    <div class="ctrl right">
      <a @click.stop="nextCtl()">
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
      swiperOptions: {
        pagination: {
          el: ".swiper-pagination"
        },
        slidesPerView: 5,
        spaceBetween: 30
      }
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
    nextCtl() {
      this.$refs.mySwiper.$swiper.slideNext();
    },
    preCtl() {
      this.$refs.mySwiper.$swiper.slidePrev();
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
    margin: 0 50px;
    height: 100%;
    & > div {
      display: inline-block;
      width: 250px;
      margin-right: 5px;
    }
  }
}
</style>
