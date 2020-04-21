<template>
  <div class="board-tabs-item" v-show="isActive">
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

<style scoped>
.board-tabs-item {
  height: 100%;
  width: 100%;
  padding: 2rem;
  display: block !important;
}
</style>
