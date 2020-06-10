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
  top: 1rem;
  min-width: 20rem;
  height: 80%;
}
</style>
