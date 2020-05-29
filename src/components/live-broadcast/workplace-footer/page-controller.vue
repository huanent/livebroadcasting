<template>
  <div class="page-controller" v-if="canControlBoard">
    <icon
      name="chevron-circle-left"
      color="#737882"
      :size="14"
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
      :size="14"
      @click.native.stop="handleAdd"
      v-if="canControlBoard"
    />
  </div>
</template>

<script>
import { mapState, mapMutations } from "vuex";

import { liveBroadcastService } from "../../../core/live-broadcast/live-broadcast-service";

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
    display: inline-block;
    vertical-align: middle;
    font-size: 14px;
    padding: 0 4px;
    > em {
      font-style: normal;
      color: #4f5359;
    }
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
