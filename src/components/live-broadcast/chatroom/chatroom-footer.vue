<template>
  <div class="chatroom-footer">
    <el-input
      v-model="message"
      placeholder="请输入消息"
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
      message: ""
    };
  },
  methods: {
    onSubmit() {
      if (this.message.trim().length === 0) return;
      this.$emit("send", this.message);
      this.message = "";
    }
  }
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
  /*
  @include themeify {
    background: themed("background_color1");
  }
  background: #292b2e;
*/

  @include themeify {
    border-top: 1px solid themedOpacity("color_opposite", 0.1);
  }

  /deep/ .el-input__inner {
    @include themeify {
      border-color: themedOpacity("color_opposite", 0.1);
      background: themedOpacity("color_like", 0.1);
      color: themedOpacity("color_opposite", 0.9);
    }
  }
}
</style>
