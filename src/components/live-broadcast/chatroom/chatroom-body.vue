<template>
  <div class="chatroom-body">
    <ul class="chatroom-msg-list roll-scroll" ref="messageList">
      <li
        v-for="(item, index) in messages"
        :key="index"
        :class="{
          'own-msg': item.username == userInfo.username
        }"
      >
        <ChatroomMessage
          :name="item.name"
          :content="item.content"
          :time="item.time"
          :avatar="item.avatar"
          :is-teacher="item.isTeacher"
        ></ChatroomMessage>
      </li>
    </ul>
  </div>
</template>

<script>
import ChatroomMessage from "./chatroom-message";
import { mapState } from "vuex";
import avatarImg from "../../../assets/images/avatar.jpg";

export default {
  name: "ChatroomBody",
  computed: {
    ...mapState("workplace", ["chatMessages"]),
    ...mapState("account", ["userInfo"]),
    messages() {
      let list = [];
      let lastDateTime = null;

      for (const i of this.chatMessages) {
        let dateTime = this.getDateTime(i.time);
        let showDate = !lastDateTime || lastDateTime.date != dateTime.date;

        list.push({
          avatar: i.avatar || avatarImg,
          content: i.content,
          name: i.nickname || i.username,
          username: i.username,
          time: showDate ? `${dateTime.date} ${dateTime.time}` : dateTime.time,
          isTeacher: i.isTeacher
        });

        lastDateTime = dateTime;
      }

      return list;
    }
  },
  methods: {
    scrollToCurrent(height) {
      const ele = this.$refs["message-list"].$el;
      if (ele) {
        this.$nextTick(() => {
          const scrollHeight = ele.scrollHeight;
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
    },
    getDateTime(current) {
      current = new Date(current);
      return {
        date: `${current.getMonth() + 1}/${current.getDate()}`,
        time: `${current.getHours()}:${current.getMinutes()}:${current.getSeconds()}`
      };
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
  height: 100%;
  overflow: auto;
  scroll-behavior: smooth;
  .chatroom-msg-list {
    height: calc(100% - 60px);
    overflow: auto;
    padding: 0.4rem 0.6rem;
    box-sizing: border-box;
    scroll-behavior: smooth;
    li {
      margin-top: 0.5rem;
    }
  }
}
</style>
