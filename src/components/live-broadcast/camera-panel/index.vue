<template>
  <div class="camera-panel-wrapper">
    <div class="camera-left-ctl">
      <a @click.stop="preCtl()">
        <icon name="chevron-circle-left" size="24"></icon>
      </a>
    </div>
    <swiper ref="mySwiper" :options="swiperOptions">
      <swiper-slide v-for="(item, index) in remoteStreamList" :key="index">
        <CameraItem
          :item="item"
          :audio="
            getFeatures(item.userId) && getFeatures(item.userId).subscribeAudio
          "
          :video="
            getFeatures(item.userId) && getFeatures(item.userId).subscribeVideo
          "
          @on-ready="play"
          @video-change="videoChange($event, item.userId)"
          @audio-change="audioChange($event, item.userId)"
        ></CameraItem
      ></swiper-slide>
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
      oldFeaturesList: undefined,
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
    ...mapState("remoteStream", ["remoteStreamList"]),
    ...mapState("workplace", ["featuresList"]),
    swiper() {
      return this.$refs.mySwiper.$swiper;
    }
  },
  watch: {
    featuresList: {
      handler(featuresList) {
        let oldFeaturesList = this.oldFeaturesList;
        let changeResults = this.getDiff(featuresList, oldFeaturesList);
        changeResults.forEach(async item => {
          if (item.subscribeVideo.change || item.subscribeAudio.change) {
            let options = {
              video: item.subscribeVideo.value,
              audio: item.subscribeAudio.value
            };
            await liveBroadcastService.trtcService.subscribeRemoteStream(
              item.__primaryKey.value,
              options
            );
          }
          if (item.subscribeAudio.change) {
            if (item.subscribeAudio.value) {
              Emitter.emit("ADD_AUDIO_TRACK", item.__primaryKey.value);
            } else {
              Emitter.emit("REMOVE_AUDIO_TRACK", item.__primaryKey.value);
            }
          }
        });
        this.oldFeaturesList = JSON.parse(JSON.stringify(this.featuresList));
      },
      deep: true
    }
  },
  filters: {
    format(value) {}
  },
  components: {
    CameraItem,
    Swiper,
    SwiperSlide
  },
  methods: {
    ...mapMutations("remoteStream", ["REMOTE_STREAM_PLAY"]),
    ...mapActions("features", ["manualControlFeatures"]),
    getFeatures(userId) {
      let feature = this.featuresList.find((item, index) => {
        if (item.__primaryKey === userId) return true;
      });
      if (feature) {
        return feature;
      }
    },
    videoChange(e, userId) {
      this.manualControlFeatures({
        id: userId,
        propName: "subscribeVideo",
        value: e
      });
    },
    getDiff(n, o) {
      let diff = [];
      function getChange(feature, oldFeature) {
        let re = {};
        for (let j in feature) {
          let temp = { value: feature[j], change: false };
          if (!oldFeature || !oldFeature[j] || oldFeature[j] !== feature[j]) {
            temp.change = true;
          }
          re[j] = temp;
        }
        return re;
      }
      n.forEach(nFeature => {
        let oldList = [];
        if (o) oldList = o;
        let oldFeature = oldList.find(oFeature => {
          return oFeature.__primaryKey === nFeature.__primaryKey;
        });
        diff.push(getChange(nFeature, oldFeature));
      });
      return diff;
    },
    audioChange(e, userId) {
      this.manualControlFeatures({
        id: userId,
        propName: "subscribeAudio",
        value: e
      });
    },
    nextCtl() {
      this.$refs.mySwiper.$swiper.slideNext();
    },
    preCtl() {
      this.$refs.mySwiper.$swiper.slidePrev();
    },
    async play(id, element) {
      let options = { video: true, audio: true };
      this.REMOTE_STREAM_PLAY({
        id: id,
        element: element,
        options: options
      });
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
