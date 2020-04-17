<template>
  <div class="text-box">
    <div class="block">
      <el-slider v-model="fontSize"></el-slider>
    </div>
    <div ref="colorpck">
      <el-color-picker v-model="textcolor" size="small"></el-color-picker>
    </div>
  </div>
</template>
<script>
export default {
  name: "TextBox",
  data() {
    return {
      fontSize: 10,
      textcolor: "#000000"
    };
  },
  mounted: function() {
    this.$nextTick(function() {
      this.$refs.colorpck.children[0].children[0].style.border = "none";
    });
  }
};
</script>
<style lang="scss" scoped>
.text-box {
  text-align: center;
  padding: 10px;
  position: absolute;
  left: -170px;
  top: 30px;
  width: 150px;
  background-color: rgba(33, 35, 37, 0.8);
}
</style>
