<template>
  <div>
    <my-class-head :avatar="avatar" :nickname="nickname" />
    <my-class-main />
  </div>
</template>

<script>
import MyClassHead from "./my-class-head";
import MyClassMain from "./my-class-main";

export default {
  name: "MyClass",
  props: {
    avatar: String,
    nickname: String
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
