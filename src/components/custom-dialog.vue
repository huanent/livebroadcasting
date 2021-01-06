<template>
  <el-dialog
    :visible="visible"
    :before-close="beforeClose"
    :append-to-body="appendToBody"
    :width="width"
    :class="size"
    @close="closeDialog"
    @closed="$emit('closed', $event)"
    @open="$emit('open', $event)"
    @opened="$emit('opened', $event)"
  >
    <slot name="title" v-if="$slots.title"></slot>
    <div
      v-else
      slot="title"
      class="custom-dialog-title"
      style="position: relative"
    >
      <div class="title">
        <span class="main-title">{{ title }}</span>
      </div>
    </div>
    <slot></slot>
    <slot name="footer" v-if="$slots.footer"></slot>
    <div
      slot="footer"
      class="dialog-footer"
      v-if="footerVisibity && !$slots.footer"
    >
      <el-button
        type="info"
        @click="onCancel($event)"
        class="footer-btn cancel"
        >{{ $t("button.cancel") }}</el-button
      >
      <el-button type="primary" @click="onConfirm($event)" class="footer-btn">{{
        $t("button.yes")
      }}</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: "CustomDialog",
  props: {
    title: { type: String },
    secondaryTitle: { type: String },
    visible: { type: Boolean },
    beforeClose: {},
    onConfirm: {},
    onCancel: {},
    width: {},
    size: {},
    footerVisibity: { type: Boolean, default: false },
    appendToBody: { type: Boolean }
  },
  data() {
    return {
      screenWidth: undefined
    };
  },
  computed: {},
  mounted() {},
  methods: {
    clickConfirm(e) {
      this.$emit("update:visible", false);
      this.$emit("close", e);
    },

    closeDialog(e) {
      this.$emit("update:visible", false);
      this.$emit("close", e);
    }
  }
};
</script>

<style scoped lang="scss">
/deep/ .el-dialog__header {
  padding: 0;
}
/deep/ .el-dialog__close {
  background: white;
  border-radius: 50%;
}
/deep/ .el-dialog__body {
  padding: 1.25rem 2rem 3.4375rem;
}
/deep/ .el-dialog__footer {
  padding: 0 2rem 2rem 2rem;
}
.custom-dialog-title {
  padding: 1.5rem;
}
.dialog-footer {
  text-align: center;
  border-radius: 50%;
}
.cancel {
  background: #ffffff;
  border-color: #d0cfe6;
  color: #b8b8cc;
}
.footer-btn {
  font-size: 0.875rem;
  width: 80px;
}

.main-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a1b29;
  text-align: center;
}

@media (max-width: 768px) {
  /deep/ .el-dialog__body {
    padding: 0.5rem 1rem;
    min-height: 10rem;
  }
}
/deep/ .el-dialog {
  width: 40%;
}
@media (max-width: 1400px) {
  /deep/ .el-dialog {
    width: 40%;
  }
}
@media (max-width: 1200px) {
  /deep/ .el-dialog {
    width: 50%;
  }
}
@media (max-width: 992px) {
  /deep/ .el-dialog {
    width: 80%;
  }
}
@media (max-width: 768px) {
  /deep/ .el-dialog {
    width: 70%;
  }
}
@media (max-width: 480px) {
  /deep/ .el-dialog {
    width: 95%;
  }
}

.mini {
  /deep/ .el-dialog {
    width: 31.3%;
  }
  @media (max-width: 1400px) {
    /deep/ .el-dialog {
      width: 35%;
    }
  }
  @media (max-width: 1200px) {
    /deep/ .el-dialog {
      width: 45%;
    }
  }
  @media (max-width: 992px) {
    /deep/ .el-dialog {
      width: 55%;
    }
  }
  @media (max-width: 768px) {
    /deep/ .el-dialog {
      width: 65%;
    }
  }
  @media (max-width: 480px) {
    /deep/ .el-dialog {
      width: 85%;
    }
  }
}
</style>
