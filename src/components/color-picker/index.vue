<template>
  <div class="color-picker" ref="picker">
    <div class="color" :style="{ background: value }">
      <div class="saturation">
        <div class="value">
          <div class="drag-pointer" :class="{ active: pointerActive }"></div>
        </div>
      </div>
    </div>
    <div class="hue-container">
      <div class="drag-bar" style="left: 71px;"></div>
    </div>
    <div class="opacity-container" :style="{ background: value }">
      <div class="drag-bar" style="left: 71px;"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ColorPicker",
  props: {
    value: {}
  },
  data() {
    return {
      pointerActive: true,
      opacityNumber: 0.5,
      hueNumber: 0.5,
      colorX: 0.5,
      colorY: 0.5
    };
  },
  computed: {
    resultColor() {
      return Color("#7743CE").alpha(0.5);
    }
  },
  mounted() {},
  watch: {
    resultColor(value) {
      console.log(value);
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
/deep/ .easylogic-colorpicker {
  width: 100% !important;
  background-color: transparent !important;
}
.hue-container {
  height: 8px;
  width: 100%;
  margin: 1rem 0;
  position: relative;
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
  position: relative;
  margin: 1rem 0;
  height: 8px;
  width: 100%;
}
.color {
  position: relative;
  height: 5rem;
  overflow: hidden;
  cursor: pointer;

  * {
    width: 100%;
    height: 100%;
  }

  .value {
    background-image: linear-gradient(0deg, #000, rgba(204, 154, 129, 0));
  }

  .saturation {
    background-image: linear-gradient(90deg, #fff, rgba(204, 154, 129, 0));
    background-repeat: repeat-x;
  }

  .drag-pointer {
    position: absolute;
    width: 10px;
    height: 10px;
    border-radius: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
    .active {
      border: 1px solid #fff;
      box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.05);
    }

    left: 50px;
  }
}
.drag-bar {
  position: absolute;

  transform: translateX(-50%) translateY(-50%);
  width: 8px;
  height: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.2);

  cursor: grab;

  border-radius: 50%;
  background-color: #fefefe;

  top: 50%;
  left: 0;
}
</style>
