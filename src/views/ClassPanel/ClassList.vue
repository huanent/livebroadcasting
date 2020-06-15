<template>
  <div>
    <class-panel-header :userInfo="userInfo" />
    <class-panel-main />
  </div>
</template>

<script>
import ClassPanelHeader from "./components/ClassPanelHeader";
import ClassPanelMain from "./components/ClassPanelMain";

export default {
  name: "ClassList",
  props: {
    userInfo: Object
  },
  data() {
    return {};
  },
  components: {
    ClassPanelHeader,
    ClassPanelMain
  }
};
</script>
