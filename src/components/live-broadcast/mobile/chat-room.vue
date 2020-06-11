<template>
  <window class="chat-room">
    <chat-room />
  </window>
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
  position: fixed;
  right: 4rem;
  top: 3rem;
}
</style>
