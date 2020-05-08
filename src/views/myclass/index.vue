<template>
  <div>
    <my-class-nav />
    <div>myclass-head</div>
    <div>myclass-main</div>
  </div>
</template>

<script>
import MyClassNav from "@c/my-class/my-class-nav";

export default {
  name: "MyClass",
  data() {
    return {};
  },
  components: {
    MyClassNav
  }
};
</script>

<style lang="scss" scoped></style>
