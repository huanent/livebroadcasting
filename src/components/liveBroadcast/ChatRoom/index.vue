<template>
  <div class="chatroom-container">
    <chatroom-body />
    <chatroom-footer />
  </div>
</template>

<script>
import ChatroomBody from "./ChatroomBody";
import ChatroomFooter from "./ChatroomFooter";

export default {
  name: "Chatroom",
  components: {
    ChatroomBody,
    ChatroomFooter,
  },
};
</script>

<style lang="scss" scoped>
.chatroom-container {
  position: relative;
  background-color: $chatroom-bg;
}
</style>
