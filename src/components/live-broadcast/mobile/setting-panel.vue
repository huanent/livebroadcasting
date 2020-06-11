<template>
  <window class="settings">
    <icon name="settings" size="25" color="#fff"></icon>
    <icon name="settings" size="25" color="#fff"></icon>
    <icon name="settings" size="25" color="#fff"></icon>
    <icon name="settings" size="25" color="#fff"></icon>
    <icon name="settings" size="25" color="#fff"></icon>
  </window>
</template>
<script>
import Window from "./window";
export default {
  components: {
    Window
  }
};
</script>
<style lang="scss" scoped>
.settings {
  display: flex;
  flex-wrap: wrap;
  position: fixed;
  width: 8rem;
  right: 4rem;
  top: 30%;
  & > * {
    padding: 0.5rem;
    width: 2rem;
    flex-grow: 1;
  }
}
</style>
