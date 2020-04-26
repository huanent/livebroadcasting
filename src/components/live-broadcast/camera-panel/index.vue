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
        <!--      <CameraItem
          v-for="(item, index) in cameraList"
          :key="index"
          :user-name="item"
        ></CameraItem>-->
        <div
          v-for="item in data"
          :style="{
            height: perColumnHeight + 'px',
            width: perColumnWidth + 'px'
          }"
          style="display: inline-block"
        >
          <div
            :style="{ height: perColumnHeight + 'px' }"
            style="color: white;background-color: #393939;border: #0a818c solid 1px;display: inline-block;width: 100%"
          >
            {{ item }}
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
    var self = this;
    return {
      cameraList: ["1", "2", "3", "4", "5", "6"],
      translateX: 0,
      data: [
        "1.png",
        "2.png",
        "3.png",
        "4.png",
        "5.png",
        "6.png",
        "7.png",
        "8.png",
        "9.png",
        "10.png",
        "11.png",
        "12.png",
        "13.png",
        "14.png",
        "15.png",
        "16.png",
        "17.png",
        "18.png"
      ],
      perColumnHeight: 185,
      slidesPerColumn: 1,
      perColumnWidth: 400,
      slidesPerView: 3
    };
  },
  mounted() {
    this.render();
    Emitter.on("split-change", () => {
      let el = this.$refs.swiper.parentElement;
      let slidesPerColumn = Math.floor(el.clientHeight / this.perColumnHeight);
      if (slidesPerColumn !== this.slidesPerColumn && slidesPerColumn >= 1) {
        this.slidesPerColumn = slidesPerColumn;
        this.translateX = 0;
      }
    });
  },
  computed: {
    width() {
      let temp = this.data.length / this.slidesPerColumn;
      return Math.ceil(temp) * this.perColumnWidth;
    }
  },
  watch: {
    slidesPerColumn() {
      this.render();
    }
  },
  components: {
    CameraItem
  },
  getSlidesPerColumn() {},

  methods: {
    render() {
      let el = this.$refs.swiper;
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
  background-color: #8a8a8a;
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
      padding: 0.2rem;
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
