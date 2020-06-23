<template>
  <div class="shape-box">
    <div>
      <ul class="shape-select">
        <li
          v-for="(item, index) in toolitems"
          :key="index"
          :class="{ active: toolitemscurrent == item.shape }"
          @click="addToolitemClass(index, item)"
        >
          {{ item.index }}
          <icon :name="item.name" :size="18" />
        </li>
      </ul>
    </div>

    <el-slider
      v-model="brushThin"
      @change="onSlider"
      :min="1"
      :max="500"
    ></el-slider>
    <div>
      <ul class="shape-select brush-thin-select">
        <li
          v-for="(item, index) in thinSelectsData"
          :key="index"
          @click="selectedThin(item)"
        >
          <span
            :style="{
              height: index * 3 + 6 + 'px',
              width: index * 3 + 6 + 'px'
            }"
          ></span>
        </li>
      </ul>
    </div>
    <div>
      <ul
        class="shape-select color-select"
        v-for="(colorSelect, index) in colorSelectsData"
        :key="index"
      >
        <li
          v-for="(item, index) in colorSelect"
          :key="index"
          @click="selectedColor(item)"
        >
          <span
            v-if="!item.type || item.type !== 'colorPicker'"
            :style="{
              background: item.color
            }"
          ></span>
          <icon v-else name="hue-ring"></icon>
        </li>
      </ul>
    </div>
    <div>
      <ColorPicker :value="color"> </ColorPicker>
    </div>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import ColorPicker from "@/components/color-picker";
export default {
  name: "ShapeBox",
  data() {
    return {
      shapecolor: "",
      brushThin: "",
      color: "red",
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
      ],
      thinSelectsData: [
        { size: 20 },
        { size: 100 },
        { size: 200 },
        { size: 400 }
      ],
      colorSelectsData: [
        [
          { color: "#FFFFFF" },
          { color: "#9B9B9B" },
          { color: "#4B4B4B" },
          { color: "#000000" }
        ],
        [
          { color: "#F53636" },
          { color: "#EC6841" },
          { color: "#F9F833" },
          { color: "#B5E848" }
        ],

        [
          { color: "#28E9E3" },
          { color: "#00A0E8" },
          { color: "#9285C1" },
          {
            color:
              "linear-gradient(90deg,rgba(255,0,0,1),rgba(255,0,255,1),rgba(0,0,255,1),rgba(0,255,255,1),rgba(0,255,0,1),rgba(255,255,0,1),rgba(255,0,0,1))",
            type: "colorPicker"
          }
        ]
      ]
    };
  },
  created() {
    this.shapecolor = this.$store.state.board.brushColor;
    this.brushThin = this.$store.state.board.brushThin;
  },
  components: {
    ColorPicker
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
      this.SET_BRUSH_COLOR(color);
    },
    onSlider(num) {
      this.SET_BRUSH_THIN(num);
    },
    selectedThin(item) {
      this.onSlider(item.size);
      this.brushThin = this.$store.state.board.brushThin;
    },
    selectedColor(item) {
      if (!item.type || item.type !== "colorPicker") {
        this.SET_BRUSH_COLOR(item.color);
      }
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
  padding: 0.5rem;
  margin-top: 0.3rem;
  width: 8em;
  @include themeify {
    background-color: themed("background_color3");
    box-shadow: $shadow;
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
.svg-icon {
  @include themeify {
    fill: #aaaaaa;
  }
}
.shape-select > .active {
  .svg-icon {
    @include themeify {
      fill: #e4e7ed;
    }
  }
}

.shape-select > li:hover {
  .svg-icon {
    @include themeify {
      fill: #e4e7ed;
    }
  }
}

/deep/ .el-slider__button {
  width: 8px;
  height: 8px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  box-shadow: 2px 2px 2px 0 rgba(0, 0, 0, 0.2);
}

/deep/ .el-slider__bar {
  background-color: #aaaaaa !important;
}
.brush-thin-select {
  span {
    cursor: pointer;
    background-color: #aaaaaa;
    border-radius: 50%;
  }
  span:hover {
    background-color: #e4e7ed;
  }
}

.color-select {
  display: flex;
  span {
    cursor: pointer;
    width: 0.8rem;
    height: 0.8rem;
  }
  span:hover {
  }
}
/deep/ .svg-icon {
  width: 100% !important;
  height: 100% !important;
}
</style>
