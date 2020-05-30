<template>
  <div class="camera-panel-wrapper">
    <div class="camera-left-ctl">
      <a @click.stop="preCtl()">
        <icon name="chevron-circle-left" size="24"></icon>
      </a>
    </div>
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="(item, index) in list" :key="index">
        <CameraItem :item="item" :key="index"></CameraItem>
      </swiper-slide>
    </swiper>
    <div class="camera-right-ctl">
      <a @click.stop="nextCtl()">
        <icon name="chevron-circle-right" size="24"></icon>
      </a>
    </div>
  </div>
</template>

<script>
import CameraItem from "./camera-item";
import { mapState, mapMutations, mapActions } from "vuex";
import { Emitter } from "@/core/emit";
import { liveBroadcastService } from "../../../core/live-broadcast/live-broadcast-service";
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
    swiper() {
      return this.$refs.mySwiper.$swiper;
    },
    list() {
      return this.featuresList.filter(
        f => f.subscribeVideo || f.subscribeAudio || true
      );
    }
  },
  components: {
    CameraItem,
    Swiper,
    SwiperSlide
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
  display: flex;
  align-items: center;
  & > * {
    display: inline-block;
  }
}
.camera-left-ctl,
.camera-right-ctl {
  width: 5%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
  & > a {
    margin: 0 auto;
    display: inline-block;
    padding: 0.5rem;
    cursor: pointer;
    .svg-icon {
      padding: 1rem;
      margin: 0 auto;
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
}
.swiper-wrapper {
  width: 90%;
  height: 100%;
}
.swiper-container {
  height: 100%;
  width: 100%;
}
</style>
