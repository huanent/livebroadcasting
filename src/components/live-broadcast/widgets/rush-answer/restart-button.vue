<template>
  <div class="oncebegin" @click="$emit('click')">
    <svg xmlns="http://www.w3.org/2000/svg" version="1.1">
      <ellipse
        cx="70"
        cy="40"
        rx="70"
        ry="40"
        class="hover"
        style="fill:#077b76"
      />
      <text x="43" y="17" fill="white" class="begin">
        重新开始
      </text>
    </svg>
  </div>
</template>
<script>
export default {};
</script>
<style lang="scss" scoped>
.oncebegin {
  position: absolute;
  width: 140px;
  height: 40px;
  bottom: 6px;
  .hover:hover {
    fill: #18908a !important;
  }
  .begin {
    font-size: 12px;
  }
}
</style>
