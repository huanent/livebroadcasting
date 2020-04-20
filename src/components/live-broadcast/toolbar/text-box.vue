<template>
  <div class="text-box">
    <div class="block">
      <el-slider v-model="fontSize"></el-slider>
    </div>
    <div>
      <el-color-picker
        style="border:none"
        v-model="textcolor"
        size="small"
      ></el-color-picker>
    </div>
  </div>
</template>
<script>
export default {
  name: "TextBox",
  data() {
    return {
      fontSize: this.$store.state.textSize,
      textcolor: this.$store.state.textColor
    };
  },
  mounted: function() {}
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
  /deep/.el-color-picker__trigger {
    border: none;
  }
}
</style>
