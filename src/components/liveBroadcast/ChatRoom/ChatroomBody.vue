<template>
  <div class="chatroom-body">
    <ul class="chatroom-msg-list roll-scroll" ref="messageList">
      <message-item v-for="item in msgList" :key="item.ID" :item="item" />
    </ul>
  </div>
</template>

<script>
import MessageItem from "./MessageItem";

export default {
  name: "ChatroomBody",
  props: {
    msgList: Array,
  },
  data() {
    return {};
  },
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    scrollToBottom() {
      const ele = this.$refs["messageList"];
      if (ele) {
        const offsetHeight = ele.offsetHeight;
        const scrollHeight = ele.scrollHeight;
        if (scrollHeight > offsetHeight) {
          this.$nextTick(() => {
            ele.scrollTop = scrollHeight;
          });
        }
      }
    },
  },
  components: {
    MessageItem,
  },
};
</script>

<style lang="scss" scoped>
.chatroom-body {
  padding-bottom: 20px;
  height: 100%;
  .chatroom-msg-list {
    height: calc(100% - 60px);
    overflow: auto;
  }
}
</style>
