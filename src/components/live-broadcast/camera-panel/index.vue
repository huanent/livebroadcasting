<template>
  <div class="camera-panel-wrapper">
    <div class="camera-left-ctl">
      <a @click.stop="preCtl()">
        <icon name="chevron-circle-left" size="24"></icon>
      </a>
    </div>
    <div class="swiper-wrapper" ref="swiper">
      <div
        class="camera-item-list"
        :style="{
          width: width + 'px',
          height: perColumnHeight * slidesPerColumn + 'px',
          transform: 'translateX(' + translateX + 'px)'
        }"
      >
        <div
          v-for="(item, index) in remoteStreamList"
          :key="index"
          :style="{
            height: perColumnHeight + 'px',
            width: perColumnWidth + 'px'
          }"
          style="display: inline-block"
        >
          <div
            :style="{ height: perColumnHeight + 'px' }"
            style="color: white;display: inline-block;width: 100%"
          >
            <CameraItem
              :item="item"
              :audio="
                getFeatures(item.userId) &&
                  getFeatures(item.userId).subscribeAudio
              "
              :video="
                getFeatures(item.userId) &&
                  getFeatures(item.userId).subscribeVideo
              "
              @on-ready="play"
              @video-change="videoChange($event, item.userId)"
              @audio-change="audioChange($event, item.userId)"
            ></CameraItem>
          </div>
        </div>
      </div>
    </div>

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
import { ROLE } from "../../../models/role";
import { liveBroadcastService } from "../../../core/live-broadcast/live-broadcast-service";

export default {
  name: "CameraPanel",
  data() {
    return {
      translateX: 0,
      perColumnHeight: 210,
      slidesPerColumn: 1,
      perColumnWidth: 200,
      slidesPerView: 5,
      oldFeaturesList: undefined
    };
  },
  mounted() {
    this.render();
    Emitter.on("split-change", () => {
      if (!this.$refs.swiper || !this.$refs.swiper.parentElement) return;
      let el = this.$refs.swiper.parentElement;
      let slidesPerColumn = Math.floor(el.clientHeight / this.perColumnHeight);
      if (slidesPerColumn !== this.slidesPerColumn && slidesPerColumn >= 1) {
        this.slidesPerColumn = slidesPerColumn;
        this.translateX = 0;
      }
    });
  },
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("remoteStream", ["remoteStreamList"]),
    ...mapState("workplace", ["featuresList"]),
    width() {
      let temp = this.remoteStreamList.length / this.slidesPerColumn;
      return Math.ceil(temp) * this.perColumnWidth;
    }
  },
  watch: {
    slidesPerColumn() {
      this.render();
    },
    featuresList: {
      handler(featuresList) {
        let oldFeaturesList = this.oldFeaturesList;

        featuresList.forEach(async (features, index) => {
          if (
            oldFeaturesList &&
            oldFeaturesList[index] &&
            oldFeaturesList[index].__primaryKey === features.__primaryKey
          ) {
            let oldFeatures = oldFeaturesList[index];
            if (
              oldFeatures.subscribeVideo !== features.subscribeVideo ||
              oldFeatures.subscribeAudio !== features.subscribeAudio
            ) {
              let options = {
                video: features.subscribeVideo,
                audio: features.subscribeAudio
              };
              await liveBroadcastService.trtcService.subscribeRemoteStream(
                features.__primaryKey,
                options
              );
              if (oldFeatures.subscribeAudio !== features.subscribeAudio) {
                if (features.subscribeAudio) {
                  Emitter.emit("ADD_AUDIO_TRACK", features.__primaryKey);
                } else {
                  Emitter.emit("REMOVE_AUDIO_TRACK", features.__primaryKey);
                }
              }
            }
          } else {
            if (features.subscribeAudio) {
              Emitter.emit("ADD_AUDIO_TRACK", features.__primaryKey);
            } else {
              Emitter.emit("REMOVE_AUDIO_TRACK", features.__primaryKey);
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
    CameraItem
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
    audioChange(e, userId) {
      this.manualControlFeatures({
        id: userId,
        propName: "subscribeAudio",
        value: e
      });
    },
    render() {
      let el = this.$refs["swiper"];
      if (!el) return;
      this.perColumnWidth = el.clientWidth / this.slidesPerView;
    },
    nextCtl() {
      let translateX =
        this.translateX - this.slidesPerView * this.perColumnWidth;
      if (Math.abs(translateX) >= this.width) {
        return;
      }
      this.translateX = translateX;
    },
    preCtl() {
      let translateX =
        this.translateX + this.slidesPerView * this.perColumnWidth;
      if (translateX > 0) {
        return;
      }
      this.translateX = translateX;
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
.swiper-wrapper {
  width: 90%;
  overflow: hidden;
}
.camera-item-list {
  /*  overflow: scroll;*/
  transition: all 0.1s;
  margin: 0 auto;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  & > div {
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
</style>
