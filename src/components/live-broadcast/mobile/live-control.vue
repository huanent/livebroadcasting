<template>
  <div class="live-control">
    <ul class="control-wrap">
      <li><icon name="settings" size="100%" color="#fff"></icon></li>
      <li><icon name="comment-dots" size="100%" color="#fff"></icon></li>
      <li><icon name="wrench" size="100%" color="#fff"></icon></li>
      <li><hand-inner /></li>
    </ul>
  </div>
</template>

<script>
import HandInner from "../hand-up/hand-inner";
export default {
  name: "LiveControl",
  data: () => ({
    title: "hello"
  }),
  components: {
    HandInner
  }
};
</script>

<style lang="scss" scoped>
.live-control {
  position: absolute;
  right: 1rem;
  top: 0;
  bottom: 0;
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  .control-wrap {
    > li {
      padding: 0.3rem;
      margin: 0.8rem;
      background-color: #242c2c;
      border-radius: 50%;
      width: 1.5rem;
      height: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0.8;
      & > * {
        transform: scale(0.7);
      }
    }
  }
}
</style>
