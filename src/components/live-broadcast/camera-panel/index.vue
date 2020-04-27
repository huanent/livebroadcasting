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
              :user-name="item.userId"
              :stream-id="item.id"
              @on-ready="play"
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

import { Emitter } from "../../../core/emit";

export default {
  name: "CameraPanel",
  data() {
    return {
      translateX: 0,
      perColumnHeight: 185,
      slidesPerColumn: 1,
      perColumnWidth: 400,
      slidesPerView: 4
    };
  },
  mounted() {
    this.render();
    Emitter.on("split-change", () => {
      let el = this.$refs.swiper.parentElement;
      if (!el) return;
      let slidesPerColumn = Math.floor(el.clientHeight / this.perColumnHeight);
      if (slidesPerColumn !== this.slidesPerColumn && slidesPerColumn >= 1) {
        this.slidesPerColumn = slidesPerColumn;
        this.translateX = 0;
      }
    });
  },
  computed: {
    width() {
      let temp = this.remoteStreamList.length / this.slidesPerColumn;
      return Math.ceil(temp) * this.perColumnWidth;
    },
    remoteStreamList() {
      return this.$store.state.workplace.remoteStreamList;
    }
  },
  watch: {
    slidesPerColumn() {
      this.render();
    }
  },
  filters: {
    format(value) {}
  },
  components: {
    CameraItem
  },
  getSlidesPerColumn() {},

  methods: {
    render() {
      let el = this.$refs.swiper;
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
    play(e) {
      this.$store.commit("workplace/REMOTE_STREAM_PLAY", e, e);
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
  width: 80%;
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
  width: 10%;
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
    /deep/ .svg-icon {
      padding: 1rem;
      margin: 0 auto;
      fill: #979797 !important;
    }
    &:hover {
      /deep/ .svg-icon {
        fill: #e9e9e9 !important;
      }
    }
  }
}
</style>
