<template>
  <div class="window">
    <header>
      <div class="close" @click="$emit('close')">+</div>
    </header>
    <div>
      <slot />
    </div>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.window {
  header {
    height: 20px;
    background-color: #ddd;
    width: 100%;
    .close {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 0;
      bottom: 0;
      right: 0px;
      font-size: 20px;
      color: #fff;
      transform: rotate(45deg);
      cursor: pointer;
    }
  }
  position: fixed;
  top: 0;
  left: 0;
  box-shadow: 0px 0px 5px #888888;
  background-color: #fff;
}
</style>