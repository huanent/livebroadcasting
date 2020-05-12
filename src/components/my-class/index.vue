<template>
  <div>
    <my-class-head :userInfo="userInfo" />
    <my-class-main />
  </div>
</template>

<script>
import MyClassHead from "./my-class-head";
import MyClassMain from "./my-class-main";

export default {
  name: "MyClass",
  props: {
    userInfo: Object
  },
  data() {
    return {};
  },
  components: {
    MyClassHead,
    MyClassMain
  }
};
</script>
