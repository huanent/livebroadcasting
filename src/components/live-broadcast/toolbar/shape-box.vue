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
            >{{ item.index }}<icon :name="item.name" :size="18" color="#b4b4b5"
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
          toolNum: 4
        },
        {
          name: "curve2",
          shape: "curve",
          toolNum: ""
        },
        {
          name: "circle",
          shape: "circle",
          toolNum: 5
        },
        {
          name: "rectangle",
          shape: "rectangle",
          toolNum: 6
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
      "SET_TOOL_PEN",
      "SET_TOOL_LINE",
      "SET_TOOL_OVAL",
      "SET_TOOL_RECT"
    ]),
    addToolitemClass(index, item) {
      this.toolitemscurrent = item.shape;
      if (item.shape == "line") {
        console.log("选择了直线");
        this.SET_TOOL_LINE();
      }
      if (item.shape == "curve") {
        console.log("选择了曲线");
        this.SET_TOOL_PEN();
      }
      if (item.shape == "circle") {
        console.log("选择了圆形");
        this.SET_TOOL_OVAL();
      }
      if (item.shape == "rectangle") {
        console.log("选择了矩形");
        this.SET_TOOL_RECT();
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
.svg-icon {
  padding: 0rem !important;
}
.shape-box {
  text-align: center;
  padding: 0.7rem;
  margin-top: 0.6rem;
  // position: absolute;
  // left: -170px;
  // top: 0;
  width: 9.4rem;
  background-color: rgba(48, 49, 51, 0.79);
  .shape-select {
    text-align: center;
    & :hover {
      background-color: black;
    }
    li {
      text-align: center;
      float: left;
      width: 1.1rem;
      height: 1.1rem;
      line-height: 1.1rem;
      // padding: 3px 4px 5px 4px;
      padding: 0.2rem 0.25rem 0.25rem 0.25rem;
      /* margin-bottom: 5px; */
      margin-top: 0.1rem;
      margin-left: 0.15rem;
      margin-right: 0.15rem;
      &:hover svg {
        fill: rgb(255, 255, 255) !important;
      }
    }
  }
  /deep/.el-color-picker__trigger {
    border: none;
    border-radius: 0;
    padding: 0;
    margin: 0;
  }
  /deep/.el-color-picker--mini .el-color-picker__trigger {
    height: 1.7rem;
    width: 1.7rem;
  }
}
.active {
  background-color: black;
  box-shadow: 0 0 0px 1px #888888;
  svg {
    fill: rgb(255, 255, 255) !important;
  }
}
</style>
