<template>
  <div>
    <my-class-head />
    <my-class-main />
  </div>
</template>

<script>
import MyClassHead from "./my-class-head";
import MyClassMain from "./my-class-main";

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
