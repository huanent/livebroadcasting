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
  border-top: 1px solid rgba(30, 33, 37, 0.19);
  align-items: center;
}
</style>
