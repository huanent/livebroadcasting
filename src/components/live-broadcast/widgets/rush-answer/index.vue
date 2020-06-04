<template>
  <div class="content" v-if="rush.visible">
    <Controller v-if="isTeacher" />
    <Answer v-else />
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from "vuex";

import Controller from "./controller";
import Answer from "./answer";

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
    ...mapGetters("workplace", ["isTeacher"])
  }
};
</script>
