<template>
  <div>
    <my-class-head />
    <my-class-main />
  </div>
</template>

<script>
import MyClassHead from "@c/my-class/my-class-head";
import MyClassMain from "@c/my-class/my-class-main";

export default {
  name: "MyClass",
  data() {
    return {};
  },
  components: {
    MyClassHead,
    MyClassMain
  }
};
</script>
