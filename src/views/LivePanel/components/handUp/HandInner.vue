<template>
  <div class="hand-inner" @click="HAND_UP" title="举手">
    <icon
      :name="
        handUp == HAND_UP_STATUS.SPEAKING || HAND_UP_STATUS.DRAWING
          ? 'microphone'
          : 'hand'
      "
      size="100%"
      :class="{ asking: asking }"
    ></icon>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";
import { HAND_UP_STATUS } from "@/models/handUpStatus";

export default {
  name: "HandInner",
  computed: {
    ...mapState("features", ["handUp"]),
    asking() {
      return this.handUp == HAND_UP_STATUS.UPING;
    }
  },
  methods: {
    ...mapMutations("features", ["HAND_UP", "SWITCH_SPEAKING"])
  },
  watch: {
    handUp(value) {
      this.SWITCH_SPEAKING(value);
    }
  }
};
</script>
<style lang="scss" scoped>
.hand-inner {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .svg-icon {
    fill: #fff;
  }
  .asking {
    animation: flashing 0.5s infinite alternate-reverse;
  }
  @keyframes flashing {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
}
</style>
