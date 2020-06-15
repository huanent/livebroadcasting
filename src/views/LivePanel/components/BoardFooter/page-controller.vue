<template>
  <div class="page-controller">
    <icon
      name="chevron-circle-left"
      color="#737882"
      @click.native.stop="handleMinus"
      v-if="canControlBoard"
    />
    <span>
      {{ currentFile.currentPageIndex + 1 + "/" }}
      {{ currentFile.pageCount }}
    </span>
    <icon
      name="chevron-circle-right"
      color="#737882"
      @click.native.stop="handleAdd"
      custom-class="custom-svg-icon"
      v-if="canControlBoard"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import { liveBroadcastService } from "@/core/live-broadcast";

export default {
  name: "PageController",
  computed: {
    ...mapState("account", ["role"]),
    ...mapState("features", ["canControlBoard"]),
    ...mapState("board", ["currentFile"])
  },
  methods: {
    async handleMinus() {
      if (this.currentFile.currentPageIndex <= 0) return;
      liveBroadcastService.boardService.activeBoard.prevBoard(true);
    },
    async handleAdd() {
      if (this.currentFile.currentPageIndex >= this.currentFile.pageCount - 1)
        return;
      liveBroadcastService.boardService.activeBoard.nextBoard(true);
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
  padding: 0 1rem;
  color: #8a9099;
  > span {
    min-width: 2.5rem;
    padding: 0 0.5rem;
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
