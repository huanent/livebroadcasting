<template>
  <div class="hand-up-item">
    <el-alert type="warning" :closable="false">
      {{ feature.__nickName || feature.__primaryKey }} <strong>举手！</strong>
      <el-button type="success" round size="mini">发言</el-button>
      <el-button type="danger" round size="mini" @click="clear">忽略</el-button>
    </el-alert>
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
.el-alert {
  @include themeify {
    background-color: themed("toolbar_bg");
  }
  opacity: 0.5;
  box-shadow: 0 0 15px #000;
  &:hover {
    opacity: 0.8;
  }
}
</style>
