<template>
  <div
    class="hand"
    @click="HAND_UP"
    v-loading="handUp == HAND_UP_STATUS.UPING"
    element-loading-background="rgba(0, 0, 0, 0)"
    title="举手"
  >
    <icon
      name="hand"
      :size="25"
      :class="handUp == HAND_UP_STATUS.SPEAKING ? 'microphone' : 'hand-icon'"
    ></icon>
    <div class="txt">{{ statusText }}</div>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import { HAND_UP_STATUS } from "@/models/handUpStatus";

export default {
  computed: {
    ...mapState("features", ["handUp"]),
    statusText() {
      switch (this.handUp) {
        case HAND_UP_STATUS.NONE:
          return "举手";
        case HAND_UP_STATUS.UPING:
          return "举手中..";
        case HAND_UP_STATUS.SPEAKING:
          return "发言中..";
        default:
          return "";
      }
    }
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
  .hand-icon {
    @include themeify {
      fill: themed("font_color2");
    }
    margin-top: -10px;
    margin-left: -5px;
  }
  .txt {
    @include themeify {
      color: themed("font_color2");
    }
    position: absolute;
    bottom: 8px;
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
