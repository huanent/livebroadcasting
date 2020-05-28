<template>
  <div
    class="hand"
    @click="HAND_UP"
    v-loading="handUp == HAND_UP_STATUS.UPING"
    element-loading-background="rgba(0, 0, 0, 0)"
    title="举手"
  >
    <icon
      :name="handUp == HAND_UP_STATUS.SPEAKING ? 'microphone' : 'hand'"
      :size="25"
    ></icon>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import { HAND_UP_STATUS } from "@/models/handUpStatus";

export default {
  computed: {
    ...mapState("features", ["handUp"])
  },
  methods: {
    ...mapMutations("features", ["HAND_UP", "SWITCH_SPEAKING"])
  },
  watch: {
    handUp(value) {
      switch (this.handUp) {
        case HAND_UP_STATUS.NONE:
        case HAND_UP_STATUS.UPING:
          this.SWITCH_SPEAKING(false);
          break;
        case HAND_UP_STATUS.SPEAKING:
          this.SWITCH_SPEAKING(true);
          break;
        default:
          break;
      }
    }
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
  z-index: 100000;
  display: flex;
  justify-content: center;
  align-items: center;
  .svg-icon {
    @include themeify {
      fill: themed("font_color2");
    }
  }
}
.hand:hover {
  transform: scale(1.1);
  opacity: 0.8;
  .svg-icon {
    @include themeify {
      fill: themed("font_color1");
      transform: scale(1.1);
    }
  }
}
</style>
