<template>
  <div class="hand-up-item">
    <el-alert
      type="warning"
      :closable="false"
      v-loading="loading"
      element-loading-background="rgba(0, 0, 0, 0.8)"
    >
      {{ feature.__nickName || feature.__primaryKey }} <strong>举手！</strong>
      <el-button type="success" round size="mini" @click="operate">
        {{ operationText }}
      </el-button>
      <el-button
        type="danger"
        round
        size="mini"
        @click="manual(HAND_UP_STATUS.NONE)"
      >
        {{ closeText }}
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
  computed: {
    closeText() {
      return this.feature.handUp == HAND_UP_STATUS.UPING ? "忽略" : "结束";
    },
    operationText() {
      switch (this.feature.handUp) {
        case HAND_UP_STATUS.SPEAKING:
          return "启用白板";

        case HAND_UP_STATUS.DRAWING:
          return "禁用白板";

        default:
          return "发言";
      }
    }
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
    },
    operate() {
      switch (this.feature.handUp) {
        case HAND_UP_STATUS.UPING:
          this.manual(HAND_UP_STATUS.SPEAKING);
          break;
        case HAND_UP_STATUS.SPEAKING:
          this.manual(HAND_UP_STATUS.DRAWING);
          break;
        case HAND_UP_STATUS.DRAWING:
          this.manual(HAND_UP_STATUS.SPEAKING);
          break;
        default:
          break;
      }
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
