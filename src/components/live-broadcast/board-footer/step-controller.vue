<template>
  <div class="page-controller" v-if="canControlBoard">
    <el-tooltip :content="'上一步'" placement="bottom" :open-delay="200">
      <icon
        @click.native.stop="handleMinus"
        name="long-arrow-alt-left"
        color="#737882"
        :size="26"
      />
    </el-tooltip>

    <span></span>
    <el-tooltip :content="'下一步'" placement="bottom" :open-delay="200">
      <icon
        @click.native.stop="handleAdd"
        name="long-arrow-alt-right"
        color="#737882"
        :size="26"
      />
    </el-tooltip>
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import { liveBroadcastService } from "../../../core/live-broadcast";

export default {
  name: "StepController",
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("features", ["canControlBoard"]),
    ...mapState("board", ["currentFile"])
  },
  methods: {
    async handleMinus() {
      if (this.currentFile.currentPageIndex <= 0) return;
      liveBroadcastService.boardService.activeBoard.prevStep(true);
    },
    async handleAdd() {
      if (this.currentFile.currentPageIndex >= this.currentFile.pageCount - 1)
        return;
      liveBroadcastService.boardService.activeBoard.nextStep(true);
    }
  }
};
</script>

<style lang="scss" scoped>
.page-controller {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  text-align: center;
  padding: 0 5px;
  color: #8a9099;
  > span {
    min-width: 2.5rem;
  }
}
.svg-icon {
  @include themeify {
    fill: themed("font_color2") !important;
  }
  :hover {
    @include themeify {
      fill: mix(themed("font_color2"), themed("color_opposite"), 70%);
    }
  }
}
</style>
