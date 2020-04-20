<template>
  <div class="shape-box">
    <div class="block">
      <el-slider v-model="thickness"></el-slider>
    </div>
    <div>
      <ul class="shape-select">
        <li
          v-for="(item, index) in toolitems"
          :key="index"
          :class="[{ active: toolitemscurrent == index }]"
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
<<<<<<< HEAD
      shapecolor: this.$store.state.brushColor,
      thickness: this.$store.state.brushThin,
=======
      shapecolor: "",
>>>>>>> 5207480196c0c7aac664aa671e345dbfd6f12c4b
      toolitemscurrent: 0,
      toolitems: [
        {
          name: "line2",
          shape: "line",
          size: 18
        },
        {
          name: "curve2",
          shape: "curve",
          size: 18
        },
        {
          name: "circle",
          shape: "circle",
          size: 18
        },
        {
          name: "rectangle",
          shape: "rectangle",
          size: 18
        }
      ]
    };
  },
  created() {
    this.shapecolor = this.$store.state.board.brushColor;
  },
  methods: {
    ...mapMutations("board", ["SET_BRUSH_COLOR"]),
    addToolitemClass(index) {
      this.toolitemscurrent = index;
    },
    onColorPicked(color) {
      console.log(color);
      this.SET_BRUSH_COLOR(color);
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
  position: absolute;
  left: -170px;
  top: 0;
  width: 150px;
  background-color: rgba(33, 35, 37, 0.8);
  .shape-select {
    text-align: center;
    padding-left: 5px;
    & :hover {
      background-color: black;
    }
    li {
      text-align: center;
      float: left;
      width: 20px;
      height: 20px;
      line-height: 20px;
      padding: 3px;
      margin-bottom: 5px;
    }
  }
  /deep/.el-color-picker__trigger {
    border: none;
  }
}
.active {
  background-color: black;
}
</style>
