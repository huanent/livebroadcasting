<template>
  <div class="window">
    <slot></slot>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.window {
  position: fixed;
  right: 5rem;
  top: 3rem;
  z-index: 1000;
}
</style>
