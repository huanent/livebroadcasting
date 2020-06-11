<template>
  <div class="content" v-if="rush.visible">
    <Controller v-if="isTeacher" :class="{ 'mobile-scale': isMobile }" />
    <Answer v-else :class="{ 'mobile-scale': isMobile }" />
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
    ...mapState("device", ["isMobile"]),
    ...mapGetters("workplace", ["isTeacher"])
  }
};
</script>
