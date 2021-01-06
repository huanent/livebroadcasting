<template>
  <div class="chatroom-container">
    <chatroom-body ref="chatroom-body" @loadMore="loadMore" />
    <chatroom-footer @send="sendMessage" />
  </div>
</template>

<script>
import ChatroomBody from "./ChatroomBody";
import ChatroomFooter from "./ChatroomFooter";
import { Emitter } from "@/core/emit";
import { mapMutations, mapState, mapGetters } from "vuex";
import { liveBroadcastService } from "@/core/live-broadcast";

export default {
  name: "Chatroom",
  computed: {
    ...mapState("account", ["userInfo"]),
    ...mapGetters("workplace", ["isTeacher"])
  },
  methods: {
    ...mapMutations("workplace", ["ADD_CHAT_MESSAGE"]),
    loadMore() {
      const currentScrollHeight = this.$refs["chatroom-body"].$refs[
        "message-list"
      ].$el.scrollHeight;
      this.$refs["chatroom-body"].scrollToBottom();
    },
    async sendMessage(content) {
      let msg = {
        content: content,
        avatar: this.userInfo.avatar,
        nickname: this.userInfo.nickname,
        username: this.userInfo.username,
        isTeacher: this.isTeacher
      };

      let res = await liveBroadcastService.timService.sendMessage(
        JSON.stringify(msg)
      );
      msg.time = new Date(res.data.message.time * 1000);
      this.ADD_CHAT_MESSAGE(msg);
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
    background: themed("background_color5");

    border-top: 1px solid themedOpacity("color_opposite", 0.1);
  }
}
</style>
