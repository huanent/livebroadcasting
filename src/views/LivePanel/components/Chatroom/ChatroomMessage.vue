<template>
  <div class="chatroom-msg">
    <div class="chatroom-msg-head">
      <img class="chatroom-msg__avatar" :src="avatar" />
      <div class="chatroom-msg-user">
        <span v-if="isTeacher" class="teacher-tag">老师</span>
        <span class="chatroom-msg__name">{{ name }}</span>
        <span class="chatroom-msg__time">{{ time }}</span>
      </div>
    </div>
    <div class="chatroom-msg-body">
      <div class="chatroom-msg__detail">
        <span class="chatroom-msg__inner">
          {{ content }}
        </span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ChatroomMessage",
  props: ["avatar", "name", "content", "time", "isTeacher"]
};
</script>

<style lang="scss" scoped>
.chatroom-msg {
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
      max-width: 100%;
      background-color: transparent;
      .chatroom-msg__inner {
        color: #212224;
        padding: 10px;
        max-width: 100%;
        word-break:normal;
        width:auto;
        display:block;
        word-wrap : break-word ;
        overflow: hidden ;
        background: #ffffff;
        text-align: left;
        border-radius: 2px 8px 8px 8px;
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
    .chatroom-msg__detail {
      &:before {
        @include themeify {
          border-bottom-color: themed("primary2");
        }

        left: auto;
        right: 0;
        transform: translateX(-100%);
      }
      .chatroom-msg__inner {
        border-radius: 8px 2px 8px 8px;
        @include themeify {
          background-color: themed("primary");
        }

        color: #dcebeb;
      }
    }
  }
}

.teacher-tag {
  background-color: rgb(253, 87, 87);
  color: #fff;
  margin: 0 5px;
  border-radius: 3px;
  padding: 0px 3px;
}
</style>
