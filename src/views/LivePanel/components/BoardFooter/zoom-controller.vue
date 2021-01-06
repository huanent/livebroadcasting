<template>
  <div class="zoom-controller">
    <icon
      v-if="canControlBoard"
      name="minus-circle"
      color="#737882"
      @click.native.stop="handleMinus"
    />
    <span>{{ currentFile.scale + "%" }}</span>
    <icon
      v-if="canControlBoard"
      name="plus-circle"
      color="#737882"
      @click.native.stop="handleAdd"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { liveBroadcastService } from "@/core/live-broadcast";

export default {
  name: "ZoomController",
  data() {
    return {
      max: 400,
      min: 100
    };
  },
  computed: {
    ...mapState("features", ["canControlBoard"]),
    ...mapState("board", ["currentFile"])
  },
  methods: {
    ...mapMutations("board", ["SET_BOARD_SCALE"]),
    handleMinus() {
      if (this.currentFile.scale <= this.min) return;
      const scale = this.currentFile.scale - 100;
      this.SET_BOARD_SCALE(scale);
    },
    handleAdd() {
      if (this.currentFile.scale >= this.max) return;
      const scale = this.currentFile.scale + 100;
      this.SET_BOARD_SCALE(scale);
    }
  }
};
</script>

<style lang="scss" scoped>
.zoom-controller {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  padding: 0 1rem;
  color: #8a8a99;
  font-size: 0.875rem;
  > span {
    min-width: 2.5rem;
    padding: 0 0.5rem;
  }
  > /deep/ .svg-icon {
    @include themeify {
      fill: themed("font_color2") !important;
    }
    :hover {
      @include themeify {
        fill: mix(themed("font_color2"), themed("color_opposite"), 70%);
      }
    }
  }
}

.svg-icon {
  height: 14px !important;
  width: 14px !important;
}
@media screen and (max-width: 768px) {
  .svg-icon {
    height: 12px !important;
    width: 12px !important;
  }
}
</style>
