<template>
  <div class="hand-up-item">
    <el-alert
      type="warning"
      :closable="false"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      {{ feature.__nickName || feature.__primaryKey }} <strong>举手！</strong>
      <el-button
        type="success"
        round
        size="mini"
        v-if="!speaking"
        @click="speak"
      >
        发言
      </el-button>
      <el-button
        type="success"
        round
        size="mini"
        v-if="speaking"
        @click="stopSpeak"
      >
        结束发言
      </el-button>
      <el-button
        type="danger"
        round
        size="mini"
        @click="clear"
        v-if="!speaking"
      >
        忽略
      </el-button>
    </el-alert>
  </div>
</template>
<script>
import { mapActions } from "vuex";
export default {
  props: ["feature"],
  data() {
    return {
      loading: false
    };
  },
  computed: {
    speaking() {
      return this.feature.canControlBoard && this.feature.subscribeAudio;
    }
  },
  methods: {
    ...mapActions("features", ["manualControlFeatures"]),
    clear() {
      this.loading = true;
      this.manualControlFeatures({
        id: this.feature.__primaryKey,
        propName: "handUp",
        value: false
      });
    },
    speak() {
      this.loading = true;
      this.manualControlFeatures({
        id: this.feature.__primaryKey,
        value: [
          { propName: "canControlBoard", value: true },
          { propName: "subscribeAudio", value: true }
        ]
      });
    },
    stopSpeak() {
      this.loading = true;
      this.manualControlFeatures({
        id: this.feature.__primaryKey,
        value: [
          { propName: "canControlBoard", value: false },
          { propName: "subscribeAudio", value: false },
          { propName: "handUp", value: false }
        ]
      });
    }
  },
  watch: {
    feature() {
      this.loading = false;
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
