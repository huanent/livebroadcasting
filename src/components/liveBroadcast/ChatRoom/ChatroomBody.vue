<template>
  <div class="chatroom-body">
    <ul class="chatroom-msg-list roll-scroll">
      <message-item v-for="item in msgList" :key="item.ID" :item="item" />
    </ul>
  </div>
</template>

<script>
import MessageItem from "./MessageItem";

export default {
  name: "ChatroomBody",
  data() {
    return {
      msgList: [
        {
          ID: "112211312",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "in",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar1.jpg",
          payload: {
            text: "消息内容",
          },
          isTeacher: false,
        },
        {
          ID: "11435",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "out",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar2.jpg",
          payload: {
            text:
              "消息内,消息内容消息内容消息内容,消息内容消息内容消息内容,消息内容消息内容消息内容容",
          },
          isTeacher: true,
        },
        {
          ID: "11232312",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "in",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar1.jpg",
          payload: {
            text:
              "消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容",
          },
          isTeacher: false,
        },
        {
          ID: "11212",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "out",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar2.jpg",
          payload: {
            text:
              "消息消息内容消息内容,消息内容消息内容,消息内容消息内容消息内容消息内容,消息内容消息内容内容",
          },
          isTeacher: true,
        },
        {
          ID: "11211312",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "in",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar1.jpg",
          payload: {
            text: "消息内容",
          },
          isTeacher: false,
        },
        {
          ID: "112312",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "out",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar2.jpg",
          payload: {
            text:
              "消息内,消息内容消息内容消息内容,消息内容消息内容消息内容,消息内容消息内容消息内容容",
          },
          isTeacher: true,
        },
        {
          ID: "1121312",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "in",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar1.jpg",
          payload: {
            text:
              "消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容",
          },
          isTeacher: false,
        },
        {
          ID: "11222",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "out",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar2.jpg",
          payload: {
            text:
              "消息消息内容消息内容,消息内容消息内容,消息内容消息内容消息内容消息内容,消息内容消息内容内容",
          },
          isTeacher: true,
        },
        {
          ID: "112212",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "in",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar1.jpg",
          payload: {
            text: "消息内容",
          },
          isTeacher: false,
        },
        {
          ID: "1422312",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "out",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar2.jpg",
          payload: {
            text:
              "消息内,消息内容消息内容消息内容,消息内容消息内容消息内容,消息内容消息内容消息内容容",
          },
          isTeacher: true,
        },
        {
          ID: "31231232312",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "in",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar1.jpg",
          payload: {
            text:
              "消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容",
          },
          isTeacher: false,
        },
        {
          ID: "11221321312",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:52",
          flow: "out",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar2.jpg",
          payload: {
            text:
              "消息消息内容消息内容,消息内容消息内容,消息内容消息内容消息内容消息内容,消息内容消息内容内容",
          },
          isTeacher: true,
        },
      ],
    };
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
