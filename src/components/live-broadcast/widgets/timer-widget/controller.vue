<template>
  <div class="item">
    <div>+</div>
    <div>{{ value }}</div>
    <div>-</div>
  </div>
</template>
<script>
export default {
  props: ["value"]
};
</script>
<style lang="scss" scoped>
.item {
  div {
    width: 50px;
    font-size: 30px;
    text-align: center;
  }
}
</style>
