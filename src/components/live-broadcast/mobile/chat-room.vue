<template>
  <div class="chat-room">
    <icon name="comment-dots" size="100%" color="#fff"></icon>
    <window>
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
  position: absolute;
  right: 5rem;
  top: 3rem;
  bottom: 0;
  z-index: 1000;
}
</style>
