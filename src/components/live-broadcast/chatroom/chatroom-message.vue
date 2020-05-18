<template>
  <div>
    <div class="chatroom-msg-head">
      <img class="chatroom-msg__avatar" :src="avatar" />
      <div class="chatroom-msg-user">
        <span class="chatroom-msg__name">{{
          message.nickname || message.username
        }}</span>
      </div>
    </div>
    <div class="chatroom-msg-body">
      <div class="chatroom-msg__detail">
        <div class="chatroom-msg__inner">
          {{ message.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import avatarImg from "../../../assets/images/avatar.jpg";
export default {
  name: "ChatroomMessage",
  props: ["message"],
  computed: {
    avatar() {
      return this.message.avatar || avatarImg;
    }
  }
};
</script>

<style lang="scss" scoped>
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
        @include themeify {
          background: themed("active_icon");
        }
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
        border-bottom-color: #0a818c !important;
        left: auto;
        right: 0;
        transform: translateX(-100%);
      }
      .chatroom-msg__inner {
        background-color: #0a818c !important;
        color: #dcebeb;
      }
    }
  }
}
</style>
