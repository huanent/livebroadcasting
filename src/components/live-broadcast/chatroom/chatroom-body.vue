<template>
  <div class="chatroom-body">
    <chatroom-message
      :msgList="msgList"
      ref="message-list"
      @loadMore="$emit('loadMore')"
    />
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
  mounted() {
    this.scrollToBottom();
  },
  methods: {
    scrollToCurrent(height) {
      const ele = this.$refs["message-list"].$el;
      console.log("hellp", ele);
      if (ele) {
        this.$nextTick(() => {
          const scrollHeight = ele.scrollHeight;
          console.log(height, scrollHeight);
          this.$nextTick(() => {
            ele.scrollTop = scrollHeight - height;
          });
        });
      }
    },
    scrollToBottom() {
      const ele = this.$refs["message-list"].$el;
      if (ele) {
        const offsetHeight = ele.offsetHeight;
        const scrollHeight = ele.scrollHeight;
        if (scrollHeight > offsetHeight) {
          this.$nextTick(() => {
            ele.scrollTop = scrollHeight;
          });
        }
      }
    }
  },
  components: {
    ChatroomMessage
  }
};
</script>

<style lang="scss" scoped>
.chatroom-body {
  padding-bottom: 20px;
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  .chatroom-msg-list {
    height: calc(100% - 60px);
    overflow: auto;
    scroll-behavior: smooth;
  }
}
</style>
