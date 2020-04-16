<template>
  <div>
    <toolbar />
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
