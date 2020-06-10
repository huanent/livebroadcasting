<template>
  <div class="live-control">
    <ul class="control-wrap">
      <li><icon name="settings" :size="16" color="#fff"></icon></li>
      <li><icon name="comment-dots" :size="14" color="#fff"></icon></li>
      <li><icon name="wrench" :size="14" color="#fff"></icon></li>
      <li><icon name="hand" :size="14" color="#fff"></icon></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "LiveControl",
  data: () => ({
    title: "hello"
  })
};
</script>

<style lang="scss" scoped>
.live-control {
  position: absolute;
  right: 10px;
  top: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  .control-wrap {
    > li {
      padding: 0.1rem;
      background-color: #242c2c;
      border-radius: 50%;
      width: 1.6rem;
      height: 2rem;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 0.5rem;
    }
  }
}
</style>
