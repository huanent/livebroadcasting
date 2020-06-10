<template>
  <div class="m-liveroom">
    <div class="m-sidebar"></div>
    <div class="m-main">
      <div class="m-live-area"></div>
      <div class="m-control"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "LivePage",
  data: () => ({
    title: "hello"
  }),
  components: {}
};
</script>

<style lang="scss" scoped>
.m-liveroom {
  height: 100%;
  overflow: hidden;
  .m-sidebar {
    float: left;
    width: 10rem;
    height: 100%;
    background-color: aquamarine;
  }
  .m-main {
    float: left;
    position: relative;
    height: 100%;
    width: calc(100% - 10rem);
    .m-live-area {
      height: 100%;
      width: 100%;
      background-color: aliceblue;
    }
    .m-control {
      padding-right: 0.6rem;
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
    }
  }
}
</style>
