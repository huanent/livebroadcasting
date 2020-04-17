<template>
  <ul class="chatroom-msg-list roll-scroll" ref="messageList">
    <li
      v-for="item in msgList"
      :key="item.ID"
      class="chatroom-msg"
      :class="{ 'own-msg': item.flow === 'out', 'teacher-msg': item.isTeacher }"
    >
      <div class="chatroom-msg-head">
        <img class="chatroom-msg__avatar" :src="item.avatar" />
        <div class="chatroom-msg-user">
          <span class="chatroom-msg__name">{{ item.nick }}</span>
          <span class="chatroom-msg__time">{{ item.time }}</span>
        </div>
      </div>
      <div class="chatroom-msg-body">
        <div class="chatroom-msg__detail">
          <div class="chatroom-msg__inner">
            {{ item.payload.text }}
          </div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: "ChatroomMessage",
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
    }
  }
};
</script>

<style lang="scss" scoped>
.chatroom-msg-list {
  height: calc(100% - 60px);
  overflow: auto;
  scroll-behavior: smooth;
  .chatroom-msg {
    margin-top: 10px;
    padding: 0 10px 10px;
    .chatroom-msg-head {
      display: flex;
      align-items: center;
      color: #8a9099;
      font-size: 12px;
      .chatroom-msg__avatar {
        display: inline-block;
        width: 20px;
        height: 20px;
        border-radius: 10px;
      }
      .chatroom-msg-user {
        display: inline-block;
        .chatroom-msg__time,
        .chatroom-msg__name {
          line-height: 1.2;
          margin-left: 5px;
          max-width: 100px;
          overflow: hidden;
          -o-text-overflow: ellipsis;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      }
    }
    .chatroom-msg-body {
      padding: 5px 25px 0 30px;
      .chatroom-msg__detail {
        padding-top: 5px;
        position: relative;
        display: inline-block;
        min-width: 30px;
        .chatroom-msg__inner {
          color: #212224;
          padding: 10px;
          line-height: normal;
          background: #8a9099;
          text-align: left;
          border-radius: 4px;
        }
        &:before {
          font-size: 0;
          position: absolute;
          width: 0;
          height: 0;
          content: "";
          border: 5px dashed rgba(0, 0, 0, 0);
          top: -5px;
          left: 0;
          transform: translateX(100%);
          border-bottom-color: #8a9099;
        }
      }
    }
  }
  .own-msg {
    .chatroom-msg-head {
      direction: rtl;
      text-align: right;
      .chatroom-msg__time,
      .chatroom-msg__name {
        margin-left: 0 !important;
        margin-right: 5px;
      }
    }
    .chatroom-msg-body {
      direction: rtl;
      text-align: right;
    }
  }
  .teacher-msg {
    .chatroom-msg-body {
      .chatroom-msg__detail {
        &:before {
          border-bottom-color: #0a818c;
          left: auto;
          right: 0;
          transform: translateX(-100%);
        }
        .chatroom-msg__inner {
          background-color: #0a818c;
          color: #dcebeb;
        }
      }
    }
  }
}
</style>
