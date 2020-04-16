<template>
  <div class="chatroom-container">
    <chatroom-body :msgList="msgList" ref="chatroomBody" />
    <chatroom-footer @send="sendMessage" />
  </div>
</template>

<script>
import ChatroomBody from "./ChatroomBody";
import ChatroomFooter from "./ChatroomFooter";

export default {
  name: "Chatroom",
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
  methods: {
    sendMessage(msg) {
      this.msgList.push({
        ID: Math.ceil(Math.random() * 10000),
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
          text: msg,
        },
        isTeacher: true,
      });
      console.log(this.$refs["chatroomBody"].scrollToBottom());
    },
  },
  components: {
    ChatroomBody,
    ChatroomFooter,
  },
};
</script>

<style lang="scss" scoped>
.chatroom-container {
  min-width: 240px;
  position: relative;
}
</style>
