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
        <div class="secondary-title">
          <div class="title-line"></div>
          <span>{{ secondaryTitle }}</span>
          <div class="title-line"></div>
        </div>
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
  padding: 2rem 2rem;
  min-height: 10rem;
}
/deep/ .el-dialog__footer {
  padding: 0 2rem 2rem 2rem;
}
.custom-dialog-title {
  background: url("../assets/images/img1/dialog-banner_2x.png");
  padding: 0;
  min-height: 100px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}
.dialog-footer {
  text-align: center;
  border-radius: 50%;
}
.cancel {
  background: #bbbbbbff;
  border-color: #bbbbbbff;
}
.footer-btn {
  font-size: 0.8rem;
  padding: 0.5rem;
  border-radius: 1rem;
  width: 80px;
}
.title {
  color: white;

  width: 100%;
  position: absolute;
  top: 50%;
  left: 50%;
  text-align: center;
  height: 1;
  transform: translateX(-50%) translateY(-50%);
  padding-bottom: 2px;
  /*border-bottom: 2px #fff solid;*/
}
.title-line {
  display: inline-block;

  margin: 0.125rem 0.5rem;
  width: 2rem;
  background: #fff;
  height: 1px;
}

.main-title {
  font-size: 1.75rem;
  font-weight: 500;
  letter-spacing: 0.5rem;
  text-align: center;
}
.secondary-title {
  font-size: 0.5rem;
  letter-spacing: 2px;
  text-align: center;
}
@media (max-width: 1400px) {
  .main-title {
    font-size: 1.75rem;
  }
  .secondary-title {
    font-size: 0.5rem;
  }
}

@media (max-width: 1200px) {
  .main-title {
    font-size: 1.5rem;
  }
  .secondary-title {
    font-size: 0.5rem;
  }
}

@media (max-width: 768px) {
  /deep/ .el-dialog__body {
    padding: 0.5rem 1rem;
    min-height: 10rem;
  }
  .main-title {
    font-size: 1.2rem;
  }
  .secondary-title {
    font-size: xx-small;
  }
  .title-line {
    width: 0.75rem;
    margin: 0.125rem 0.2rem;
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
    width: 30%;
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
