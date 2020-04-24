<template>
  <div class="text-box">
    <div class="block">
      <el-slider
        v-model="fontSize"
        @change="onSlider"
        :min="100"
        :max="500"
      ></el-slider>
    </div>
    <div>
      <el-color-picker
        style="border:none"
        v-model="textcolor"
        size="small"
        @change="onColorPicked"
      ></el-color-picker>
    </div>
  </div>
</template>
<script>
import { mapGetters, mapMutations } from "vuex";
export default {
  name: "TextBox",
  data() {
    return {
      fontSize: "",
      textcolor: ""
    };
  },
  created() {
    this.textcolor = this.$store.state.board.textColor;
    this.fontSize = this.$store.state.board.textSize;
  },
  methods: {
    ...mapMutations("board", ["SET_TEXT_COLOR", "SET_TEXT_SIZE"]),
    onColorPicked(color) {
      console.log(color);
      this.SET_TEXT_COLOR(color);
    },
    onSlider(num) {
      console.log(num);
      this.SET_TEXT_SIZE(num);
    }
  }
};
</script>
<style lang="scss" scoped>
.text-box {
  text-align: center;
  padding: 0.7rem;
  // position: absolute;
  // left: -170px;
  // top: 30px;
  width: 9.4rem;
  background-color: rgba(33, 35, 37, 0.79);
  /deep/.el-color-picker__trigger {
    border: none;
  }
}
</style>
