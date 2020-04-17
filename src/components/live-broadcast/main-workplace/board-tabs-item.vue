<template>
  <div v-show="isActive">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "BoardTabsItem",
  data() {
    return {
      isActive: false
    };
  }
};
</script>

<style scoped></style>
