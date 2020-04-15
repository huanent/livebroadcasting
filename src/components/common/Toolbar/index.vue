<template>
  <div class="toolbar">
    <svg icon-class="shape" :size="24" color="#333333" />
    <svg-icon icon-class="text" :size="24" color="red" />
    <svg-icon icon-class="laserPen" :size="24" />
    <svg-icon icon-class="eraser" :size="24" />
    <svg-icon icon-class="revoke" :size="24" />
    <svg-icon icon-class="recovery" :size="24" />
    <svg-icon icon-class="empty" :size="24" />
    <svg-icon icon-class="newBuild" :size="20" />
  </div>
</template>

<script>
export default {
  name: "Toolbar",
  data() {
    return {};
  },
  components: {
    // ChatRoom,
  },
};
</script>
