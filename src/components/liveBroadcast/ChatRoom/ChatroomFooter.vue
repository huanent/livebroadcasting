<template>
  <div class="chatroom-footer">
    <el-input
      v-model="message"
      size="small"
      class="mr10"
      @keyup.enter.native="onSubmit"
    ></el-input>
    <el-button type="primary" size="small" @click="onSubmit">{{
      $t("button.send")
    }}</el-button>
  </div>
</template>

<script>
export default {
  name: "ChatroomFooter",
  data() {
    return {
      message: "",
    };
  },
  methods: {
    onSubmit() {
      if (this.message.trim().length === 0) {
        return;
      }
      this.$emit("send", this.message);
      this.message = "";
    },
  },
};
</script>

<style lang="scss" scoped>
.chatroom-footer {
  box-sizing: border-box;
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  align-items: center;
  padding: 0 15px;
  height: 60px;
  background: #292b2e;
  border-top: 1px solid #34363b;
  /deep/ .el-input__inner {
    background-color: #38393f;
    border-color: #38393f;
    color: #dcebeb;
  }
}
</style>
