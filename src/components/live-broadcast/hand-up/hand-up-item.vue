<template>
  <div class="hand-up-item">
    <span class="name">{{ feature.__nickName || feature.__primaryKey }}</span>
    <div class="speak">发言</div>
    <div class="clear" @click="clear">清除</div>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: ["feature"],
  methods: {
    ...mapActions("features", ["manualControlFeatures"]),
    clear() {
      this.manualControlFeatures({
        id: this.feature.__primaryKey,
        propName: "handUp",
        value: false
      });
    }
  }
};
</script>
<style lang="scss" scoped>
.hand-up-item {
  @include themeify {
    background-color: themed("toolbar_bg");
  }
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.25);
  color: #fff;
  font-size: 14px;
  * {
    display: inline-block;
    padding: 5px;
  }
  .clear {
    background-color: rgb(248, 89, 89);
  }
  .speak {
    background-color: rgb(89, 216, 248);
  }
}
</style>
