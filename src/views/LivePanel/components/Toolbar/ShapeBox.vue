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
      ],
      thinSelectsData: [
        { size: 20 },
        { size: 100 },
        { size: 200 },
        { size: 400 }
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
      this.SET_BRUSH_COLOR(color);
    },
    onSlider(num) {
      this.SET_BRUSH_THIN(num);
    },
    selectedThin(item) {
      this.onSlider(item.size);
      this.brushThin = this.$store.state.board.brushThin;
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
  border: solid 2px #aaaaaa;
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
</style>
