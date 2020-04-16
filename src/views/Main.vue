<template>
  <div>
    <toolbar />
    <svg-icon icon-class="stop" :size="24" />
  </div>
</template>

<script>
// import ChatRoom from "@c/liveBroadcast/ChatRoom";
import Toolbar from "@c/common/Toolbar";
export default {
  name: "Main",
  data() {
    return {};
  },
  components: {
    // ChatRoom,
    Toolbar,
  },
};
</script>
