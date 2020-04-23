<template>
  <div class="workplace-footer-main">
    <zoom-controller />
    <page-controller :page-total="pageTotal" :page-num.sync="pageNum" />
  </div>
</template>

<script>
import ZoomController from "./zoom-controller";
import PageController from "./page-controller";
export default {
  name: "WorkplaceFooter",
  data() {
    return {
      pageTotal: 10,
      pageNum: 5
    };
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
  justify-content: space-between;
  align-items: center;
  padding: 0 10%;
}
</style>
