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
    return {
    };
  },
  components: {
    Controller,
    Answer
  },
  computed: {
    ...mapState("widget", ["rush"]),
    ...mapState("account", ["role"]),
    visible() {
      if (role == ROLE.TEACHER) return this.rush.visible;
      else {
        return this.rush.stared;
      }
    }
  },
  methods: {
    ...mapMutations("widget", ["SET_RUSH_VISIBLE"]),
    async animationSuccess() {
      await new Promise(res => {
        document.addEventListener("animationend", () => {
          this.isleftAnimation = true;
          res();
        });
      });
      await new Promise(res => {
        document.addEventListener("animationend", () => {
          res();
        });
      });
    },

    async beginRush(callback) {
      this.isrightAnimation = true;
      await this.animationSuccess();
      this.isleftAnimation = false;
      this.isrightAnimation = false;
      callback();
    }
  }
};
</script>
