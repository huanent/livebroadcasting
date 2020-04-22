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
  components: {
    ZoomController,
    PageController
  }
};
</script>

<style lang="scss" scoped>
.workplace-footer-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10%;
}
</style>
