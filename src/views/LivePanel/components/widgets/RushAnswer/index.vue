<template>
  <div class="content" v-if="rush.visible">
    <controller v-if="isTeacher" :class="{ 'mobile-scale': isMobile }" />
    <answer-info v-else :class="{ 'mobile-scale': isMobile }" />
  </div>
</template>
<script>
import { mapState, mapMutations, mapGetters } from "vuex";

import Controller from "./Controller";
import AnswerInfo from "./AnswerInfo";

export default {
  name: "RushAnswer",
  data() {
    return {};
  },
  components: {
    Controller,
    AnswerInfo
  },
  computed: {
    ...mapState("widget", ["rush"]),
    ...mapState("device", ["isMobile"]),
    ...mapGetters("workplace", ["isTeacher"])
  }
};
</script>
