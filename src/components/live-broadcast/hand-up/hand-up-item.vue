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
        v-if="this.feature.handUp == HAND_UP_STATUS.UPING"
        @click="manual(HAND_UP_STATUS.SPEAKING)"
      >
        发言
      </el-button>
      <el-button
        type="success"
        round
        size="mini"
        v-if="this.feature.handUp == HAND_UP_STATUS.SPEAKING"
        @click="manual(HAND_UP_STATUS.NONE)"
      >
        结束发言
      </el-button>
      <el-button
        type="danger"
        round
        size="mini"
        @click="manual(HAND_UP_STATUS.NONE)"
        v-if="this.feature.handUp == HAND_UP_STATUS.UPING"
      >
        忽略
      </el-button>
    </el-alert>
  </div>
</template>
<script>
import { mapActions } from "vuex";
import { HAND_UP_STATUS } from "../../../models/handUpStatus";
export default {
  props: ["feature"],
  data() {
    return {
      loading: false
    };
  },
  methods: {
    ...mapActions("features", ["manualControlFeatures"]),
    manual(status) {
      this.loading = true;
      this.manualControlFeatures({
        id: this.feature.__primaryKey,
        propName: "handUp",
        value: status
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
