<template>
  <div class="shape-box">
    <div class="block">
      <el-slider
        v-model="brushThin"
        @change="onSlider"
        :min="1"
        :max="500"
      ></el-slider>
    </div>
    <div>
      <ul class="shape-select">
        <li
          v-for="(item, index) in toolitems"
          :key="index"
          :class="[{ active: toolitemscurrent == item.shape }]"
          @click="addToolitemClass(index, item)"
        >
          <a
            >{{ item.index
            }}<icon :name="item.name" :size="item.size" color="#b4b4b5"
          /></a>
        </li>
      </ul>
    </div>
    <div ref="colorpck">
      <el-color-picker
        v-model="shapecolor"
        size="mini"
        @change="onColorPicked"
      ></el-color-picker>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapMutations } from "vuex";

export default {
  name: "ShapeBox",
  data() {
    return {
      shapecolor: "",
      brushThin: "",
      toolitemscurrent: "curve",
      toolitems: [
        {
          name: "line2",
          shape: "line",
          toolNum: 4,
          size: 18
        },
        {
          name: "curve2",
          shape: "curve",
          toolNum: "",
          size: 18
        },
        {
          name: "circle",
          shape: "circle",
          toolNum: 5,
          size: 18
        },
        {
          name: "rectangle",
          shape: "rectangle",
          toolNum: 6,
          size: 18
        }
      ]
    };
  },
  created() {
    this.shapecolor = this.$store.state.board.brushColor;
    this.brushThin = this.$store.state.board.brushThin;
  },
  methods: {
    ...mapMutations("board", [
      "SET_BRUSH_COLOR",
      "SET_BRUSH_THIN",
      "SET_TOOL_TYPE"
    ]),
    addToolitemClass(index, item) {
      this.toolitemscurrent = item.shape;
      if (item.shape == "line") {
        console.log("选择了直线");
        this.SET_TOOL_TYPE(item.toolNum);
      }
      if (item.shape == "curve") {
        console.log("选择了曲线");
        this.SET_TOOL_TYPE(item.toolNum);
      }
      if (item.shape == "circle") {
        console.log("选择了圆形");
        this.SET_TOOL_TYPE(item.toolNum);
      }
      if (item.shape == "rectangle") {
        console.log("选择了矩形");
        this.SET_TOOL_TYPE(item.toolNum);
      }
    },
    onColorPicked(color) {
      console.log(color);
      this.SET_BRUSH_COLOR(color);
    },
    onSlider(num) {
      console.log(num);
      this.SET_BRUSH_THIN(num);
    }
  }
};
</script>
<style lang="scss" scoped>
.svg-bold {
  font-weight: 100;
}
.shape-box {
  text-align: center;
  padding: 10px;
  margin-top: 4px;
  // position: absolute;
  // left: -170px;
  // top: 0;
  width: 150px;
  background-color: rgba(33, 35, 37, 0.8);
  .shape-select {
    text-align: center;
    & :hover {
      background-color: black;
    }
    ul :nth-child(1) {
      text-align: center;
      float: left;
      width: 20px;
      height: 20px;
      line-height: 20px;
      padding: 3px;
      margin-bottom: 5px;
      margin-top: 1px;
      margin-left: 0px;
    }
    li {
      text-align: center;
      float: left;
      width: 20px;
      height: 20px;
      line-height: 20px;
      padding: 3px;
      margin-bottom: 5px;
      margin-top: 1px;
      margin-left: 3px;
    }
  }
  /deep/.el-color-picker__trigger {
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
  }
  /deep/.el-color-picker--mini .el-color-picker__trigger {
    height: 27px;
    width: 27px;
  }
}
.active {
  background-color: black;
  box-shadow: 0 0 0px 1px #888888;
}
</style>
