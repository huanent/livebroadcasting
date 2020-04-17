<template>
  <div class="chatroom-body">
    <chatroom-message :msgList="msgList" ref="messageList" />
  </div>
</template>

<script>
import ChatroomMessage from "./chatroom-message";

export default {
  name: "ChatroomBody",
  props: {
    msgList: Array
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
  components: {
    ChatroomMessage
  }
};
</script>

<style lang="scss" scoped>
.chatroom-body {
  padding-bottom: 20px;
  height: 100%;
  .chatroom-msg-list {
    height: calc(100% - 60px);
    overflow: auto;
    scroll-behavior: smooth;
  }
}
</style>
