<template>
  <div class="hand" @click="HAND_UP" v-if="!handUp" title="举手">
    <icon name="hand" :size="20" class="hand-icon"></icon>
  </div>
</template>
<script>
import { mapMutations, mapState } from "vuex";

export default {
  computed: {
    ...mapState("features", ["handUp"])
  },
  methods: {
    ...mapMutations("features", ["HAND_UP"])
  }
};
</script>
<style lang="scss" scoped>
.hand {
  width: 50px;
  height: 50px;
  opacity: 0.5;
  @include themeify {
    background-color: themed("toolbar_bg");
  }
  box-shadow: 0 0 15px #000;
  border-radius: 25px;
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
