<template>
  <div class="hand" title="举手">
    <hand-inner />
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import { HAND_UP_STATUS } from "@/models/handUpStatus";
import HandInner from "./hand-inner";

export default {
  components: {
    HandInner
  }
};
</script>
<style lang="scss" scoped>
.hand {
  width: 70px;
  height: 70px;
  opacity: 0.5;
  @include themeify {
    background-color: themed("toolbar_bg");
  }
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.45);
  border-radius: 50%;
  position: absolute;
  bottom: 50px;
  right: 10px;
  z-index: 999;
  .hand-inner {
    transform: scale(0.4);
  }
}
.hand:hover {
  transform: scale(1.1);
  opacity: 0.8;
}
</style>
