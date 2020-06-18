<template>
  <div class="board-footer">
    <zoom-controller />
    <StepController />
    <page-controller />
  </div>
</template>

<script>
import ZoomController from "./zoom-controller";
import PageController from "./page-controller";
import StepController from "./step-controller";
export default {
  name: "BoardFooter",
  data() {
    return {};
  },
  components: {
    ZoomController,
    PageController,
    StepController
  }
};
</script>

<style lang="scss" scoped>
.board-footer {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid rgba(30, 33, 37, 0.19);
  align-items: center;
  user-select: none;
}
</style>
