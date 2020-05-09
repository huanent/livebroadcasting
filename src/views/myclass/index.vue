<template>
  <div class="my-class">
    <my-nav />
    <router-view></router-view>
  </div>
</template>

<script>
import MyNav from "./my-nav";

export default {
  name: "MyClass",
  data() {
    return {};
  },
  components: {
    MyNav
  }
};
</script>

<style lang="scss" scoped>
.my-class {
  height: 100%;
  background: #f4f4f4;
}
</style>
