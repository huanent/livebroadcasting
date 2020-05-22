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
          {{ item.index }}
          <icon :name="item.name" :size="18" color="#b4b4b5" />
        </li>
        <li ref="colorpck">
          <el-color-picker
            v-model="shapecolor"
            size="mini"
            @change="onColorPicked"
          ></el-color-picker>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";

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
          shape: "line"
        },
        {
          name: "curve2",
          shape: "curve"
        },
        {
          name: "circle",
          shape: "circle"
        },
        {
          name: "rectangle",
          shape: "rectangle"
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
        this.SET_TOOL_LINE();
      }
      if (item.shape == "curve") {
        this.SET_TOOL_PEN();
      }
      if (item.shape == "circle") {
        this.SET_TOOL_OVAL();
      }
      if (item.shape == "rectangle") {
        this.SET_TOOL_RECT();
      }
    },
    onColorPicked(color) {
      console.log(color);
      this.SET_BRUSH_COLOR(color);
    },
    onSlider(num) {
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
  @include themeify {
    background-color: themed("background_color3");
    border: 1px solid themed("background_color5");
  }
  background-color: rgba(48, 49, 51, 0.79);
  .shape-select {
    display: flex;
    align-items: center;
    justify-content: space-between;
    li {
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      width: 1.1rem;
      height: 1.1rem;
      padding: 0.2rem;
      &:hover svg {
        @include themeify {
          fill: themed("toolbar_icon") !important;
        }
      }
      &:not(:first-child) {
        margin-left: 0.2rem;
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
  // background-color: black;
  @include themeify {
    box-shadow: 0 0 0px 1px themed("toolbar_icon");
  }
  // box-shadow: 0 0 0px 1px #888888;
  // @include themeify {
  //   background-color: themed("background_color5");
  // }
  svg {
    // fill: rgb(255, 255, 255) !important;
    @include themeify {
      fill: themed("toolbar_icon") !important;
    }
  }
}
</style>
