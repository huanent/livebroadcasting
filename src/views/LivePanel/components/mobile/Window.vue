<template>
  <div class="window">
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "Window"
};
</script>
<style lang="scss" scoped>
.window {
  z-index: 1000;
  @include themeify {
    background: themed("background_color3");
  }
  border-radius: 0.2rem;
}
</style>
