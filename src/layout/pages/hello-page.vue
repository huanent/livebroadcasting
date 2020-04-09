<template>
  <div class="main-container">
    {{ msg }}
    {{ $t("login") }}
    <img src="../../assets/1.png" />
  </div>
</template>

<script>
import { mapGetters } from "vuex";
export default {
  name: "hello-page",
  data() {
    return { msg: "hello-page" };
  },
  mounted() {
    console.log(this.token);
    console.log("123");
  },
  computed: {
    ...mapGetters("account", ["token"]),
  },
};
</script>

<style scoped lang="scss">
.main-container {
  background-color: $kb-navy;
}
</style>
