<template>
  <div class="zoom-controller">
    <icon
      name="minus-circle"
      color="#737882"
      :size="14"
      v-if="canControlBoard"
      @click.native.stop="handleMinus"
    />
    <span>{{ currentFile.scale + "%" }}</span>
    <icon
      name="plus-circle"
      color="#737882"
      :size="14"
      v-if="canControlBoard"
      @click.native.stop="handleAdd"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";
import { liveBroadcastService } from "../../../core/live-broadcast/live-broadcast-service";

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
    handleMinus() {
      if (this.currentFile.scale <= this.min) return;
      liveBroadcastService.boardService.activeBoard.setBoardScale(
        this.currentFile.scale - 100
      );
    },
    handleAdd() {
      if (this.currentFile.scale >= this.max) return;
      liveBroadcastService.boardService.activeBoard.setBoardScale(
        this.currentFile.scale + 100
      );
    }
  }
};
</script>

<style lang="scss" scoped>
.zoom-controller {
  width: 80px;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 0 5px;
  color: #8a9099;
  font-size: 14px;
  > span {
    user-select: none;
  }
  > .svg-icon {
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
</style>
