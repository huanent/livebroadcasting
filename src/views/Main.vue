<template>
  <div>
    <toolbar />
    <svg-icon icon-class="stop" :size="24" />
    <chatroom />
  </div>
</template>

<script>
import Chatroom from "@c/liveBroadcast/Chatroom/Chatroom";
import Toolbar from "@c/common/Toolbar";
export default {
  name: "Main",
  data() {
    return {};
  },
  components: {
    Chatroom,
    Toolbar,
  },
};
</script>
