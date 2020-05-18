<template>
  <div class="chatroom-body">
    <ul class="chatroom-msg-list roll-scroll" ref="messageList">
      <li
        v-for="(item, index) in chatMessages"
        :key="index"
        class="chatroom-msg"
        :class="{
          'own-msg': item.username == userInfo.username,
          'teacher-msg': item.isTeacher
        }"
      >
        <ChatroomMessage :message="item"></ChatroomMessage>
      </li>
    </ul>
  </div>
</template>

<script>
import ChatroomMessage from "./chatroom-message";
import { mapState } from "vuex";

export default {
  name: "ChatroomBody",
  computed: {
    ...mapState("workplace", ["chatMessages"]),
    ...mapState("account", ["userInfo"])
  },
  methods: {
    scrollToCurrent(height) {
      const ele = this.$refs["message-list"].$el;
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
      const ele = this.$refs.messageList;
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
  },
  watch: {
    chatMessages() {
      this.scrollToBottom();
    }
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

.chatroom-msg-list {
  height: calc(100% - 60px);
  .load-more {
    color: #839494;
    margin-top: 15px;
    padding: 0 10px 10px;
    > div {
      cursor: pointer;
      display: flex;
      width: 100px;
      align-items: center;
      justify-content: space-around;
      margin: 0 auto;
    }
  }
}
</style>
