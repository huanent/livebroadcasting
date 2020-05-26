<template>
  <div class="content" v-if="rush.visible">
    <Controller v-if="role == ROLE.TEACHER" />
    <Answer v-else />
  </div>
</template>
<script>
import { mapState, mapMutations } from "vuex";

import Controller from "./controller";
import Answer from "./answer";
import { ROLE } from "../../../../models/role";

export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Controller,
    Answer
  },
  computed: {
    ...mapState("widget", ["rush"]),
    ...mapState("account", ["role"])
  }
};
</script>
