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
      msgList: []
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
