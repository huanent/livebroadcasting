<template>
  <div>
    <icon name="comment-dots" size="100%" color="#fff"></icon>
    <window class="chat-room">
      <chat-room />
    </window>
  </div>
</template>
<script>
import Window from "./window";
import ChatRoom from "../chatroom/index";
export default {
  components: {
    Window,
    ChatRoom
  }
};
</script>
<style lang="scss" scoped>
.chat-room {
  height: 80%;
}
</style>
