<template>
  <div class="workplace-footer-main">
    <zoom-controller />
    <page-controller />
    <StepController style="position: absolute;right: 5rem"></StepController>
  </div>
</template>

<script>
import ZoomController from "./zoom-controller";
import PageController from "./page-controller";
import StepController from "./step-controller";
export default {
  name: "WorkplaceFooter",
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
.workplace-footer-main {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid rgba(30, 33, 37, 0.19);
  align-items: center;
}
</style>
