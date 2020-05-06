<template>
  <div class="chatroom-container">
    <chatroom-body
      :msgList="msgList"
      ref="chatroom-body"
      @loadMore="loadMore"
    />
    <chatroom-footer @send="sendMessage" />
  </div>
</template>

<script>
import ChatroomBody from "./chatroom-body";
import ChatroomFooter from "./chatroom-footer";

import { Emitter } from "../../../core/emit";
import { mapMutations } from "vuex";

export default {
  name: "Chatroom",
  data() {
    return {
      msgList: [
        {
          ID: "112211312",
          type: "TIM.TYPES.MSG_TEXT",
          nick: "caffrey",
          time: "10:02:5211111",
          flow: "in",
          conversationID: "",
          conversationType: "TIM.TYPES.CONV_GROUP",
          to: "",
          from: "",
          status: "success",
          isRevoked: false,
          avatar: "http://oa.jinrui.kooboo.site/img/avatar1.jpg",
          payload: {
            data: "消息内容"
          },
          isTeacher: false
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
            data:
              "消息内,消息内容消息内容消息内容,消息内容消息内容消息内容,消息内容消息内容消息内容容"
          },
          isTeacher: true
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
            data:
              "消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容"
          },
          isTeacher: false
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
            data:
              "消息消息内容消息内容,消息内容消息内容,消息内容消息内容消息内容消息内容,消息内容消息内容内容"
          },
          isTeacher: true
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
            data: "消息内容"
          },
          isTeacher: false
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
            data:
              "消息内,消息内容消息内容消息内容,消息内容消息内容消息内容,消息内容消息内容消息内容容"
          },
          isTeacher: true
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
            data:
              "消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容"
          },
          isTeacher: false
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
            data:
              "消息消息内容消息内容,消息内容消息内容,消息内容消息内容消息内容消息内容,消息内容消息内容内容"
          },
          isTeacher: true
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
            data: "消息内容"
          },
          isTeacher: false
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
            data:
              "消息内,消息内容消息内容消息内容,消息内容消息内容消息内容,消息内容消息内容消息内容容"
          },
          isTeacher: true
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
            data:
              "消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容消息内容"
          },
          isTeacher: false
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
            data:
              "消息消息内容消息内容,消息内容消息内容,消息内容消息内容消息内容消息内容,消息内容消息内容内容"
          },
          isTeacher: true
        }
      ]
    };
  },
  mounted() {
    Emitter.on("TIM_CUSTOM_MESSAGE", msg => {
      this.msgList.push(msg);
      this.$refs["chatroom-body"].scrollToBottom();
    });
  },
  methods: {
    ...mapMutations("workplace", ["SEND_MESSAGE"]),
    loadMore() {
      const currentScrollHeight = this.$refs["chatroom-body"].$refs[
        "message-list"
      ].$el.scrollHeight;
      console.log(currentScrollHeight);
      // this.$refs["chatroom-body"].scrollToCurrent(currentScrollHeight);
      this.$refs["chatroom-body"].scrollToBottom();
    },
    async sendMessage(msg) {
      await this.SEND_MESSAGE(msg);
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
          data: msg
        },
        isTeacher: true
      });
      this.$refs["chatroom-body"].scrollToBottom();
    }
  },
  components: {
    ChatroomBody,
    ChatroomFooter
  }
};
</script>

<style lang="scss" scoped>
.chatroom-container {
  min-width: 240px;
  height: 100%;
  position: relative;
  @include themeify {
    background: themed("background_color3");
  }
}
</style>
