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
              :key="index"
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
      oldFeaturesList: undefined,
      list: []
    };
  },
  mounted() {
    this.render();
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
