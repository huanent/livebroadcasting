<template>
  <div class="hand" @click="HAND_UP" v-if="!handUp">
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
  @include themeify {
    background-color: themed("toolbar_bg");
  }
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  border-radius: 25px;
  position: absolute;
  bottom: 50px;
  right: 50px;
  z-index: 100000;
}

.hand-icon {
  @include themeify {
    fill: themed("font_color2");
  }
  padding: 15px 15px;
}
</style>
