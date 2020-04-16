<template>
  <div class="main-workplace-container">
    <Toolbar></Toolbar>
  </div>
</template>

<script>
import Toolbar from "../common/Toolbar/index";
export default {
  name: "MainWorkplace",
  components: { Toolbar },
};
</script>

<style scoped lang="scss">
.main-workplace-container {
  height: 100%;
  width: 100%;
}
</style>
