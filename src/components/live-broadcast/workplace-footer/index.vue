<template>
  <div class="workplace-footer-main">
    <zoom-controller />
    <page-controller />
  </div>
</template>

<script>
import ZoomController from "./zoom-controller";
import PageController from "./page-controller";
export default {
  name: "WorkplaceFooter",
  data() {
    return {};
  },
  components: {
    ZoomController,
    PageController
  }
};
</script>

<style lang="scss" scoped>
.workplace-footer-main {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
</style>
