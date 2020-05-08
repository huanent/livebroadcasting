<template>
  <div class="my-class">
    <my-class-nav />
    <my-class-head />
    <my-class-main />
  </div>
</template>

<script>
import MyClassNav from "@c/my-class/my-class-nav";
import MyClassHead from "@c/my-class/my-class-head";
import MyClassMain from "@c/my-class/my-class-main";

export default {
  name: "MyClass",
  data() {
    return {};
  },
  components: {
    MyClassNav,
    MyClassHead,
    MyClassMain
  }
};
</script>

<style lang="scss" scoped>
.my-class {
  height: 100%;
  background: #f4f4f4;
}
</style>
