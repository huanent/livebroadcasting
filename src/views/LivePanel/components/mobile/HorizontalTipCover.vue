<template>
  <div class="cover" v-if="!isHorizontal">
    <h1>请将手机横屏</h1>
  </div>
</template>
<script>
import { mapState } from "vuex";
export default {
  name: "HorizontalTipCover",
  computed: {
    ...mapState("device", ["isHorizontal"])
  }
};
</script>
<style lang="scss" scoped>
.cover {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #ddd;
  z-index: 100000;
}
</style>
