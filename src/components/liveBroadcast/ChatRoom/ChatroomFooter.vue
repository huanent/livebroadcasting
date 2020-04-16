<template>
  <div class="chatroom-footer">
    <el-input v-model="message" size="small" class="mr10"></el-input>
    <el-button type="primary" size="small">{{ $t("button.send") }}</el-button>
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
};
</script>

<style lang="scss" scoped>
.chatroom-footer {
  display: flex;
  padding: 15px 10px;
  align-items: center;
  border-top: 1px solid #34363b;
}
</style>
