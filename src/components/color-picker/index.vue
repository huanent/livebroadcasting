<template>
  <div class="color-picker" ref="picker">
    <div class="color" ref="color" :style="{ background: hueColor }">
      <div class="saturation" ref="sv"></div>
      <div class="value"></div>

      <div
        v-panmove="onPointerDragMove"
        v-panstart="onPointerDragStart"
        class="drag-pointer"
        :style="{
          left: saturationNumber * 100 + '%',
          top: valueTopOffset * 100 + '%'
        }"
        :class="{ active: true }"
      ></div>
    </div>

    <div class="wrapper">
      <div class="container-group">
        <div class="hue-container" ref="hue">
          <div
            v-panmove="onHueDragMove"
            v-panstart="onHueDragStart"
            class="drag-bar"
            :style="{ left: hueNumber * 100 + '%' }"
          ></div>
        </div>
        <div class="opacity-container" ref="alpha">
          <div
            class="color-bar"
            :style="{
              background:
                'linear-gradient(to right, rgba(0, 0, 255, 0),' + hueColor + ')'
            }"
          ></div>
          <div
            v-panmove="onAlphaDragMove"
            v-panstart="onAlphaDragStart"
            class="drag-bar"
            :style="{ left: alphaNumber * 100 + '%' }"
          ></div>
        </div>
      </div>
      <div class="preview-color">
        <div :style="{ background: currentColor }"></div>
      </div>
    </div>
  </div>
</template>

<script>
import chroma from "chroma-js";
export default {
  name: "ColorPicker",
  props: {
    value: {}
  },
  data() {
    this.$chroma = chroma;
    return {
      pointerActive: true,
      alphaNumber: 1,

      colorX: 0.5,
      colorY: 0.5,
      hueNumber: 0.5,
      hueNumberCache: 0,
      alphaNumberCache: 0,
      saturationNumber: 1,
      saturationNumberCache: 0,
      valueTopOffset: 0,
      valueTopOffsetCache: 0
    };
  },
  created() {
    this.initColor(this.value);
  },
  watch: {
    value(value) {
      this.initColor(value);
    }
  },
  computed: {
    valueNumber() {
      return 1 - this.valueTopOffset;
    },
    hueColor() {
      return this.$chroma.hsv(this.hueNumber * 360, 1, 1);
    },
    currentColor() {
      let color = this.$chroma({
        h: this.hueNumber * 360,
        s: this.saturationNumber,
        v: this.valueNumber
      }).alpha(this.alphaNumber);
      this.$emit("input", color.toString());
      return color;
    }
  },
  methods: {
    initColor(color) {
      let chromaColor = this.$chroma(color);
      this.hueNumber = chromaColor.get("hsl.h") / 360;
      this.saturationNumber = chromaColor.get("hsv.s");
      this.valueTopOffset = 1 - chromaColor.get("hsv.v");
      this.alphaNumber = chromaColor.alpha();
    },
    onPointerDragStart() {
      this.valueTopOffsetCache = this.valueTopOffset;
      this.saturationNumberCache = this.saturationNumber;
    },
    onPointerDragMove(e) {
      let width = this.$refs.sv.getBoundingClientRect().width;
      let height = this.$refs.sv.getBoundingClientRect().height;
      let deltaRatioX = e.deltaX / width;
      let deltaRatioY = e.deltaY / height;
      if (
        this.saturationNumberCache + deltaRatioX > 1 ||
        this.saturationNumberCache + deltaRatioX < 0
      )
        return;
      if (
        this.valueTopOffsetCache + deltaRatioY > 1 ||
        this.valueTopOffsetCache + deltaRatioY < 0
      )
        return;
      this.saturationNumber = this.saturationNumberCache + deltaRatioX;
      this.valueTopOffset = this.valueTopOffsetCache + deltaRatioY;
    },
    onHueDragStart() {
      this.hueNumberCache = this.hueNumber;
    },
    onHueDragMove(e) {
      let width = this.$refs.hue.getBoundingClientRect().width;
      let deltaRatioX = e.deltaX / width;
      if (
        this.hueNumberCache + deltaRatioX > 1 ||
        this.hueNumberCache + deltaRatioX < 0
      )
        return;
      this.hueNumber = this.hueNumberCache + deltaRatioX;
    },
    onAlphaDragStart() {
      this.alphaNumberCache = this.alphaNumber;
    },
    onAlphaDragMove(e) {
      let width = this.$refs.alpha.getBoundingClientRect().width;
      let deltaRatioX = e.deltaX / width;
      if (
        this.alphaNumberCache + deltaRatioX > 1 ||
        this.alphaNumberCache + deltaRatioX < 0
      )
        return;
      this.alphaNumber = this.alphaNumberCache + deltaRatioX;
    }
  }
};
</script>

<style scoped lang="scss">
.color-picker {
  display: inline-block;
  text-align: center;
  outline: none;
  height: auto;
  width: 100%;
}
.hue-container {
  position: relative;
  height: 6px;
  width: 100%;
  margin: 0 0 1rem 0;
  background: linear-gradient(
    90deg,
    red 0,
    #ff0 17%,
    #0f0 33%,
    #0ff 50%,
    #00f 67%,
    #f0f 83%,
    red
  );
}
.opacity-container {
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAJElEQVQYV2NctWrVfwYkEBYWxojMZ6SDAmT7QGx0K1EcRBsFAADeG/3M/HteAAAAAElFTkSuQmCC)
    repeat;
  position: relative;
  margin: 1rem 0 0 0;
  width: 100%;
  height: 6px;
}
.color {
  background-color: white;
  position: relative;
  height: 72px;
  cursor: pointer;
  * {
    width: 100%;
    height: 100%;
  }

  .value {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(0deg, #000, transparent);
  }

  .saturation {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
  }

  .drag-pointer {
    position: absolute;
    width: 8px;
    height: 8px;
    z-index: 100;
    border-radius: 50%;
    transform: translateX(-50%) translateY(-50%);
  }
  .active {
    border: 2px solid #ffffff;
  }
}

.color-bar {
  width: 100%;
  height: 100%;
}
.drag-bar {
  position: absolute;

  transform: translateX(-50%) translateY(-50%);
  width: 6px;
  height: 6px;

  cursor: pointer;

  border-radius: 50%;

  background-color: transparent;
  border: 2px solid #fff;
  box-shadow: 0 0 1px 0 #000, inset 0 0 1px 0 #000;
  top: 50%;
}

.preview-color {
  width: 10px;
  height: 100%;
  border-radius: 3px;
  margin: 0 2px;
  overflow: hidden;
  div {
    width: 100%;
    height: 100%;
  }
  background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAAICAYAAADED76LAAAAJElEQVQYV2NctWrVfwYkEBYWxojMZ6SDAmT7QGx0K1EcRBsFAADeG/3M/HteAAAAAElFTkSuQmCC);
}
.container-group {
  width: calc(100% - 20px);
}
.wrapper {
  width: 100%;
  height: 2rem;
  margin: 1rem 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  & > * {
    display: inline-block;
  }
}
</style>
